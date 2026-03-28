import client from "@/lib/fetcher";
import { assertTreatyValue } from "@/lib/treaty-utils";
import { useQuery } from "@tanstack/react-query";

/** Chiavi React Query per lista articoli, dettaglio, ricerca e catalogo per azienda. */
export const catalogQueryKeys = {
  articles: {
    all: ["catalog", "articles"] as const,
    list: (limit: number, offset: number) =>
      [...catalogQueryKeys.articles.all, "list", { limit, offset }] as const,
    detail: (id: string) =>
      [...catalogQueryKeys.articles.all, "detail", id] as const,
    search: (q: string, limit: number) =>
      [...catalogQueryKeys.articles.all, "search", q, limit] as const,
  },
  company: (id: string) => ["catalog", "company", id] as const,
};

export function useArticlesQuery(limit = 30, offset = 0) {
  return useQuery({
    queryKey: catalogQueryKeys.articles.list(limit, offset),
    queryFn: async () => {
      const res = await client.catalog.articles.get({
        query: { limit, offset },
      });
      return assertTreatyValue(res);
    },
  });
}

export function useArticleQuery(id: string | undefined) {
  return useQuery({
    queryKey: catalogQueryKeys.articles.detail(id ?? ""),
    queryFn: async () => {
      const res = await client.catalog.articles({ id: id! }).get();
      return assertTreatyValue(res);
    },
    enabled: Boolean(id),
  });
}

export function useCompanyCatalogQuery(id: string | undefined) {
  return useQuery({
    queryKey: catalogQueryKeys.company(id ?? ""),
    queryFn: async () => {
      const res = await client.catalog.companies({ id: id! }).get();
      return assertTreatyValue(res);
    },
    enabled: Boolean(id),
  });
}

const SEARCH_MIN_LEN = 2;
const SEARCH_LIMIT = 24;

export function useCatalogSearchQuery(searchText: string) {
  const q = searchText.trim();
  return useQuery({
    queryKey: catalogQueryKeys.articles.search(q, SEARCH_LIMIT),
    queryFn: async () => {
      const res = await client.catalog.search.get({
        query: { q, limit: SEARCH_LIMIT },
      });
      return assertTreatyValue(res);
    },
    enabled: q.length >= SEARCH_MIN_LEN,
  });
}
