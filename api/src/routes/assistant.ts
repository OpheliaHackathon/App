import Elysia, { t } from "elysia";
import { createShopAssistantAgent } from "../lib/agents/shop-assistant-agent";
import { betterAuthMacro } from "../lib/auth";
import { prisma } from "../lib/prisma";
import {
  buildProfileSummary,
  countArticlesWithEmbeddings,
} from "../lib/product-retrieval";
import type { WeatherCurrentResult } from "../lib/weather/open-meteo";
import { articleWithCompanyToProduct } from "./catalog";

const MAX_HISTORY_MESSAGES = 10;

function collectSearchCatalogIdsFromSteps(
  steps: Array<{
    toolResults: Array<{ toolName: string; output: unknown }>;
  }>,
): Set<string> {
  const allowed = new Set<string>();
  for (const step of steps) {
    for (const tr of step.toolResults) {
      if (tr.toolName !== "searchCatalog") continue;
      const out = tr.output as { candidates?: { id: string }[] } | undefined;
      if (!out?.candidates) continue;
      for (const c of out.candidates) allowed.add(c.id);
    }
  }
  return allowed;
}

function extractLastWeatherFromSteps(
  steps: Array<{
    toolResults: Array<{ toolName: string; output: unknown }>;
  }>,
): WeatherCurrentResult | null {
  let last: WeatherCurrentResult | null = null;
  for (const step of steps) {
    for (const tr of step.toolResults) {
      if (tr.toolName !== "getWeather") continue;
      const out = tr.output as
        | { weather?: WeatherCurrentResult; error?: string }
        | undefined;
      if (out?.weather) last = out.weather;
    }
  }
  return last;
}

function trimHistory(
  history:
    | { role: "user" | "assistant"; content: string }[]
    | null
    | undefined,
): { role: "user" | "assistant"; content: string }[] {
  if (!history?.length) return [];
  const trimmed = history
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim(),
    }))
    .filter((m) => m.content.length > 0);
  return trimmed.slice(-MAX_HISTORY_MESSAGES);
}

function buildPrompt(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
): string {
  const lines: string[] = [];
  for (const m of history) {
    const who = m.role === "user" ? "Utente" : "Assistente";
    lines.push(`${who}: ${m.content}`);
  }
  lines.push(`Utente: ${message.trim()}`);
  return lines.join("\n\n");
}

export type AssistantChatProduct = ReturnType<typeof articleWithCompanyToProduct>;

export const assistant = new Elysia({ prefix: "/assistant", name: "assistant" })
  .use(betterAuthMacro)
  .post(
    "/chat",
    async ({ user, body, status }) => {
      const message = body.message?.trim() ?? "";
      if (message.length < 1) {
        return status(400, { error: "Messaggio vuoto" });
      }

      const embeddedCount = await countArticlesWithEmbeddings();
      if (embeddedCount < 1) {
        return status(503, { error: "Catalogo non disponibile al momento" });
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          name: true,
          mood: true,
          personality: true,
          interests: true,
        },
      });

      const profileEmpty =
        !dbUser ||
        (dbUser.mood.length === 0 &&
          dbUser.personality.length === 0 &&
          dbUser.interests.length === 0);

      const profileSummaryLines = profileEmpty
        ? null
        : buildProfileSummary({
            name: dbUser!.name,
            mood: dbUser!.mood,
            personality: dbUser!.personality,
            interests: dbUser!.interests,
          });

      const history = trimHistory(body.history);
      const prompt = buildPrompt(message, history);

      const agent = createShopAssistantAgent(profileSummaryLines);

      let result;
      try {
        result = await agent.generate({
          prompt: `Conversazione (ultimo messaggio è la richiesta da soddisfare):\n\n${prompt}\n\nRispondi con testo utile in reply e con suggestedProductIds solo se proponi prodotti dal catalogo (dopo searchCatalog).`,
        });
      } catch (e) {
        console.error("[assistant/chat] agent error:", e);
        return status(502, { error: "Assistente non disponibile al momento" });
      }

      const output = result.output;
      if (!output?.reply) {
        return status(502, { error: "Risposta strutturata mancante" });
      }

      const allowed = collectSearchCatalogIdsFromSteps(result.steps);
      const suggested = output.suggestedProductIds ?? [];
      const validIds = suggested.filter((id) => allowed.has(id));

      if (suggested.length > 0 && validIds.length === 0) {
        return status(502, {
          error:
            "Gli articoli suggeriti non provengono da una ricerca catalogo valida.",
        });
      }

      const weather = extractLastWeatherFromSteps(result.steps);

      if (validIds.length === 0) {
        return {
          reply: output.reply,
          products: [] as AssistantChatProduct[],
          weather,
        };
      }

      const articles = await prisma.article.findMany({
        where: { id: { in: validIds } },
        include: { company: true },
      });
      const byId = new Map(articles.map((a) => [a.id, a]));
      for (const id of validIds) {
        if (!byId.has(id)) {
          console.error("[assistant/chat] suggested article not found in DB:", id);
          return status(502, { error: "Uno o più articoli suggeriti non sono disponibili" });
        }
      }

      const products = validIds.map((id) =>
        articleWithCompanyToProduct(byId.get(id)!),
      );

      return {
        reply: output.reply,
        products,
        weather,
      };
    },
    {
      auth: true,
      body: t.Object({
        message: t.String({ minLength: 1, maxLength: 2000 }),
        history: t.Optional(
          t.Array(
            t.Object({
              role: t.Union([t.Literal("user"), t.Literal("assistant")]),
              content: t.String({ maxLength: 2000 }),
            }),
            { maxItems: MAX_HISTORY_MESSAGES },
          ),
        ),
      }),
    },
  );
