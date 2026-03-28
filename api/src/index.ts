import "dotenv/config";
import { Elysia } from "elysia";
import { auth, betterAuthMacro } from "./lib/auth";
import { catalog } from "./routes/catalog";
import { internalJobs } from "./routes/internal-jobs";
import { recommendations } from "./routes/recommendations";
import { sync } from "./routes/sync";

/**
 * Applicazione HTTP principale: auth Better Auth, macro di sessione e route di dominio.
 * Headers di sicurezza di base applicati a ogni risposta (utile davanti a proxy/cron).
 */
const app = new Elysia()
  .onAfterHandle(({ set }) => {
    set.headers["X-Content-Type-Options"] = "nosniff";
    set.headers["X-Frame-Options"] = "DENY";
    set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    set.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
  })
  .mount(auth.handler)
  .use(betterAuthMacro)
  .use(catalog)
  .use(sync)
  .use(recommendations)
  .use(internalJobs)
  .get("/", { online: true })
  .listen(3000);

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
export default app;
