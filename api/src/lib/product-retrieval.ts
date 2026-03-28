import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { prisma } from "./prisma";

/** Allineamento a `text-embedding-3-small` e colonna `vector(1536)` nello schema Prisma. */
export const EMBEDDING_DIMENSIONS = 1536;

export const embeddingModel = openai.embedding("text-embedding-3-small");

export type ArticleCandidate = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  image: string;
  companyId: string;
  companyName: string;
  companyImage: string;
  similarity: number;
};

export type UserProfileForRecommendations = {
  name: string;
  mood: string[];
  personality: string[];
  interests: string[];
};

export function buildProfileSummary(profile: UserProfileForRecommendations): string {
  const lines = [
    `Mood: ${profile.mood.length ? profile.mood.join(", ") : "(none)"}`,
    `Personality: ${profile.personality.length ? profile.personality.join(", ") : "(none)"}`,
    `Interests: ${profile.interests.length ? profile.interests.join(", ") : "(none)"}`,
  ];
  return lines.join("\n");
}

export function articleToEmbeddingText(article: {
  title: string;
  description: string;
  category: string;
  tags: string[];
}): string {
  return [
    article.title,
    article.description,
    article.category,
    article.tags.join(" "),
  ].join("\n");
}

export async function embedForSearch(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  });
  if (embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Expected ${EMBEDDING_DIMENSIONS}-dim embedding, got ${embedding.length}`,
    );
  }
  return embedding;
}

function vectorLiteral(embedding: number[]): string {
  return `[${embedding.map((n) => (Number.isFinite(n) ? n : 0)).join(",")}]`;
}

export async function findSimilarArticles(
  embedding: number[],
  limit: number,
): Promise<ArticleCandidate[]> {
  const safeLimit = Math.min(Math.max(1, Math.trunc(limit)), 100);
  const vec = vectorLiteral(embedding);
  const rows = await prisma.$queryRawUnsafe<
    Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      tags: string[];
      price: number;
      image: string;
      companyId: string;
      companyName: string;
      companyImage: string;
      checkoutUrl: string;
      similarity: unknown;
    }>
  >(
    `SELECT a.id, a.title, a.description, a.category, a.tags, a.price, a.image, a."companyId",
            c.name AS "companyName",
            c.image AS "companyImage",
            COALESCE(NULLIF(TRIM(COALESCE(a."checkoutUrl", '')), ''), c.website) AS "checkoutUrl",
            1 - (a.embedding <=> $1::vector) AS similarity
     FROM articles a
     INNER JOIN companies c ON c.id = a."companyId"
     WHERE a.embedding IS NOT NULL
     ORDER BY a.embedding <=> $1::vector
     LIMIT $2`,
    vec,
    safeLimit,
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    tags: r.tags,
    price: r.price,
    image: r.image,
    companyId: r.companyId,
    companyName: r.companyName,
    companyImage: r.companyImage,
    checkoutUrl: r.checkoutUrl,
    similarity: Number(r.similarity),
  }));
}

export async function countArticlesWithEmbeddings(): Promise<number> {
  const rows = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*)::bigint AS count FROM articles WHERE embedding IS NOT NULL
  `;
  return Number(rows[0]?.count ?? 0);
}
