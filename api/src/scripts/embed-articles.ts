import "dotenv/config";
import { embedMany } from "ai";
import { prisma } from "../lib/prisma";
import {
  articleToEmbeddingText,
  embeddingModel,
} from "../lib/product-retrieval";

const BATCH_SIZE = 64;

async function main(): Promise<void> {
  const articles = await prisma.article.findMany();
  if (articles.length === 0) {
    console.log("No articles to embed.");
    return;
  }

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const chunk = articles.slice(i, i + BATCH_SIZE);
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunk.map(articleToEmbeddingText),
    });

    for (let j = 0; j < chunk.length; j++) {
      const row = chunk[j]!;
      const embedding = embeddings[j];
      if (!embedding) continue;
      const vec = `[${embedding.join(",")}]`;
      await prisma.$executeRawUnsafe(
        `UPDATE articles SET embedding = $1::vector WHERE id = $2`,
        vec,
        row.id,
      );
    }
    console.log(`Embedded ${Math.min(i + BATCH_SIZE, articles.length)} / ${articles.length}`);
  }

  console.log(`Done. Embedded ${articles.length} articles.`);
}

main().finally(() => prisma.$disconnect());
