export const MOCK_FILTERS = [
  "Tutti",
  "Elettronica",
  "Casa",
  "Moda",
  "Sport",
  "Libri",
  "Offerte",
] as const;

export type ProductCategory = Exclude<
  (typeof MOCK_FILTERS)[number],
  "Tutti" | "Offerte"
>;

export type ProductPublisher = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Product = {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  category: ProductCategory;
  description: string;
  publisher: ProductPublisher;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Cuffie wireless con cancellazione rumore",
    price: "€ 89,99",
    imageUrl: "https://picsum.photos/seed/shop1/400/400",
    category: "Elettronica",
    description:
      "Cuffie over-ear con cancellazione attiva del rumore, batteria fino a 30 ore e ricarica rapida USB-C. Padiglioni morbidi e archetto regolabile per sessioni lunghe. Compatibili Bluetooth 5.3 e jack 3,5 mm opzionale.",
    publisher: {
      id: "u1",
      name: "Marco Bianchi",
      avatarUrl: "https://picsum.photos/seed/user1/96/96",
    },
  },
  {
    id: "2",
    title: "Smartwatch fitness tracker",
    price: "€ 129,00",
    imageUrl: "https://picsum.photos/seed/shop2/400/400",
    category: "Elettronica",
    description:
      "Display AMOLED sempre acceso, monitoraggio cardio, sonno e SpO₂. Resistente all’acqua 5 ATM, GPS integrato e oltre 100 modalità sport. Notifiche e pagamenti contactless dove supportato.",
    publisher: {
      id: "u2",
      name: "Giulia Conti",
      avatarUrl: "https://picsum.photos/seed/user2/96/96",
    },
  },
  {
    id: "3",
    title: "Lampada da scrivania LED",
    price: "€ 34,50",
    imageUrl: "https://picsum.photos/seed/shop3/400/400",
    category: "Casa",
    description:
      "Luce calda/fredda regolabile e intensità continua. Braccio snodabile in metallo, base antiscivolo. Consumo ridotto, ideale per studio e smart working.",
    publisher: {
      id: "u3",
      name: "Luca Ferretti",
      avatarUrl: "https://picsum.photos/seed/user3/96/96",
    },
  },
  {
    id: "4",
    title: "Zaino urbano impermeabile",
    price: "€ 59,90",
    imageUrl: "https://picsum.photos/seed/shop4/400/400",
    category: "Moda",
    description:
      "Tessuto idrorepellente, scomparto laptop 15”, tasche organizzate e schienale imbottito traspirante. Perfetto per pendolarismo e viaggi brevi.",
    publisher: {
      id: "u4",
      name: "Sara Romano",
      avatarUrl: "https://picsum.photos/seed/user4/96/96",
    },
  },
  {
    id: "5",
    title: "Tazza termica in acciaio",
    price: "€ 24,99",
    imageUrl: "https://picsum.photos/seed/shop5/400/400",
    category: "Casa",
    description:
      "Mantiene le bevande calde fino a 8 ore e fredde fino a 12. Chiusura a prova di perdite, priva di BPA, capacità 500 ml.",
    publisher: {
      id: "u5",
      name: "Andrea Verdi",
      avatarUrl: "https://picsum.photos/seed/user5/96/96",
    },
  },
  {
    id: "6",
    title: "Caricatore USB-C rapido 65W",
    price: "€ 42,00",
    imageUrl: "https://picsum.photos/seed/shop6/400/400",
    category: "Elettronica",
    description:
      "GaN compatto con uscite USB-C e USB-A. Compatibile con laptop, tablet e smartphone. Protezione da sovraccarico e surriscaldamento.",
    publisher: {
      id: "u1",
      name: "Marco Bianchi",
      avatarUrl: "https://picsum.photos/seed/user1/96/96",
    },
  },
  {
    id: "7",
    title: "Tappetino yoga antiscivolo",
    price: "€ 28,00",
    imageUrl: "https://picsum.photos/seed/shop7/400/400",
    category: "Sport",
    description:
      "Superficie in TPE ecologico, spessore 6 mm per comfort articolare. Adatto a yoga, pilates e stretching. Facile da pulire e arrotolabile.",
    publisher: {
      id: "u6",
      name: "Elena Martini",
      avatarUrl: "https://picsum.photos/seed/user6/96/96",
    },
  },
  {
    id: "8",
    title: "Romanzo thriller — edizione cartonata",
    price: "€ 16,90",
    imageUrl: "https://picsum.photos/seed/shop8/400/400",
    category: "Libri",
    description:
      "Edizione cartonata con sovraccoperta. Bestseller: mistero e colpi di scena fino all’ultima pagina. Lingua italiana, 432 pagine.",
    publisher: {
      id: "u7",
      name: "Davide Gallo",
      avatarUrl: "https://picsum.photos/seed/user7/96/96",
    },
  },
];

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

export function getPublisherById(
  publisherId: string,
): ProductPublisher | undefined {
  const first = MOCK_PRODUCTS.find((p) => p.publisher.id === publisherId);
  return first?.publisher;
}

export function getProductsByPublisherId(publisherId: string): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.publisher.id === publisherId);
}
