import Elysia from "elysia";
import {
  hydratePicks,
  productPicksOutputSchema,
} from "../lib/recommendations/generate-user-picks";

/** DB legacy rows store the array only; new writes use `{ picks: [...] }` like the agent output. */
function parseStoredPicks(
  raw: unknown,
): { articleId: string; reason: string }[] | null {
  const wrapped = productPicksOutputSchema.safeParse(raw);
  if (wrapped.success) return wrapped.data.picks;
  const arr = productPicksOutputSchema.shape.picks.safeParse(raw);
  if (arr.success) return arr.data;
  return null;
}
import { betterAuthMacro } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { articleCandidateToProduct } from "./catalog";
import {
  buildProfileSummary,
  countArticlesWithEmbeddings,
  embedForSearch,
  findSimilarArticles,
} from "../lib/product-retrieval";
import type { User } from "../generated/prisma/client";

const VECTOR_PREVIEW_MESSAGE =
  "Questa selezione rispecchia il tuo profilo per similarità mentre ultimiamo la cura personalizzata.";

async function buildVectorPreviewItems(
  dbUser: Pick<User, "name" | "mood" | "personality" | "interests">,
) {
  const summary = buildProfileSummary({
    name: dbUser.name,
    mood: dbUser.mood,
    personality: dbUser.personality,
    interests: dbUser.interests,
  });
  const vector = await embedForSearch(summary);
  const candidates = await findSimilarArticles(vector, 15);
  return candidates.map((c) => {
    const p = articleCandidateToProduct(c);
    const { similarity: _omit, ...product } = p;
    return { ...product, reason: "" };
  });
}

/**
 * Consigli giornalieri (cache agente) o anteprima vettoriale se la cache non è valida.
 */
export const recommendations = new Elysia({ prefix: "/recommendations" })
  .use(betterAuthMacro)
  .get(
    "/",
    async ({ user, status }) => {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!dbUser) {
        return status(404, { error: "Utente non trovato" });
      }

      if (
        dbUser.mood.length === 0 &&
        dbUser.personality.length === 0 &&
        dbUser.interests.length === 0
      ) {
        return status(400, {
          error:
            "Profilo vuoto (mood, personalità, interessi). Collega Google e Spotify, poi chiama GET /sync.",
        });
      }

      const embeddedCount = await countArticlesWithEmbeddings();
      if (embeddedCount < 15) {
        return status(400, {
          error: `Servono almeno 15 articoli con embedding (attuali: ${embeddedCount}). Esegui migrazioni pgvector e: bun run db:embed-articles`,
        });
      }

      const row = await prisma.userRecommendation.findUnique({
        where: { userId: dbUser.id },
      });

      if (row) {
        const picks = parseStoredPicks(row.picks);
        if (picks) {
          const hydrated = await hydratePicks(picks);
          if (hydrated) {
            return {
              source: "curated" as const,
              profile: {
                mood: dbUser.mood,
                personality: dbUser.personality,
                interests: dbUser.interests,
              },
              picks,
              items: hydrated,
              generatedAt: row.generatedAt.toISOString(),
              previewMessage: null,
            };
          }
          await prisma.userRecommendation.delete({ where: { userId: dbUser.id } });
        } else {
          await prisma.userRecommendation.delete({ where: { userId: dbUser.id } });
        }
      }

      let items: Awaited<ReturnType<typeof buildVectorPreviewItems>>;
      try {
        items = await buildVectorPreviewItems(dbUser);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Anteprima vettoriale non riuscita";
        return status(502, { error: message });
      }

      return {
        source: "vector_preview" as const,
        profile: {
          mood: dbUser.mood,
          personality: dbUser.personality,
          interests: dbUser.interests,
        },
        picks: [] as { articleId: string; reason: string }[],
        items,
        generatedAt: null,
        previewMessage: VECTOR_PREVIEW_MESSAGE,
      };
    },
    { auth: true },
  );
