import type { Locale } from "@/i18n/translations";

export interface ProductContent {
  label: string;
  name: string;
  description: string;
  shortDescription: string;
  details: {
    materialsAndDimensions: string;
    care: string;
    shipping: string;
  };
}

export interface Product {
  id: string;
  slug: string;
  price: number;
  material: string;
  materials: string[];
  lengths: string[];
  images: {
    studio: string;
    onBody: string;
    gallery: string[];
  };
  collection: string;
  layersWith: string[];
  inventory: {
    totalUnits: number;
  };
  isNew?: boolean;
  content: Record<Locale, ProductContent>;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "the-first-piece",
    price: 59,
    material: "gold",
    materials: ["Gold", "Silver"],
    lengths: ["16cm", "18cm"],
    images: {
      studio: "/images/intimate.jpg",
      onBody: "/images/lifestyle.jpg",
      gallery: [
        "/images/intimate.jpg",
        "/images/lifestyle.jpg",
        "/images/detail.jpg",
      ],
    },
    collection: "hand-chains",
    layersWith: [],
    inventory: {
      totalUnits: 10,
    },
    isNew: true,
    content: {
      en: {
        label: "Hand Chain 001",
        name: "The First Piece",
        description:
          "A hand chain designed to feel like it was always there. It traces from wrist to finger in a single, quiet line \u2014 catching light the way skin does. This is where your collection begins.",
        shortDescription: "Where your collection begins.",
        details: {
          materialsAndDimensions:
            "14k gold-filled chain (Gold) or sterling silver (Silver). Total length adjustable between 16\u201318cm. Lobster clasp. Chain width: 1mm. Handmade with care.",
          care:
            "This piece is deliberately fine. It is meant to be felt, not seen from across the room. Wear it with awareness \u2014 the way you would anything you value. Avoid catching it on fabrics, zippers, or rough surfaces. Remove before sleeping or exercise. Avoid prolonged contact with water, perfume, and lotions. Store flat when not worn. This is not fragility. It is lightness, by design.",
          shipping:
            "Complimentary shipping on all orders. Delivered in 3\u20135 business days. Each piece arrives in a branded linen pouch.",
        },
      },
      hr: {
        label: "Lan\u010Di\u0107 za ruku 001",
        name: "Prvi komad",
        description:
          "Lan\u010Di\u0107 za ruku dizajniran da se osjeti kao da je oduvijek bio tu. Prati liniju od zape\u0161\u0107a do prsta u jednom tihom potezu \u2014 hvata svjetlo kao ko\u017Ea. Ovdje po\u010Dinje tvoja kolekcija.",
        shortDescription: "Mjesto gdje tvoja kolekcija po\u010Dinje.",
        details: {
          materialsAndDimensions:
            "14k pozla\u0107eni lanac (Zlato) ili sterling srebro (Srebro). Ukupna duljina podesiva izme\u0111u 16\u201318cm. Kopca jastog. \u0160irina lanca: 1mm. Ru\u010Dno izra\u0111eno s pa\u017Enjom.",
          care:
            "Ovaj komad je namjerno fin. Napravljen je da se osjeti, ne da se vidi s drugog kraja prostorije. Nosi ga svjesno \u2014 kao \u0161to bi nosila bilo \u0161to \u0161to cijeni\u0161. Izbjegavaj da se zakvaci za tkanine, patentne zatvara\u010De ili grube povr\u0161ine. Skini prije spavanja ili vje\u017Ebanja. Izbjegavaj dulji kontakt s vodom, parfemom i losionima. Spremi ravno kad ga ne nosi\u0161. Ovo nije krhkost. Ovo je lako\u0107a, prema dizajnu.",
          shipping:
            "Besplatna dostava na sve narud\u017Ebe. Isporuka u 3\u20135 radnih dana. Svaki komad dolazi u brendiranoj lanenoj vre\u0107ici.",
        },
      },
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getLayersWithProducts(product: Product): Product[] {
  return product.layersWith
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}

export function getProductContent(product: Product, locale: Locale): ProductContent {
  return product.content[locale] ?? product.content.en;
}
