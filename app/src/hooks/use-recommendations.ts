import client from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";

/** Query singola per il feed home: curato o anteprima vettoriale. */
export const recommendationsQueryKey = ["recommendations"] as const;

export type RecommendationsPayload = NonNullable<
  Awaited<ReturnType<typeof fetchRecommendations>>
>;

async function fetchRecommendations() {
  const res = await client.recommendations.get();
  if (res.error != null) {
    const body = res.error.value as { error?: string } | undefined;
    return {
      kind: "unavailable" as const,
      message:
        typeof body?.error === "string"
          ? body.error
          : "Consigli non disponibili.",
    };
  }
  if (res.data == null) {
    return {
      kind: "unavailable" as const,
      message: "Consigli non disponibili.",
    };
  }
  return { kind: "ready" as const, data: res.data };
}

export function useRecommendationsQuery() {
  return useQuery({
    queryKey: recommendationsQueryKey,
    queryFn: fetchRecommendations,
    staleTime: 60_000,
    refetchInterval: (query) => {
      const d = query.state.data;
      if (d?.kind === "ready" && d.data.source === "vector_preview") {
        return 30_000;
      }
      return false;
    },
  });
}
