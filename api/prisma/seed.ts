import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
});

const COMPANY_PREFIX = "seed_company_";

const companies = [
  {
    id: `${COMPANY_PREFIX}pixel_forge`,
    name: "Pixel Forge Studios",
    description:
      "Indie and AA game studio focused on narrative RPGs and cozy simulators.",
    image: "https://picsum.photos/seed/pixelforge/800/600",
    website: "https://example.com/pixel-forge",
  },
  {
    id: `${COMPANY_PREFIX}neo_arcadia`,
    name: "Neo Arcadia Games",
    description:
      "Publisher and developer of competitive multiplayer and live-service titles.",
    image: "https://picsum.photos/seed/neoarcadia/800/600",
    website: "https://example.com/neo-arcadia",
  },
  {
    id: `${COMPANY_PREFIX}respawn_bench`,
    name: "Respawn Bench",
    description:
      "Premium gaming peripherals, chairs, and streaming gear for creators.",
    image: "https://picsum.photos/seed/respawnbench/800/600",
    website: "https://example.com/respawn-bench",
  },
  {
    id: `${COMPANY_PREFIX}ledgerline`,
    name: "Ledgerline",
    description:
      "SMB accounting, invoicing, and cash-flow forecasting in one dashboard.",
    image: "https://picsum.photos/seed/ledgerline/800/600",
    website: "https://example.com/ledgerline",
  },
  {
    id: `${COMPANY_PREFIX}meridian`,
    name: "Meridian Wealth",
    description:
      "Robo-advisory and human advisor hybrid for long-term investing.",
    image: "https://picsum.photos/seed/meridian/800/600",
    website: "https://example.com/meridian",
  },
  {
    id: `${COMPANY_PREFIX}coinstride`,
    name: "Coinstride",
    description:
      "Crypto portfolio tracking, tax lots, and DeFi position monitoring.",
    image: "https://picsum.photos/seed/coinstride/800/600",
    website: "https://example.com/coinstride",
  },
  {
    id: `${COMPANY_PREFIX}cloudpeak`,
    name: "CloudPeak",
    description:
      "Developer tools, CI runners, and managed Postgres for growing teams.",
    image: "https://picsum.photos/seed/cloudpeak/800/600",
    website: "https://example.com/cloudpeak",
  },
  {
    id: `${COMPANY_PREFIX}vitality`,
    name: "Vitality Labs",
    description:
      "Wearables, sleep coaching, and personalized supplement subscriptions.",
    image: "https://picsum.photos/seed/vitality/800/600",
    website: "https://example.com/vitality",
  },
  {
    id: `${COMPANY_PREFIX}studio_sound`,
    name: "Studio Sound",
    description:
      "Reference monitors, interfaces, and plugins for home producers.",
    image: "https://picsum.photos/seed/studiosound/800/600",
    website: "https://example.com/studio-sound",
  },
  {
    id: `${COMPANY_PREFIX}urban_threads`,
    name: "Urban Threads",
    description:
      "Sustainable streetwear drops and limited artist collaborations.",
    image: "https://picsum.photos/seed/urbanthreads/800/600",
    website: "https://example.com/urban-threads",
  },
  {
    id: `${COMPANY_PREFIX}greenroute`,
    name: "GreenRoute",
    description:
      "E-bike leases, route planning, and carbon-offset commute programs.",
    image: "https://picsum.photos/seed/greenroute/800/600",
    website: "https://example.com/greenroute",
  },
  {
    id: `${COMPANY_PREFIX}datanest`,
    name: "DataNest",
    description:
      "Warehouse automation, dbt packages, and BI templates for startups.",
    image: "https://picsum.photos/seed/datanest/800/600",
    website: "https://example.com/datanest",
  },
] as const;

type CompanyId = (typeof companies)[number]["id"];

function article(
  companyId: CompanyId,
  title: string,
  description: string,
  category: string,
  tags: string[],
  priceCents: number,
  imageSeed: string,
) {
  const site = companies.find((c) => c.id === companyId)!.website.replace(/\/$/, "");
  return {
    title,
    description,
    category,
    tags,
    price: priceCents,
    image: `https://picsum.photos/seed/${imageSeed}/640/480`,
    checkoutUrl: `${site}/checkout?item=${encodeURIComponent(imageSeed)}`,
    companyId,
  };
}

