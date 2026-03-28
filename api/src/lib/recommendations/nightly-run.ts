import { prisma } from "../prisma";
import { generateAndPersistUserPicks } from "./generate-user-picks";

const DEFAULT_CONCURRENCY = 4;

export async function runNightlyRecommendationsForAllUsers(options?: {
  concurrency?: number;
}): Promise<{ processed: number; failures: { userId: string; error: string }[] }> {
  const concurrency = options?.concurrency ?? DEFAULT_CONCURRENCY;
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { mood: { isEmpty: false } },
        { personality: { isEmpty: false } },
        { interests: { isEmpty: false } },
      ],
    },
    select: { id: true },
  });

  const failures: { userId: string; error: string }[] = [];
  let next = 0;

  async function worker() {
    while (true) {
      const i = next++;
      if (i >= users.length) break;
      const u = users[i]!;
      const result = await generateAndPersistUserPicks(u.id);
      if (!result.ok) {
        failures.push({ userId: u.id, error: result.error });
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, users.length) || 1 }, () => worker()));

  return { processed: users.length, failures };
}
