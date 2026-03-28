import "dotenv/config";
import { Elysia } from "elysia";
import { auth, betterAuthMacro } from "./lib/auth";
import { assistant } from "./routes/assistant";
import { catalog } from "./routes/catalog";
import { internalJobs } from "./routes/internal-jobs";
import { recommendations } from "./routes/recommendations";
import { sync } from "./routes/sync";

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "SPOTIFY_CLIENT_ID",
  "SPOTIFY_CLIENT_SECRET",
  "OPENAI_API_KEY",
] as const;

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    console.error(`[startup] Missing required env var: ${key}`);
    process.exit(1);
  }
}

const isProd = process.env.NODE_ENV === "production";

/**
 * Applicazione HTTP principale: auth Better Auth, macro di sessione e route di dominio.
 * Headers di sicurezza applicati a ogni risposta.
 */
const app = new Elysia()
  .onAfterHandle(({ set }) => {
    set.headers["X-Content-Type-Options"] = "nosniff";
    set.headers["X-Frame-Options"] = "DENY";
    set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    set.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    set.headers["X-XSS-Protection"] = "0";
    if (isProd) {
      set.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload";
    }
  })
  .mount(auth.handler)
  .use(betterAuthMacro)
  .use(catalog)
  .use(assistant)
  .use(sync)
  .use(recommendations)
  .use(internalJobs)
  .get("/", { online: true })
  .listen(3000);

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
export default app;
