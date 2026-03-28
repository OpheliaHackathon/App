import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
});

const COMPANY_PREFIX = "seed_company_";

const img = {
  company: {
    pixelForge:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=800&h=600&q=80",
    neoArcadia:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&h=600&q=80",
    respawnBench:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&h=600&q=80",
    ledgerline:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&h=600&q=80",
    meridian:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&h=600&q=80",
    coinstride:
      "https://images.unsplash.com/photo-1621761191319-6df2c0404d67?auto=format&fit=crop&w=800&h=600&q=80",
    cloudpeak:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&h=600&q=80",
    vitality:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&h=600&q=80",
    studioSound:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&h=600&q=80",
    urbanThreads:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&h=600&q=80",
    greenroute:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&h=600&q=80",
    datanest:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=600&q=80",
    voidStack:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=600&q=80",
  },
  product: {
    rpgWorld:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=640&h=480&q=80",
    cozyGame:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=640&h=480&q=80",
    artBook:
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=640&h=480&q=80",
    vinylMusic:
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=640&h=480&q=80",
    devCommentary:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=640&h=480&q=80",
    fpsTactical:
      "https://images.unsplash.com/photo-153848119970196-0dfd935cf9d9?auto=format&fit=crop&w=640&h=480&q=80",
    esportsCrowd:
      "https://images.unsplash.com/photo-1540575467063-27a04d4b531c?auto=format&fit=crop&w=640&h=480&q=80",
    starterSkins:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=640&h=480&q=80",
    betaTesting:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=640&h=480&q=80",
    racingCar:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=640&h=480&q=80",
    keyboard:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=640&h=480&q=80",
    mouse:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=640&h=480&q=80",
    streamingLight:
      "https://images.unsplash.com/photo-1598387993441-a364f854c3e6?auto=format&fit=crop&w=640&h=480&q=80",
    officeChair:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=640&h=480&q=80",
    headset:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=640&h=480&q=80",
    deskMat:
      "https://images.unsplash.com/photo-1625841288475-1dea0f0c8a22?auto=format&fit=crop&w=640&h=480&q=80",
    invoiceLaptop:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=640&h=480&q=80",
    payrollTeam:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=640&h=480&q=80",
    forecast:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=640&h=480&q=80",
    apiCode:
      "https://images.unsplash.com/photo-1515879213627-8462d9108a4d?auto=format&fit=crop&w=640&h=480&q=80",
    auditDocs:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=640&h=480&q=80",
    etfGlobe:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=640&h=480&q=80",
    advisorCall:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=640&h=480&q=80",
    taxChart:
      "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=640&h=480&q=80",
    education529:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=640&h=480&q=80",
    esgWind:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=640&h=480&q=80",
    cryptoScreen:
      "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&w=640&h=480&q=80",
    taxForms:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=640&h=480&q=80",
    staking:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=640&h=480&q=80",
    blockchain:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=640&h=480&q=80",
    nftArt:
      "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=640&h=480&q=80",
    postgres:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=640&h=480&q=80",
    ciPipeline:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=640&h=480&q=80",
    secretsLock:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=640&h=480&q=80",
    cdnGlobe:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=640&h=480&q=80",
    sleepNight:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=640&h=480&q=80",
    smartRing:
      "https://m.media-amazon.com/images/I/61iWShj571L._AC_UF1000,1000_QL80_.jpg",
    supplements:
      "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=640&h=480&q=80",
    monitors:
      "https://images.unsplash.com/photo-1525201548942-d87302f013e0?auto=format&fit=crop&w=640&h=480&q=80",
    audioInterface:
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=640&h=480&q=80",
    mixingConsole:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=640&h=480&q=80",
    hoodie:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=640&h=480&q=80",
    tees: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=640&h=480&q=80",
    cargo:
      "https://images.unsplash.com/photo-1473966968600-fa801bb869a8?auto=format&fit=crop&w=640&h=480&q=80",
    ebike:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=640&h=480&q=80",
    forestBike:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=640&h=480&q=80",
    mapPhone:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=640&h=480&q=80",
    analyticsDash:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=640&h=480&q=80",
    warehouse:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=640&h=480&q=80",
    privacyShield:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=640&h=480&q=80",
    crmSync:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=640&h=480&q=80",
    gpuWorkstation:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=640&h=480&q=80",
    mechanicalKbRgb:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=640&h=480&q=80",
    ultrawide:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=640&h=480&q=80",
    vrHeadset:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=640&h=480&q=80",
    handheldConsole:
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=640&h=480&q=80",
  },
} as const;

