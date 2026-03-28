import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import Elysia from "elysia";
import { prisma } from "./prisma";

/**
 * Configurazione Better Auth: adapter Prisma, social Google/YouTube e Spotify, plugin Expo.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
      scope: ["https://www.googleapis.com/auth/youtube.readonly"],
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      scope: [
        "user-top-read",
        "user-read-recently-played",
        "user-read-email",
        "user-read-private",
      ],
      mapProfileToUser: (profile) => ({
        ...profile,
        username: profile.id,
        displayUsername: profile.id,
      }),
    },
  },
  experimental: { joins: true },
  trustedOrigins: [
    "faindy://",

    ...(process.env.NODE_ENV === "development"
      ? [
          "exp://*/*",
          "exp://10.0.0.*:*/*",
          "exp://192.168.*.*:*/*",
          "exp://172.*.*.*:*/*",
          "exp://localhost:*/*",
        ]
      : []),
  ],
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["spotify", "google"],
      allowDifferentEmails: true,
    },
  },
  plugins: [username(), expo()],
  advanced: {
    disableOriginCheck: true,
  },
});

/**
 * Macro Elysia: richiede cookie di sessione valido e passa `user` / `session` al contesto.
 */
export const betterAuthMacro = new Elysia({ name: "better-auth" }).macro({
  auth: {
    async resolve({ status, request: { headers } }) {
      if (headers.has("Cookie")) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return status(401);

        return {
          user: session.user,
          session: session.session,
        };
      }

      return status(401);
    },
  },
});
