import { timingSafeEqual } from "crypto";
import Elysia from "elysia";
import { runNightlyRecommendationsForAllUsers } from "../lib/recommendations/nightly-run";

function bearerMatches(request: Request, secret: string): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  const expected = `Bearer ${secret}`;
  try {
    const a = Buffer.from(authHeader);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Trigger job interni
 * protetti da segreto condiviso in env. Fuori finestra la richiesta risponde ok con skipped.
 * In produzione preferire un gateway con rate limit e IP allowlist oltre al bearer.
 */
export const internalJobs = new Elysia({ prefix: "/internal/jobs" }).post(
  "/nightly-recommendations",
  async ({ request, status }) => {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
      return status(404, { error: "Non trovato" });
    }
    if (!bearerMatches(request, secret)) {
      return status(401, { error: "Non autorizzato" });
    }

    const result = await runNightlyRecommendationsForAllUsers();
    return {
      ok: true as const,
      skipped: false as const,
      processed: result.processed,
      failureCount: result.failures.length,
      failures: result.failures.slice(0, 50).map((f, i) => ({
        index: i,
        error: f.error,
      })),
    };
  },
);
