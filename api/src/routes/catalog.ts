import Elysia, { t } from "elysia";
import { betterAuthMacro } from "../lib/auth";
import { prisma } from "../lib/prisma";
import {
  embedForSearch,
  findSimilarArticles,
  type ArticleCandidate,
} from "../lib/product-retrieval";

/** Soglia minima query di ricerca (allineata al client). */
export const CATALOG_SEARCH_MIN_LEN = 2;

function formatPriceEur(priceCents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(priceCents / 100);
}

function toPublisher(company: { id: string; name: string; image: string }) {
  return {
    id: company.id,
    name: company.name,
    avatarUrl: company.image,
  };
}

export function articleWithCompanyToProduct(article: {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  checkoutUrl: string | null;
  company: { id: string; name: string; image: string; website: string };
}) {
  const checkoutUrl =
    article.checkoutUrl?.trim() || article.company.website.trim() || null;
  return {
    id: article.id,
    title: article.title,
    description: article.description,
    category: article.category,
    imageUrl: article.image,
    price: formatPriceEur(article.price),
    checkoutUrl,
    publisher: toPublisher(article.company),
  };
}

export function articleCandidateToProduct(c: ArticleCandidate) {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category,
    imageUrl: c.image,
    price: formatPriceEur(c.price),
    checkoutUrl: c.checkoutUrl.trim() || null,
    publisher: toPublisher({
      id: c.companyId,
      name: c.companyName,
      image: c.companyImage,
    }),
    similarity: c.similarity,
  };
}

/** Catalogo articoli, dettaglio, similarità vettoriale e vetrine per azienda. */
export const catalog = new Elysia({ prefix: "/catalog", name: "catalog" })
  .use(betterAuthMacro)
  .get(
    "/articles",
    async ({ query }) => {
      const limit = Math.min(Math.max(1, query.limit ?? 30), 100);
      const offset = Math.max(0, query.offset ?? 0);
      const rows = await prisma.article.findMany({
        take: limit,
        skip: offset,
        orderBy: { id: "asc" },
        include: { company: true },
      });
      return { items: rows.map(articleWithCompanyToProduct) };
    },
    {
      auth: true,
      query: t.Object({
        limit: t.Optional(t.Integer({ minimum: 1, maximum: 100 })),
        offset: t.Optional(t.Integer({ minimum: 0 })),
      }),
    },
  )
  .get(
    "/articles/:id",
    async ({ params: { id }, status }) => {
      const article = await prisma.article.findUnique({
        where: { id },
        include: { company: true },
      });
      if (!article) return status(404, { error: "Articolo non trovato" });
      return articleWithCompanyToProduct(article);
    },
    { auth: true },
  )
  .get(
    "/search",
    async ({ query, status }) => {
      const q = query.q?.trim() ?? "";
      if (q.length < CATALOG_SEARCH_MIN_LEN) {
        return status(400, {
          error: `La ricerca richiede almeno ${CATALOG_SEARCH_MIN_LEN} caratteri`,
        });
      }
      const limit = Math.min(Math.max(1, query.limit ?? 24), 48);
      try {
        const vector = await embedForSearch(q);
        const candidates = await findSimilarArticles(vector, limit);
        return {
          items: candidates.map((c) => articleCandidateToProduct(c)),
        };
      } catch (e) {
        console.error("[catalog/search] embedding/vector error:", e);
        return status(502, { error: "Ricerca non disponibile al momento" });
      }
    },
    {
      auth: true,
      query: t.Object({
        q: t.Optional(t.String({ maxLength: 500 })),
        limit: t.Optional(t.Integer({ minimum: 1, maximum: 48 })),
      }),
    },
  )
  .get(
    "/companies/:id",
    async ({ params: { id }, status }) => {
      const company = await prisma.company.findUnique({
        where: { id },
        include: {
          articles: { orderBy: { id: "asc" } },
        },
      });
      if (!company) return status(404, { error: "Azienda non trovata" });
      const publisher = toPublisher(company);
      const products = company.articles.map((a) =>
        articleWithCompanyToProduct({ ...a, company }),
      );
      return { publisher, products };
    },
    { auth: true },
  );
