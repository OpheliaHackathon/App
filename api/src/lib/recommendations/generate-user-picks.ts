import {
  createProductPickerAgent,
  productPicksOutputSchema,
} from "../agents/product-picker-agent";
import { prisma } from "../prisma";
import { articleWithCompanyToProduct } from "../../routes/catalog";
import {
  buildProfileSummary,
  countArticlesWithEmbeddings,
} from "../product-retrieval";
import type { User } from "../../generated/prisma/client";
import { profileFingerprint } from "./profile-fingerprint";

function collectAllowedArticleIdsFromSteps(
  steps: Array<{
    toolResults: Array<{ toolName: string; output: unknown }>;
  }>,
): Set<string> {
  const allowed = new Set<string>();
  for (const step of steps) {
    for (const tr of step.toolResults) {
      if (tr.toolName !== "searchProducts") continue;
      const out = tr.output as { candidates?: { id: string }[] } | undefined;
      if (!out?.candidates) continue;
      for (const c of out.candidates) allowed.add(c.id);
    }
  }
  return allowed;
}

async function runAgent(
  dbUser: Pick<User, "name" | "mood" | "personality" | "interests">,
) {
  const agent = createProductPickerAgent({
    name: dbUser.name,
    mood: dbUser.mood,
    personality: dbUser.personality,
    interests: dbUser.interests,
  });

  const profileSummary = buildProfileSummary({
    name: dbUser.name,
    mood: dbUser.mood,
    personality: dbUser.personality,
    interests: dbUser.interests,
  });

  const result = await agent.generate({
    prompt: `Recommend exactly 15 products for this user.

${profileSummary}

Use searchProducts to load candidates, then output the structured picks (15 items with reasons).`,
  });

  const allowed = collectAllowedArticleIdsFromSteps(result.steps);
  if (allowed.size === 0) {
    return { error: "Agent did not run product search; no candidates available." as const };
  }

  const output = result.output;
  if (!output?.picks || output.picks.length !== 15) {
    return {
      error: "Agent did not return exactly 15 picks with structured output." as const,
    };
  }

  const seen = new Set<string>();
  for (const pick of output.picks) {
    if (seen.has(pick.articleId)) {
      return { error: `Duplicate article id in picks: ${pick.articleId}` as const };
    }
    seen.add(pick.articleId);
    if (!allowed.has(pick.articleId)) {
      return {
        error: `Pick ${pick.articleId} is not from searchProducts candidate ids.` as const,
      };
    }
  }

  return { picks: output.picks };
}

export async function hydratePicks(picks: { articleId: string; reason: string }[]) {
  const ids = picks.map((p) => p.articleId);
  const articles = await prisma.article.findMany({
    where: { id: { in: ids } },
    include: { company: true },
  });
  const byId = new Map(articles.map((a) => [a.id, a]));
  if (articles.length !== picks.length) {
    return null;
  }
  const items = picks.map((p) => {
    const a = byId.get(p.articleId)!;
    return { ...articleWithCompanyToProduct(a), reason: p.reason };
  });
  return items;
}

/**
 * Runs the product-picker agent and upserts user_recommendations.
 * Safe to call from sync (fire-and-forget), weekly scheduled batch, or internal jobs.
 */
export async function generateAndPersistUserPicks(
  userId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!dbUser) {
    return { ok: false, error: "User not found" };
  }

  if (
    dbUser.mood.length === 0 &&
    dbUser.personality.length === 0 &&
    dbUser.interests.length === 0
  ) {
    return { ok: false, error: "Profile is empty" };
  }

  const embeddedCount = await countArticlesWithEmbeddings();
  if (embeddedCount < 15) {
    return {
      ok: false,
      error: `Need at least 15 articles with embeddings (found ${embeddedCount})`,
    };
  }

  const fp = profileFingerprint(dbUser);

  let agentResult;
  try {
    agentResult = await runAgent(dbUser);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Agent failed";
    return { ok: false, error: message };
  }

  if ("error" in agentResult) {
    return { ok: false, error: agentResult.error ?? "Agent validation failed" };
  }

  const hydrated = await hydratePicks(agentResult.picks);
  if (!hydrated) {
    return {
      ok: false,
      error: "One or more recommended articles are missing from the catalog.",
    };
  }

  await prisma.userRecommendation.upsert({
    where: { userId: dbUser.id },
    create: {
      userId: dbUser.id,
      fingerprint: fp,
      picks: { picks: agentResult.picks },
      generatedAt: new Date(),
    },
    update: {
      fingerprint: fp,
      picks: { picks: agentResult.picks },
      generatedAt: new Date(),
    },
  });

  return { ok: true };
}

export { productPicksOutputSchema };