const companies = [
  {
    id: `${COMPANY_PREFIX}pixel_forge`,
    name: "Pixel Forge Studios",
    description:
      "Indie e AA: RPG narrativi, cozy adventure e colonne sonore premiate.",
    image: img.company.pixelForge,
    website: "https://example.com/pixel-forge",
  },
  {
    id: `${COMPANY_PREFIX}neo_arcadia`,
    name: "Neo Arcadia Games",
    description: "FPS tattici, live service e circuiti esports con cross-play.",
    image: img.company.neoArcadia,
    website: "https://example.com/neo-arcadia",
  },
  {
    id: `${COMPANY_PREFIX}respawn_bench`,
    name: "Respawn Bench",
    description:
      "Periferiche da gaming, sedute ergonomiche e kit per streamer.",
    image: img.company.respawnBench,
    website: "https://example.com/respawn-bench",
  },
  {
    id: `${COMPANY_PREFIX}void_stack`,
    name: "Void Stack Labs",
    description:
      "Workstation GPU, monitor ultrawide, handheld PC e accessori da sviluppo giochi.",
    image: img.company.voidStack,
    website: "https://example.com/void-stack",
  },
  {
    id: `${COMPANY_PREFIX}ledgerline`,
    name: "Ledgerline",
    description:
      "Contabilità PMI, fatture e previsione di cassa in un’unica dashboard.",
    image: img.company.ledgerline,
    website: "https://example.com/ledgerline",
  },
  {
    id: `${COMPANY_PREFIX}meridian`,
    name: "Meridian Wealth",
    description:
      "Robo-advisory e consulenza umana per investimenti a lungo termine.",
    image: img.company.meridian,
    website: "https://example.com/meridian",
  },
  {
    id: `${COMPANY_PREFIX}coinstride`,
    name: "Coinstride",
    description:
      "Portfolio crypto, posizioni DeFi e export fiscali multi-chain.",
    image: img.company.coinstride,
    website: "https://example.com/coinstride",
  },
  {
    id: `${COMPANY_PREFIX}cloudpeak`,
    name: "CloudPeak",
    description: "CI gestito, Postgres HA e secrets sync per team in crescita.",
    image: img.company.cloudpeak,
    website: "https://example.com/cloudpeak",
  },
  {
    id: `${COMPANY_PREFIX}vitality`,
    name: "Vitality Labs",
    description: "Wearable, coaching sul sonno e integratori personalizzati.",
    image: img.company.vitality,
    website: "https://example.com/vitality",
  },
  {
    id: `${COMPANY_PREFIX}studio_sound`,
    name: "Studio Sound",
    description: "Monitor nearfield, interfacce USB e plugin per mix e master.",
    image: img.company.studioSound,
    website: "https://example.com/studio-sound",
  },
  {
    id: `${COMPANY_PREFIX}urban_threads`,
    name: "Urban Threads",
    description: "Streetwear sostenibile e drop in collaborazione con artisti.",
    image: img.company.urbanThreads,
    website: "https://example.com/urban-threads",
  },
  {
    id: `${COMPANY_PREFIX}greenroute`,
    name: "GreenRoute",
    description: "Noleggio e-bike, pianificazione percorsi e offset emissioni.",
    image: img.company.greenroute,
    website: "https://example.com/greenroute",
  },
  {
    id: `${COMPANY_PREFIX}datanest`,
    name: "DataNest",
    description: "dbt, osservabilità warehouse e reverse ETL verso CRM.",
    image: img.company.datanest,
    website: "https://example.com/datanest",
  },
] as const;

type CompanyId = (typeof companies)[number]["id"];

function article(
  companyId: CompanyId,
  checkoutSlug: string,
  title: string,
  description: string,
  category: string,
  tags: string[],
  priceCents: number,
  imageUrl: string,
) {
  const site = companies
    .find((c) => c.id === companyId)!
    .website.replace(/\/$/, "");
  return {
    title,
    description,
    category,
    tags,
    price: priceCents,
    image: imageUrl,
    checkoutUrl: `${site}/checkout?item=${encodeURIComponent(checkoutSlug)}`,
    companyId,
  };
}

