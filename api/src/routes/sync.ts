import Elysia, { t } from "elysia";
import { auth, betterAuthMacro } from "../lib/auth";
import { fetchSpotifyTopTracks, fetchYoutubeLikes } from "../lib/media-sources";
import { mapMediaToProfile } from "../lib/profile-mapper";
import { generateAndPersistUserPicks } from "../lib/recommendations/generate-user-picks";
import { prisma } from "../lib/prisma";

/**
 * Sincronizza YouTube (Mi piace) + Spotify (top/recent), aggiorna il profilo utente e avvia il refresh dei pick in background.
 */
export const sync = new Elysia({ prefix: "/sync" }).use(betterAuthMacro).get(
  "/",
  async ({ user, request, status, query }) => {
    const headers = request.headers;

    let googleToken: string;
    let spotifyToken: string;

    try {
      const g = await auth.api.getAccessToken({
        body: { providerId: "google", userId: user.id },
        headers,
      });
      googleToken = g.accessToken;
    } catch {
      return status(400, {
        error:
          "Account Google non collegato o token assente. Collega Google con lo scope YouTube (rileva dopo aggiornamento scope).",
      });
    }

    try {
      const s = await auth.api.getAccessToken({
        body: { providerId: "spotify", userId: user.id },
        headers,
      });
      spotifyToken = s.accessToken;
    } catch {
      return status(400, {
        error:
          "Account Spotify non collegato o token assente. Collega Spotify con user-top-read.",
      });
    }

    const timeRange = query.timeRange;

    let youtubeLikes: Awaited<ReturnType<typeof fetchYoutubeLikes>>;
    let spotifyTracks: Awaited<ReturnType<typeof fetchSpotifyTopTracks>>;

    try {
      [youtubeLikes, spotifyTracks] = await Promise.all([
        fetchYoutubeLikes(googleToken, 25),
        fetchSpotifyTopTracks(spotifyToken, {
          limit: 20,
          timeRange,
        }),
      ]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Servizio esterno non disponibile";
      return status(502, { error: message });
    }

    try {
      const profile = await mapMediaToProfile(youtubeLikes, spotifyTracks);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          mood: profile.mood,
          personality: profile.personality,
          interests: profile.interests,
        },
      });
      void generateAndPersistUserPicks(user.id).then((r) => {
        if (!r.ok) {
          console.error("[sync] bootstrap raccomandazioni fallito", user.id, r.error);
        }
      });
      return {
        mood: profile.mood,
        personality: profile.personality,
        interests: profile.interests,
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Mappatura profilo fallita";
      return status(502, { error: message });
    }
  },
  {
    auth: true,
    query: t.Object({
      timeRange: t.Optional(
        t.Union([
          t.Literal("short_term"),
          t.Literal("medium_term"),
          t.Literal("long_term"),
        ]),
      ),
    }),
  },
);
