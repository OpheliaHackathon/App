import "dotenv/config";
import { prisma } from "../lib/prisma";
import {
  DEFAULT_SHOPIFY_ADMIN_API_VERSION,
  type ShopifyAdminConfig,
  type ShopifyProductNode,
  fetchAllShopifyProducts,
  shopifyMinorUnits,
  shopifyStorefrontProductUrl,
  stripHtmlToText,
} from "../lib/shopify/admin-graphql";

function printUsage(): void {
  console.log(`
Uso: bun run src/scripts/shopify-fetch-products.ts --company-id <id> --shop <negozio> --token <token> [opzioni]

Argomenti obbligatori:
  --company-id    ID azienda (Company) nel database a cui associare i prodotti
  --shop          Dominio negozio: "mionegozio" o "mionegozio.myshopify.com"
  --token         Admin API access token (Custom app / app privata)

Opzioni:
  --api-version   Default: ${DEFAULT_SHOPIFY_ADMIN_API_VERSION}
  --query         Filtro prodotti (sintassi Shopify Admin search), es. "status:active"
  --dry-run       Solo elenco prodotti da Shopify, nessuna scrittura sul DB
  --help          Questo messaggio

Variabili d'ambiente (se --token/--shop omessi):
  SHOPIFY_ADMIN_ACCESS_TOKEN
  SHOPIFY_SHOP

Dopo l'import, rigenera gli embedding se usi la ricerca vettoriale:
  bun run db:embed-articles
`);
}

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "-h" || a === "--help") {
      out.help = true;
      continue;
    }
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      out[key] = true;
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function productDescription(node: ShopifyProductNode): string {
  const plain = node.description?.trim();
  if (plain) return plain;
  const html = node.descriptionHtml?.trim();
  if (html) return stripHtmlToText(html);
  return node.title;
}

function productToArticlePayload(
  node: ShopifyProductNode,
  companyId: string,
  fallbackImageUrl: string,
  shopHint: string,
) {
  const minPrice = node.priceRangeV2?.minVariantPrice;
  const price = shopifyMinorUnits(minPrice?.amount);
  if (minPrice && minPrice.currencyCode !== "EUR") {
    console.warn(
      `Prodotto ${node.title}: valuta ${minPrice.currencyCode} (il catalogo formatta come EUR).`,
    );
  }

  const image = node.featuredImage?.url?.trim() || fallbackImageUrl;
  const checkoutUrl =
    node.onlineStoreUrl?.trim() || shopifyStorefrontProductUrl(shopHint, node.handle);

  return {
    shopifyProductId: node.id,
    title: node.title,
    description: productDescription(node),
    category: (node.productType?.trim() || "Shopify").slice(0, 200),
    tags: node.tags ?? [],
    price,
    image,
    checkoutUrl,
    companyId,
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  if (args.help) {
    printUsage();
    return;
  }

  const companyId =
    (args["company-id"] as string | undefined)?.trim() ||
    (args.company as string | undefined)?.trim();
  const shop = (args.shop as string | undefined)?.trim() || process.env.SHOPIFY_SHOP?.trim();
  const token =
    (args.token as string | undefined)?.trim() ||
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();

  if (!companyId || !shop || !token) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const apiVersion =
    (args["api-version"] as string | undefined)?.trim() || DEFAULT_SHOPIFY_ADMIN_API_VERSION;
  const searchQuery = (args.query as string | undefined)?.trim() || undefined;
  const dryRun = args["dry-run"] === true;

  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) {
    console.error(`Company non trovata: ${companyId}`);
    process.exitCode = 1;
    return;
  }

  const cfg: ShopifyAdminConfig = { shop, accessToken: token, apiVersion };

  console.log(`Connessione a Shopify (${apiVersion})…`);
  const nodes = await fetchAllShopifyProducts(cfg, {
    searchQuery,
    onPage: (n) => console.log(`  Scaricati finora: ${n}`),
  });
  console.log(`Totale prodotti da Shopify: ${nodes.length}`);

  if (dryRun) {
    for (const node of nodes.slice(0, 20)) {
      console.log(`- ${node.title} (${node.handle})`);
    }
    if (nodes.length > 20) console.log(`… e altri ${nodes.length - 20}`);
    return;
  }

  let created = 0;
  let updated = 0;

  for (const node of nodes) {
    const payload = productToArticlePayload(node, companyId, company.image, shop);

    const existing = await prisma.article.findFirst({
      where: { companyId, shopifyProductId: node.id },
    });

    if (existing) {
      await prisma.article.update({
        where: { id: existing.id },
        data: {
          title: payload.title,
          description: payload.description,
          category: payload.category,
          tags: payload.tags,
          price: payload.price,
          image: payload.image,
          checkoutUrl: payload.checkoutUrl,
        },
      });
      updated++;
    } else {
      await prisma.article.create({ data: payload });
      created++;
    }
  }

  console.log(`Fatto. Creati: ${created}, aggiornati: ${updated}.`);
  console.log("Suggerimento: bun run db:embed-articles per aggiornare i vettori di ricerca.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
