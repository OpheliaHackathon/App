import "dotenv/config";
import { Elysia } from "elysia";
import { auth, betterAuthMacro } from "./lib/auth";
import { assistant } from "./routes/assistant";
import { catalog } from "./routes/catalog";
import { internalJobs } from "./routes/internal-jobs";
import { recommendations } from "./routes/recommendations";
import { sync } from "./routes/sync";

const app = new Elysia()
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