const articles = [
  // Gaming — Pixel Forge
  article(
    `${COMPANY_PREFIX}pixel_forge`,
    "sfchronicles",
    "Starfall Chronicles: Complete Edition",
    "Open-world RPG con 120+ ore di missioni, raid co-op ed eventi stagionali.",
    "Gaming",
    ["rpg", "open-world", "co-op"],
    6499,
    img.product.rpgWorld,
  ),
  article(
    `${COMPANY_PREFIX}pixel_forge`,
    "whollowdlc",
    "Whispering Hollow: DLC Pass",
    "Tre capitoli narrativi e nuova classe giocabile per l’avventura cozy mystery.",
    "Gaming",
    ["dlc", "indie", "adventure"],
    1999,
    img.product.cozyGame,
  ),
  article(
    `${COMPANY_PREFIX}pixel_forge`,
    "pfartbook",
    "Pixel Forge Art Book (digitale)",
    "Concept art, timeline del lore e commenti del team narrativo.",
    "Gaming",
    ["digital", "art", "lore"],
    1299,
    img.product.artBook,
  ),
  article(
    `${COMPANY_PREFIX}pixel_forge`,
    "pfsoundtrack",
    "Colonna sonora Starfall Vol. 1",
    "Master FLAC e versioni pronte per vinile da Starfall Chronicles.",
    "Gaming",
    ["music", "soundtrack"],
    1799,
    img.product.vinylMusic,
  ),
  article(
    `${COMPANY_PREFIX}pixel_forge`,
    "pfcommentary",
    "Modalità commenti sviluppatori",
    "Toggle in-game con commenti scena per scena e galleria contenuti tagliati.",
    "Gaming",
    ["extras", "indie"],
    799,
    img.product.devCommentary,
  ),
  // Gaming — Neo Arcadia
  article(
    `${COMPANY_PREFIX}neo_arcadia`,
    "apexvector",
    "Apex Vector: Season Pass Year 2",
    "Battle pass, ricompense ranked e 8 operatori per lo shooter tattico.",
    "Gaming",
    ["fps", "multiplayer", "season-pass"],
    3499,
    img.product.fpsTactical,
  ),
  article(
    `${COMPANY_PREFIX}neo_arcadia`,
    "arenalegends",
    "Arena Legends Pro Circuit Ticket",
    "Bundle VOD di tutte le qualifier regionali e finali con cosmetic di squadra.",
    "Gaming",
    ["esports", "cosmetics"],
    2499,
    img.product.esportsCrowd,
  ),
  article(
    `${COMPANY_PREFIX}neo_arcadia`,
    "nafounder",
    "Neo Arcadia Founder Pack",
    "Skin legacy, titolo profilo e valuta bonus per nuovi account.",
    "Gaming",
    ["starter", "cosmetics"],
    1499,
    img.product.starterSkins,
  ),
  article(
    `${COMPANY_PREFIX}neo_arcadia`,
    "naptr",
    "Accesso Private Test Realm (6 mesi)",
    "Patch di bilanciamento e laboratori mappa prima del rilascio pubblico.",
    "Gaming",
    ["beta", "multiplayer"],
    2499,
    img.product.betaTesting,
  ),
  article(
    `${COMPANY_PREFIX}neo_arcadia`,
    "cosmicdrift",
    "Cosmic Drift Racing — Deluxe",
    "Anti-grav racer con split-screen e ladder ranked cross-play.",
    "Gaming",
    ["racing", "couch-coop"],
    3999,
    img.product.racingCar,
  ),
  // Gaming — Respawn Bench
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "rbkeyboard",
    "Tastiera meccanica Pro — TKL",
    "Switch hot-swap, keycap PBT e modalità torneo a bassa latenza.",
    "Gaming",
    ["peripherals", "keyboard", "esports"],
    12999,
    img.product.keyboard,
  ),
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "rbmouse",
    "Mouse wireless ultraleggero",
    "Scocca 58g, polling 4 kHz e pattini PTFE inclusi.",
    "Gaming",
    ["mouse", "wireless"],
    8999,
    img.product.mouse,
  ),
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "rbkeylight",
    "Key light RGB da streamer (coppia)",
    "Pannelli bicolori, morsetti da scrivania e scene via software.",
    "Gaming",
    ["streaming", "lighting"],
    14999,
    img.product.streamingLight,
  ),
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "rbchair",
    "Sedia gaming ergonomica — Graphite",
    "Supporto lombare regolabile, braccioli 4D e mesh traspirante.",
    "Gaming",
    ["chair", "ergonomics"],
    34999,
    img.product.officeChair,
  ),
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "rbheadset",
    "Cuffie surround 7.1",
    "Microfono staccabile, EQ per genere e dongle console.",
    "Gaming",
    ["audio", "headset"],
    9999,
    img.product.headset,
  ),
  article(
    `${COMPANY_PREFIX}respawn_bench`,
    "rbpad",
    "Tappetino desk mat XXL",
    "Bordo cucito e superficie ibrida speed/control.",
    "Gaming",
    ["mousepad", "desk"],
    2999,
    img.product.deskMat,
  ),
  // Tech / gaming hardware — Void Stack
  article(
    `${COMPANY_PREFIX}void_stack`,
    "vs-workstation",
    "Workstation Creator RTX — preassemblata",
    "Case airflow, 64 GB RAM e SSD NVMe per Unreal/Blender e compilazioni pesanti.",
    "Tech",
    ["pc", "workstation", "gpu"],
    229999,
    img.product.gpuWorkstation,
  ),
  article(
    `${COMPANY_PREFIX}void_stack`,
    "vs-keyboard",
    "Tastiera 75% — gasket mount RGB",
    "Foam a strati, stabilizzatori lubrificati e software open source.",
    "Tech",
    ["keyboard", "mechanical", "rgb"],
    15999,
    img.product.mechanicalKbRgb,
  ),
  article(
    `${COMPANY_PREFIX}void_stack`,
    "vs-monitor",
    'Monitor 34" ultrawide QHD 165 Hz',
    "HDR400, FreeSync Premium e hub USB-C 90 W per laptop da sviluppo.",
    "Tech",
    ["monitor", "ultrawide", "dev"],
    49999,
    img.product.ultrawide,
  ),
  article(
    `${COMPANY_PREFIX}void_stack`,
    "vs-vr",
    "Kit VR PC — headset + basi",
    "Tracking room-scale e comfort strap per sessioni lunghe di playtest.",
    "Tech",
    ["vr", "gaming", "hardware"],
    59999,
    img.product.vrHeadset,
  ),
  article(
    `${COMPANY_PREFIX}void_stack`,
    "vs-handheld",
    "Handheld PC gaming — 512 GB",
    'Schermo 7" 120 Hz, SteamOS/Windows dual boot e dock USB-C.',
    "Tech",
    ["handheld", "pc-gaming", "portable"],
    69999,
    img.product.handheldConsole,
  ),
  // Finance — Ledgerline
  article(
    `${COMPANY_PREFIX}ledgerline`,
    "llstarter",
    "Ledgerline Starter — annuale",
    "Fatture, spese e collegamenti bancari fino a 3 utenti.",
    "Finance",
    ["accounting", "smb", "saas"],
    34800,
    img.product.invoiceLaptop,
  ),
  article(
    `${COMPANY_PREFIX}ledgerline`,
    "llpayroll",
    "Add-on Payroll",
    "Adempimenti fiscali automatici e pagamenti collaboratori dove supportato.",
    "Finance",
    ["payroll", "hr"],
    22800,
    img.product.payrollTeam,
  ),
  article(
    `${COMPANY_PREFIX}ledgerline`,
    "llforecast",
    "Cash Flow Forecast Pro",
    "Previsione rolling 13 settimane con scenari interattivi.",
    "Finance",
    ["forecasting", "planning"],
    17900,
    img.product.forecast,
  ),
  article(
    `${COMPANY_PREFIX}ledgerline`,
    "llapi",
    "API Access Pack",
    "REST e webhook per integrazioni ERP e marketplace.",
    "Finance",
    ["api", "integration"],
    9900,
    img.product.apiCode,
  ),
  article(
    `${COMPANY_PREFIX}ledgerline`,
    "llaudit",
    "Audit Trail Archive (5 anni)",
    "Log immutabili e export per revisioni di conformità.",
    "Finance",
    ["compliance", "audit"],
    7900,
    img.product.auditDocs,
  ),
  // Finance — Meridian
  article(
    `${COMPANY_PREFIX}meridian`,
    "mcore",
    "Portfolio Meridian Core",
    "Percorso ETF diversificato globalmente con ribilanciamento trimestrale.",
    "Finance",
    ["investing", "etf"],
    0,
    img.product.etfGlobe,
  ),
  article(
    `${COMPANY_PREFIX}meridian`,
    "madvisor",
    "Pacchetto consulente (3 sessioni)",
    "Video con CFP per eventi di vita e revisione allocazione.",
    "Finance",
    ["advisory", "planning"],
    39000,
    img.product.advisorCall,
  ),
  article(
    `${COMPANY_PREFIX}meridian`,
    "mtlh",
    "Tax-Loss Harvesting Plus",
    "TLH automatico con guardrail wash-sale su conti tassabili.",
    "Finance",
    ["tax", "investing"],
    8900,
    img.product.taxChart,
  ),
  article(
    `${COMPANY_PREFIX}meridian`,
    "m529",
    "Pianificatore obiettivo 529",
    "Confronto piani statali e scheduler contributi.",
    "Finance",
    ["529", "education"],
    1900,
    img.product.education529,
  ),
  article(
    `${COMPANY_PREFIX}meridian`,
    "mesg",
    "Sleeve ESG",
    "Overlay opzionale ESG e metriche clima sul core.",
    "Finance",
    ["esg", "investing"],
    900,
    img.product.esgWind,
  ),
  // Finance — Coinstride
  article(
    `${COMPANY_PREFIX}coinstride`,
    "cspro",
    "Coinstride Pro — mensile",
    "Sync exchange, posizioni DeFi e cost basis multi-chain.",
    "Finance",
    ["crypto", "portfolio", "saas"],
    1499,
    img.product.cryptoScreen,
  ),
  article(
    `${COMPANY_PREFIX}coinstride`,
    "cstax",
    "Tax Export Ultimate",
    "Moduli pronti per commercialista e diff modifiche anno su anno.",
    "Finance",
    ["crypto", "tax"],
    7900,
    img.product.taxForms,
  ),
  article(
    `${COMPANY_PREFIX}coinstride`,
    "csstaking",
    "Dashboard yield staking",
    "Performance validator, alert slashing e accrual reward.",
    "Finance",
    ["staking", "defi"],
    900,
    img.product.staking,
  ),
  article(
    `${COMPANY_PREFIX}coinstride`,
    "cswhale",
    "Alert Whale Watch",
    "Trigger on-chain personalizzati per wallet e tesorerie protocollo.",
    "Finance",
    ["alerts", "on-chain"],
    1499,
    img.product.blockchain,
  ),
  article(
    `${COMPANY_PREFIX}coinstride`,
    "csnft",
    "NFT Floor Tracker",
    "Floor per collezione, filtri rarità e velocità listing.",
    "Finance",
    ["nft", "markets"],
    699,
    img.product.nftArt,
  ),
  // CloudPeak
  article(
    `${COMPANY_PREFIX}cloudpeak`,
    "cppg",
    "Postgres gestito — Small HA",
    "2 vCPU, backup giornalieri e point-in-time recovery.",
    "Developer Tools",
    ["database", "postgres", "cloud"],
    5900,
    img.product.postgres,
  ),
  article(
    `${COMPANY_PREFIX}cloudpeak`,
    "cpci",
    "Bundle minuti CI (50k)",
    "Runner paralleli con matrix ARM/x86.",
    "Developer Tools",
    ["ci", "devops"],
    19900,
    img.product.ciPipeline,
  ),
  article(
    `${COMPANY_PREFIX}cloudpeak`,
    "cpsecrets",
    "Secrets Manager Team",
    "Sync env scoped verso staging/prod con hook di rotazione.",
    "Developer Tools",
    ["security", "secrets"],
    9900,
    img.product.secretsLock,
  ),
  article(
    `${COMPANY_PREFIX}cloudpeak`,
    "cpcdn",
    "Add-on Edge Cache",
    "CDN globale con regole custom e ottimizzazione immagini.",
    "Developer Tools",
    ["cdn", "edge"],
    3900,
    img.product.cdnGlobe,
  ),
  // Vitality
  article(
    `${COMPANY_PREFIX}vitality`,
    "vitsleep",
    "Sleep Coach annuale",
    "Programma CBT-I con wearable e check-in settimanali.",
    "Wellness",
    ["sleep", "health"],
    17900,
    img.product.sleepNight,
  ),
  article(
    `${COMPANY_PREFIX}vitality`,
    "vitring",
    "Smart ring Gen 3",
    "SpO2, HRV e trend temperatura, batteria ~7 giorni.",
    "Wellness",
    ["wearable", "tracking"],
    27900,
    img.product.smartRing,
  ),
  article(
    `${COMPANY_PREFIX}vitality`,
    "vitsupp",
    "Integratori personalizzati — 90 giorni",
    "Pannello sangue opzionale; formula aggiornata mensilmente.",
    "Wellness",
    ["supplements", "personalized"],
    11900,
    img.product.supplements,
  ),
  // Studio Sound
  article(
    `${COMPANY_PREFIX}studio_sound`,
    "ssmonitors",
    "Coppia monitor nearfield",
    'Coassiali 6,5" e bundle micro per room correction.',
    "Audio",
    ["monitors", "studio"],
    57999,
    img.product.monitors,
  ),
  article(
    `${COMPANY_PREFIX}studio_sound`,
    "ssiface",
    "Interfaccia audio USB-C 12x8",
    "Mixer DSP, loopback e driver a bassa latenza.",
    "Audio",
    ["interface", "recording"],
    31999,
    img.product.audioInterface,
  ),
  article(
    `${COMPANY_PREFIX}studio_sound`,
    "sscomp",
    "Plugin compressore vintage",
    "Catene ottiche e FET modellate con filtro sidechain.",
    "Audio",
    ["plugin", "mixing"],
    9900,
    img.product.mixingConsole,
  ),
  // Urban Threads
  article(
    `${COMPANY_PREFIX}urban_threads`,
    "uthoodie",
    "Felpa limited drop — Ash",
    "Cotone biologico, stampa riflettente, edizione numerata.",
    "Fashion",
    ["streetwear", "limited"],
    8900,
    img.product.hoodie,
  ),
  article(
    `${COMPANY_PREFIX}urban_threads`,
    "uttees",
    "Pack 3 t-shirt artist collab",
    "Tre tee dalla capsule primavera.",
    "Fashion",
    ["tee", "collab"],
    5900,
    img.product.tees,
  ),
  article(
    `${COMPANY_PREFIX}urban_threads`,
    "utcargo",
    "Pantaloni cargo tecnici",
    "Idrorepellenti, ginocchia articolate, tasche zip nascoste.",
    "Fashion",
    ["outerwear", "utility"],
    11900,
    img.product.cargo,
  ),
  // GreenRoute
  article(
    `${COMPANY_PREFIX}greenroute`,
    "grebike",
    "Noleggio e-bike commuter (12 mesi)",
    "Manutenzione e protezione furto incluse.",
    "Mobility",
    ["e-bike", "lease"],
    59800,
    img.product.ebike,
  ),
  article(
    `${COMPANY_PREFIX}greenroute`,
    "groffset",
    "Pacchetto offset commute",
    "Offset annuali abbinati ai tragitti registrati.",
    "Mobility",
    ["sustainability", "offsets"],
    3900,
    img.product.forestBike,
  ),
  article(
    `${COMPANY_PREFIX}greenroute`,
    "grroutes",
    "Route Planner Pro",
    "Navigazione con dislivello e stima autonomia batteria.",
    "Mobility",
    ["navigation", "app"],
    2999,
    img.product.mapPhone,
  ),
  // DataNest
  article(
    `${COMPANY_PREFIX}datanest`,
    "dnmetrics",
    "dbt package metriche startup",
    "MRR, churn e cohort con dashboard Looker starter.",
    "Data",
    ["analytics", "dbt"],
    0,
    img.product.analyticsDash,
  ),
  article(
    `${COMPANY_PREFIX}datanest`,
    "dnhealth",
    "Warehouse Health Monitor",
    "Alert costo query, contention slot e modelli lenti.",
    "Data",
    ["warehouse", "observability"],
    18900,
    img.product.warehouse,
  ),
  article(
    `${COMPANY_PREFIX}datanest`,
    "dnpii",
    "Pipeline tokenizzazione PII",
    "Policy a livello colonna per Snowflake e BigQuery.",
    "Data",
    ["privacy", "security"],
    24900,
    img.product.privacyShield,
  ),
  article(
    `${COMPANY_PREFIX}datanest`,
    "dnretl",
    "Bundle connettori Reverse ETL",
    "HubSpot, Salesforce e Iterable da mart curati.",
    "Data",
    ["reverse-etl", "crm"],
    14900,
    img.product.crmSync,
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
    `Seeded ${companies.length} companies and ${articles.length} articles (products).`,
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
