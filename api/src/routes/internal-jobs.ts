import Elysia from "elysia";
import { runNightlyRecommendationsForAllUsers } from "../lib/recommendations/nightly-run";

function bearerMatches(request: Request, secret: string): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/**
 * Trigger job interni (es. cron notturno) protetti da segreto condiviso in env.
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
      processed: result.processed,
      failureCount: result.failures.length,
      failures: result.failures.slice(0, 50),
    };
  },
);
