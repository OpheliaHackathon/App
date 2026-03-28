import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { SpotifyTrack, YoutubeLike } from "./media-sources";

export const userProfileSchema = z.object({
  mood: z.array(z.string()).describe("Emotional tones suggested by the media"),
  personality: z.array(z.string()).describe("Likely personality traits"),
  interests: z.array(z.string()).describe("Topic and domain interests"),
});

export type UserProfileInsight = z.infer<typeof userProfileSchema>;

function buildPrompt(youtube: YoutubeLike[], spotify: SpotifyTrack[]): string {
  const ytLines = youtube
    .map((v) => `- "${v.title}" (${v.channelTitle})`)
    .join("\n");
  const spLines = spotify
    .map((t) => `- "${t.name}" — ${t.artists.join(", ")}`)
    .join("\n");

  return `You are analyzing a person's taste from their YouTube liked videos and their most-played Spotify tracks (recent window).

Infer mood (emotional atmosphere), personality traits, and interests. Use short English labels like in the examples (e.g. "nostalgic", "energic", "creative", "introverted", "tech", "fitness"). Use lowercase where natural for English adjectives. Be specific but concise: 2-6 items per category when the data supports it.

YouTube likes:
${ytLines || "(none)"}

Spotify top tracks:
${spLines || "(none)"}

If one list is empty, infer mainly from the other. If both are empty, return three empty arrays.`;
}

export async function mapMediaToProfile(
  youtube: YoutubeLike[],
  spotify: SpotifyTrack[],
): Promise<UserProfileInsight> {
  const { output } = await generateText({
    model: openai("gpt-5.4-mini"),
    output: Output.object({ schema: userProfileSchema }),
    prompt: buildPrompt(youtube, spotify),
  });

  return output;
}
