import "dotenv/config";
import { Elysia } from "elysia";
import { auth, betterAuthMacro } from "./lib/auth/server";
import { uploads } from "./routes/uploads";
import { users } from "./routes/users";

/**
 * @description Web Server for the application
 */
const app = new Elysia()
  // Mount the authentication handler routes
  .mount(auth.handler)
  // Mount the authentication macro
  .use(betterAuthMacro)

  // Load routes
  .use(users)
  .use(uploads)
  .get("/", { online: true });

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
