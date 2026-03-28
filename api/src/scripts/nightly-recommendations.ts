import "dotenv/config";
import { prisma } from "../lib/prisma";
import { runNightlyRecommendationsForAllUsers } from "../lib/recommendations/nightly-run";

async function main(): Promise<void> {
  const { processed, failures } = await runNightlyRecommendationsForAllUsers();
  console.log(
    `Scheduled recommendations: processed ${processed} users, ${failures.length} failures`,
  );
  if (failures.length > 0) {
    for (const f of failures.slice(0, 20)) {
      console.error(`  ${f.userId}: ${f.error}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
