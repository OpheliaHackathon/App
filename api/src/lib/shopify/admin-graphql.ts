export const DEFAULT_SHOPIFY_ADMIN_API_VERSION = "2025-07";

export type ShopifyAdminConfig = {
  shop: string;
  accessToken: string;
  apiVersion?: string;
};

export type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  descriptionHtml: string | null;
  productType: string | null;
  tags: string[];
  onlineStoreUrl: string | null;
  featuredImage: { url: string } | null;
  priceRangeV2: {
    minVariantPrice: { amount: string; currencyCode: string } | null;
  } | null;
};

type ProductsResponse = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: Array<{ node: ShopifyProductNode }>;
  };
};

const PRODUCTS_QUERY = `#graphql
  query ShopifyProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          productType
          tags
          onlineStoreUrl
          featuredImage {
            url
          }
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export function normalizeShopifyShopHost(shop: string): string {
  let s = shop.trim().replace(/^https?:\/\//i, "");
  s = s.replace(/\/.*$/, "");
  if (!/\.myshopify\.com$/i.test(s)) {
    s = `${s}.myshopify.com`;
  }
  return s.toLowerCase();
}

/** URL PDP su dominio myshopify (fallback se `onlineStoreUrl` è assente). */
export function shopifyStorefrontProductUrl(shop: string, handle: string): string {
  const host = normalizeShopifyShopHost(shop);
  return `https://${host}/products/${encodeURIComponent(handle)}`;
}

export function adminGraphqlUrl(cfg: ShopifyAdminConfig): string {
  const host = normalizeShopifyShopHost(cfg.shop);
  const v = cfg.apiVersion ?? DEFAULT_SHOPIFY_ADMIN_API_VERSION;
  return `https://${host}/admin/api/${v}/graphql.json`;
}

export async function shopifyAdminGraphql<T>(
  cfg: ShopifyAdminConfig,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(adminGraphqlUrl(cfg), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": cfg.accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await res.text();
  let body: { data?: T; errors?: unknown };
  try {
    body = JSON.parse(text) as { data?: T; errors?: unknown };
  } catch {
    throw new Error(`Shopify risposta non-JSON (HTTP ${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    throw new Error(`Shopify HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
  if (body.errors) {
    throw new Error(`Shopify GraphQL: ${JSON.stringify(body.errors)}`);
  }
  if (body.data === undefined) {
    throw new Error(`Shopify: nessun \"data\" nella risposta: ${text.slice(0, 300)}`);
  }
  return body.data;
}

export type FetchShopifyProductsOptions = {
  pageSize?: number;
  /** Filtro sintassi Admin API https://shopify.dev/docs/api/usage/search-syntax */
  searchQuery?: string;
  onPage?: (count: number) => void;
};

export async function fetchAllShopifyProducts(
  cfg: ShopifyAdminConfig,
  options: FetchShopifyProductsOptions = {},
): Promise<ShopifyProductNode[]> {
  const pageSize = Math.min(Math.max(1, options.pageSize ?? 50), 250);
  const out: ShopifyProductNode[] = [];
  let cursor: string | null = null;
  let hasNext = true;

  while (hasNext) {
    const data: ProductsResponse = await shopifyAdminGraphql(cfg, PRODUCTS_QUERY, {
      first: pageSize,
      after: cursor,
      query: options.searchQuery?.trim() || null,
    });

    for (const edge of data.products.edges) {
      out.push(edge.node);
    }
    options.onPage?.(out.length);

    hasNext = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return out;
}

export function shopifyMinorUnits(amountStr: string | undefined): number {
  if (amountStr === undefined || amountStr === "") return 0;
  const n = Number.parseFloat(amountStr);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export function stripHtmlToText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
