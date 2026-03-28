import { openai } from "@ai-sdk/openai";
import { Output, tool, ToolLoopAgent } from "ai";
import { z } from "zod";
import {
  buildProfileSummary,
  embedForSearch,
  findSimilarArticles,
  type UserProfileForRecommendations,
} from "../product-retrieval";

export const productPicksOutputSchema = z.object({
  picks: z
    .array(
      z.object({
        articleId: z.string(),
        reason: z.string().min(1),
      }),
    )
    .min(15)
    .max(15),
});

export type ProductPicksOutput = z.infer<typeof productPicksOutputSchema>;

export function createProductPickerAgent(profile: UserProfileForRecommendations) {
  const baseSummary = buildProfileSummary(profile);

  const searchProducts = tool({
    description:
      "Search the product catalog by semantic similarity to the user profile and optional focus hint. Returns candidate products (each with id, details, similarity). Call at least once before final picks; call again with a different hint if you need more variety.",
    inputSchema: z.object({
      limit: z
        .number()
        .int()
        .min(10)
        .max(120)
        .optional()
        .describe("Max candidates to return (default 60)."),
      hint: z
        .string()
        .optional()
        .describe(
          "Optional emphasis for this search (mood, hobby, product style, etc.).",
        ),
    }),
    execute: async ({ limit = 60, hint }) => {
      const text = hint
        ? `${baseSummary}\nAdditional search focus: ${hint}`
        : baseSummary;
      const vector = await embedForSearch(text);
      const candidates = await findSimilarArticles(vector, limit);
      return { candidates };
    },
  });

  return new ToolLoopAgent({
    model: openai("gpt-5.4-mini"),
    instructions: `You are a thoughtful product curator for one user.

User profile:
${baseSummary}

You must:
1. Call searchProducts at least once to retrieve candidates from the real catalog.
2. Optionally call searchProducts again with different hints for diversity.
3. Produce exactly 15 picks. Use only article ids that appear in candidates from your tool results (the "id" field on each candidate). Do not invent ids.
4. For each pick, write a short reason that explicitly ties the product to the user's mood, personality, and/or interests.`,
    tools: { searchProducts },
    output: Output.object({ schema: productPicksOutputSchema }),
  });
}
