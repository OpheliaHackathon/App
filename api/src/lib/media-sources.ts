const YT_BASE = "https://www.googleapis.com/youtube/v3";
const SPOTIFY_TOP = "https://api.spotify.com/v1/me/top/tracks";

export type YoutubeLike = { title: string; channelTitle: string };
export type SpotifyTrack = { name: string; artists: string[] };

export async function fetchYoutubeLikes(
  accessToken: string,
  maxResults = 25,
): Promise<YoutubeLike[]> {
  const url = new URL(`${YT_BASE}/videos`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("myRating", "like");
  url.searchParams.set("maxResults", String(maxResults));

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${text.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    items?: Array<{ snippet?: { title?: string; channelTitle?: string } }>;
  };

  return (data.items ?? [])
    .map((item) => ({
      title: item.snippet?.title ?? "",
      channelTitle: item.snippet?.channelTitle ?? "",
    }))
    .filter((v) => v.title.length > 0);
}

export async function fetchSpotifyTopTracks(
  accessToken: string,
  options: {
    limit?: number;
    timeRange?: "short_term" | "medium_term" | "long_term";
  } = {},
): Promise<SpotifyTrack[]> {
  const limit = options.limit ?? 20;
  const timeRange = options.timeRange ?? "short_term";

  const url = new URL(SPOTIFY_TOP);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("time_range", timeRange);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify API error ${res.status}: ${text.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    items?: Array<{
      name?: string;
      artists?: Array<{ name?: string }>;
    }>;
  };

  return (data.items ?? [])
    .map((item) => ({
      name: item.name ?? "",
      artists: (item.artists ?? []).map((a) => a.name ?? "").filter(Boolean),
    }))
    .filter((t) => t.name.length > 0);
}