const articles = [
  // Gaming — Pixel Forge
  article(
    `${COMPANY_PREFIX}pixel_forge`,
    "Starfall Chronicles: Complete Edition",
    "Open-world RPG with 120+ hours of quests, co-op raids, and seasonal events.",
    "Gaming",
    ["rpg", "open-world", "co-op"],
    5999,
    "sfchronicles"
  ),
  article(
    `${COMPANY_PREFIX}pixel_forge`,
    "Whispering Hollow: DLC Pass",
    "Three story chapters and new playable class for the cozy mystery adventure.",
    "Gaming",
    ["dlc", "indie", "adventure"],
    2499,
    "whollowdlc"
  ),
  article(
    `${COMPANY_PREFIX}pixel_forge`,
    "Pixel Forge Art Book (Digital)",
    "Concept art, lore timelines, and commentary from the narrative team.",
    "Gaming",
    ["digital", "art", "lore"],
    1499,
    "pfartbook"
  ),
  article(
    `${COMPANY_PREFIX}pixel_forge`,
    "Soundtrack Collection Vol. 1",
    "Lossless FLAC and vinyl-ready masters from Starfall Chronicles.",
    "Gaming",
    ["music", "soundtrack"],
    1999,
    "pfsoundtrack"
  ),
  article(
    `${COMPANY_PREFIX}pixel_forge`,
    "Developer Commentary Mode",
    "In-game toggle for scene-by-scene commentary and cut content gallery.",
    "Gaming",
    ["extras", "indie"],
    999,
    "pfcommentary"
  ),
  // Gaming — Neo Arcadia
  article(
    `${COMPANY_PREFIX}neo_arcadia`,
    "Apex Vector: Season Pass Year 2",
    "Battle pass, ranked rewards, and 8 new operators for the tactical shooter.",
    "Gaming",
    ["fps", "multiplayer", "season-pass"],
    3999,
    "apexvector"
  ),
  article(
    `${COMPANY_PREFIX}neo_arcadia`,
    "Arena Legends Pro Circuit Ticket",
    "All regional qualifiers and finals VOD bundle with team cosmetics.",
    "Gaming",
    ["esports", "cosmetics"],
    2999,
    "arenalegends"
  ),
  article(
    `${COMPANY_PREFIX}neo_arcadia`,
    "Neo Arcadia Founder Pack",
    "Legacy skins, title card, and bonus currency for new accounts.",
    "Gaming",
    ["starter", "cosmetics"],
    1999,
    "nafounder"
  ),
  article(
    `${COMPANY_PREFIX}neo_arcadia`,
    "Private Test Realm Access (6 months)",
    "Early balance patches and map labs before public release.",
    "Gaming",
    ["beta", "multiplayer"],
    4999,
    "naptr"
  ),
  article(
    `${COMPANY_PREFIX}neo_arcadia`,
    "Cosmic Drift Racing — Deluxe",
    "Anti-grav racer with split-screen and cross-play ranked ladder.",
    "Gaming",
    ["racing", "couch-coop"],
    4499,
    "cosmicdrift"
  ),
  // Gaming — Respawn Bench
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "Pro Mechanical Keyboard — TKL",
    "Hot-swap switches, PBT keycaps, and tournament mode latency tuning.",
    "Gaming",
    ["peripherals", "keyboard", "esports"],
    18900,
    "rbkeyboard"
  ),
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "Ultralight Wireless Mouse",
    "58g shell, 4K Hz polling, and PTFE skates included.",
    "Gaming",
    ["mouse", "wireless"],
    12900,
    "rbmouse"
  ),
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "Streamer RGB Key Light Duo",
    "Bi-color panels with desk clamps and software scenes.",
    "Gaming",
    ["streaming", "lighting"],
    27900,
    "rbkeylight"
  ),
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "Ergo Gaming Chair — Graphite",
    "Lumbar dial, 4D arms, and breathable mesh for long sessions.",
    "Gaming",
    ["chair", "ergonomics"],
    44900,
    "rbchair"
  ),
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "7.1 Surround Headset",
    "Detachable mic, EQ profiles per game genre, and console dongle.",
    "Gaming",
    ["audio", "headset"],
    15900,
    "rbheadset"
  ),
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "Mousepad Desk Mat XXL",
    "Stitched edge, hybrid surface for speed and control.",
    "Gaming",
    ["mousepad", "desk"],
    4900,
    "rbpad"
  ),
  // Finance — Ledgerline
  article(
    `${COMPANY_PREFIX}ledgerline`,
    "Ledgerline Starter — Annual",
    "Invoicing, expense capture, and bank feeds for up to 3 users.",
    "Finance",
    ["accounting", "smb", "saas"],
    118800,
    "llstarter"
  ),
  article(
    `${COMPANY_PREFIX}ledgerline`,
    "Payroll Add-on",
    "Automated tax filings and contractor payments in supported regions.",
    "Finance",
    ["payroll", "hr"],
    58800,
    "llpayroll"
  ),
  article(
    `${COMPANY_PREFIX}ledgerline`,
    "Cash Flow Forecast Pro",
    "13-week rolling forecast with scenario sliders.",
    "Finance",
    ["forecasting", "planning"],
    29900,
    "llforecast"
  ),
  article(
    `${COMPANY_PREFIX}ledgerline`,
    "API Access Pack",
    "REST and webhooks for ERP and marketplace integrations.",
    "Finance",
    ["api", "integration"],
    19900,
    "llapi"
  ),
  article(
    `${COMPANY_PREFIX}ledgerline`,
    "Audit Trail Archive (5yr)",
    "Immutable logs and export bundles for compliance reviews.",
    "Finance",
    ["compliance", "audit"],
    9900,
    "llaudit"
  ),
  // Finance — Meridian
  article(
    `${COMPANY_PREFIX}meridian`,
    "Meridian Core Portfolio",
    "Globally diversified ETF glide path with quarterly rebalancing.",
    "Finance",
    ["investing", "etf"],
    0,
    "mcore"
  ),
  article(
    `${COMPANY_PREFIX}meridian`,
    "Advisor Session Pack (3x)",
    "Video sessions with CFP for life events and allocation review.",
    "Finance",
    ["advisory", "planning"],
    45000,
    "madvisor"
  ),
  article(
    `${COMPANY_PREFIX}meridian`,
    "Tax-Loss Harvesting Plus",
    "Automated TLH with wash-sale guardrails on taxable accounts.",
    "Finance",
    ["tax", "investing"],
    2400,
    "mtlh"
  ),
  article(
    `${COMPANY_PREFIX}meridian`,
    "529 Education Goal Planner",
    "State plan comparison and contribution scheduler.",
    "Finance",
    ["529", "education"],
    1200,
    "m529"
  ),
  article(
    `${COMPANY_PREFIX}meridian`,
    "ESG Tilt Sleeve",
    "Optional ESG and climate metrics overlay on core portfolio.",
    "Finance",
    ["esg", "investing"],
    800,
    "mesg"
  ),
  // Finance — Coinstride
  article(
    `${COMPANY_PREFIX}coinstride`,
    "Coinstride Pro — Monthly",
    "Exchange sync, DeFi positions, and cost-basis across chains.",
    "Finance",
    ["crypto", "portfolio", "saas"],
    2900,
    "cspro"
  ),
  article(
    `${COMPANY_PREFIX}coinstride`,
    "Tax Export Ultimate",
    "IRS-ready forms plus accountant share link and amendment diff.",
    "Finance",
    ["crypto", "tax"],
    9900,
    "cstax"
  ),
  article(
    `${COMPANY_PREFIX}coinstride`,
    "Staking Yield Dashboard",
    "Validator performance, slashing alerts, and reward accrual.",
    "Finance",
    ["staking", "defi"],
    1500,
    "csstaking"
  ),
  article(
    `${COMPANY_PREFIX}coinstride`,
    "Whale Watch Alerts",
    "Custom on-chain triggers for wallets and protocol treasuries.",
    "Finance",
    ["alerts", "on-chain"],
    1900,
    "cswhale"
  ),
  article(
    `${COMPANY_PREFIX}coinstride`,
    "NFT Floor Tracker",
    "Collection floors, rarity filters, and listing velocity.",
    "Finance",
    ["nft", "markets"],
    900,
    "csnft"
  ),
  // CloudPeak
  article(
    `${COMPANY_PREFIX}cloudpeak`,
    "Managed Postgres — Small HA",
    "2 vCPU, daily backups, and point-in-time recovery.",
    "Developer Tools",
    ["database", "postgres", "cloud"],
    7900,
    "cppg"
  ),
  article(
    `${COMPANY_PREFIX}cloudpeak`,
    "CI Minutes Bundle (50k)",
    "Parallel runners with ARM and x86 matrix builds.",
    "Developer Tools",
    ["ci", "devops"],
    24900,
    "cpci"
  ),
  article(
    `${COMPANY_PREFIX}cloudpeak`,
    "Secrets Manager Team",
    "Scoped env sync to staging and production with rotation hooks.",
    "Developer Tools",
    ["security", "secrets"],
    12900,
    "cpsecrets"
  ),
  article(
    `${COMPANY_PREFIX}cloudpeak`,
    "Edge Cache Add-on",
    "Global CDN with custom rules and image optimization.",
    "Developer Tools",
    ["cdn", "edge"],
    5900,
    "cpcdn"
  ),
  // Vitality
  article(
    `${COMPANY_PREFIX}vitality`,
    "Sleep Coach Annual",
    "CBT-I program with wearable integration and weekly check-ins.",
    "Wellness",
    ["sleep", "health"],
    19900,
    "vitsleep"
  ),
  article(
    `${COMPANY_PREFIX}vitality`,
    "Smart Ring Gen 3",
    "SpO2, HRV, and temperature trends with 7-day battery.",
    "Wellness",
    ["wearable", "tracking"],
    29900,
    "vitring"
  ),
  article(
    `${COMPANY_PREFIX}vitality`,
    "Personalized Supplements — 90 days",
    "Blood panel optional; monthly adjusted formula shipments.",
    "Wellness",
    ["supplements", "personalized"],
    14900,
    "vitsupp"
  ),
  // Studio Sound
  article(
    `${COMPANY_PREFIX}studio_sound`,
    "Nearfield Monitors Pair",
    "6.5\" coaxial, room correction mic bundle.",
    "Audio",
    ["monitors", "studio"],
    89900,
    "ssmonitors"
  ),
  article(
    `${COMPANY_PREFIX}studio_sound`,
    "USB-C Audio Interface 12x8",
    "DSP mixer, loopback, and low-latency drivers.",
    "Audio",
    ["interface", "recording"],
    34900,
    "ssiface"
  ),
  article(
    `${COMPANY_PREFIX}studio_sound`,
    "Vintage Compressor Plugin",
    "Modeled optical and FET chains with sidechain filter.",
    "Audio",
    ["plugin", "mixing"],
    19900,
    "sscomp"
  ),
  // Urban Threads
  article(
    `${COMPANY_PREFIX}urban_threads`,
    "Limited Drop Hoodie — Ash",
    "Organic cotton, reflective print, numbered edition.",
    "Fashion",
    ["streetwear", "limited"],
    12800,
    "uthoodie"
  ),
  article(
    `${COMPANY_PREFIX}urban_threads`,
    "Artist Collab Tee Pack",
    "Three tees from the spring capsule collection.",
    "Fashion",
    ["tee", "collab"],
    8900,
    "uttees"
  ),
  article(
    `${COMPANY_PREFIX}urban_threads`,
    "Technical Cargo Pants",
    "Water-resistant, articulated knees, hidden zip pockets.",
    "Fashion",
    ["outerwear", "utility"],
    14900,
    "utcargo"
  ),
  // GreenRoute
  article(
    `${COMPANY_PREFIX}greenroute`,
    "E-Bike Commuter Lease (12 mo)",
    "Maintenance and theft protection included.",
    "Mobility",
    ["e-bike", "lease"],
    8900,
    "grebike"
  ),
  article(
    `${COMPANY_PREFIX}greenroute`,
    "Carbon Commute Offset Pack",
    "Annual offsets matched to your logged trips.",
    "Mobility",
    ["sustainability", "offsets"],
    4900,
    "groffset"
  ),
  article(
    `${COMPANY_PREFIX}greenroute`,
    "Premium Route Planner Pro",
    "Elevation-aware routing and battery range estimator.",
    "Mobility",
    ["navigation", "app"],
    1200,
    "grroutes"
  ),
  // DataNest
  article(
    `${COMPANY_PREFIX}datanest`,
    "Startup Metrics dbt Package",
    "MRR, churn, and cohort models with Looker starter dashboards.",
    "Data",
    ["analytics", "dbt"],
    0,
    "dnmetrics"
  ),
  article(
    `${COMPANY_PREFIX}datanest`,
    "Warehouse Health Monitor",
    "Query cost alerts, slot contention, and slow model detection.",
    "Data",
    ["warehouse", "observability"],
    24900,
    "dnhealth"
  ),
  article(
    `${COMPANY_PREFIX}datanest`,
    "PII Tokenization Pipeline",
    "Column-level policies for Snowflake and BigQuery.",
    "Data",
    ["privacy", "security"],
    34900,
    "dnpii"
  ),
  article(
    `${COMPANY_PREFIX}datanest`,
    "Reverse ETL Connectors Bundle",
    "HubSpot, Salesforce, and Iterable sync from curated marts.",
    "Data",
    ["reverse-etl", "crm"],
    19900,
    "dnretl"
  ),
];

async function main() {
  await prisma.article.deleteMany({
    where: { companyId: { startsWith: COMPANY_PREFIX } },
  });
  await prisma.company.deleteMany({
    where: { id: { startsWith: COMPANY_PREFIX } },
  });

  await prisma.company.createMany({ data: [...companies] });
  await prisma.article.createMany({ data: articles });

  console.log(
    `Seeded ${companies.length} companies and ${articles.length} articles (products).`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
