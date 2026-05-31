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
    layersWith: ["2"],
    inventory: {
      totalUnits: 10,
    },
    isNew: true,
    content: {
      en: {
        label: "The First Piece",
        name: "Edition 001",
        description:
          "A hand chain that feels like part of you.\nOne quiet line, from wrist to finger.\nSubtle. Intentional. Yours.",
        shortDescription: "A hand chain that feels like part of you.",
        details: {
          materialsAndDimensions:
            "14k gold-filled chain (Gold) or sterling silver (Silver). Total length adjustable between 16\u201318cm. Lobster clasp. Chain width: 1mm. Handmade with care.",
          care:
            "This piece is deliberately fine. It is meant to be felt, not seen from across the room. Wear it with awareness, the way you would anything you value. Avoid catching it on fabrics, zippers, or rough surfaces. Remove before sleeping or exercise. Avoid prolonged contact with water, perfume, and lotions. Store flat when not worn. This is not fragility. It is lightness, by design.",
          shipping:
            "Complimentary shipping on all orders. Delivered in 3\u20135 business days. Each piece arrives in a branded linen pouch.",
        },
      },
      hr: {
        label: "Prvi komad",
        name: "Edition 001",
        description:
          "Lan\u010Di\u0107 za ruku koji se osje\u0107a kao dio tebe.\nJedna tiha linija, od zape\u0161\u0107a do prsta.\nSuptilno. Namjerno. Tvoje.",
        shortDescription: "Lan\u010Di\u0107 za ruku koji se osje\u0107a kao dio tebe.",
        details: {
          materialsAndDimensions:
            "14k pozla\u0107eni lanac (Zlato) ili sterling srebro (Srebro). Ukupna duljina podesiva izme\u0111u 16\u201318cm. Kopca jastog. \u0160irina lanca: 1mm. Ru\u010Dno izra\u0111eno s pa\u017Enjom.",
          care:
            "Ovaj komad je namjerno fin. Napravljen je da se osjeti, ne da se vidi s drugog kraja prostorije. Nosi ga svjesno, kao \u0161to bi nosila bilo \u0161to \u0161to cijeni\u0161. Izbjegavaj da se zakvaci za tkanine, patentne zatvara\u010De ili grube povr\u0161ine. Skini prije spavanja ili vje\u017Ebanja. Izbjegavaj dulji kontakt s vodom, parfemom i losionima. Spremi ravno kad ga ne nosi\u0161. Ovo nije krhkost. Ovo je lako\u0107a, prema dizajnu.",
          shipping:
            "Besplatna dostava na sve narud\u017Ebe. Isporuka u 3\u20135 radnih dana. Svaki komad dolazi u brendiranoj lanenoj vre\u0107ici.",
        },
      },
    },
  },
  {
    id: "2",
    slug: "the-second-piece",
    price: 69,
    material: "silver",
    materials: ["Silver", "Gold"],
    lengths: ["17cm", "19cm"],
    images: {
      studio: "/images/warm.jpg",
      onBody: "/images/editorial.jpg",
      gallery: [
        "/images/warm.jpg",
        "/images/editorial.jpg",
        "/images/detail.jpg",
      ],
    },
    collection: "hand-chains",
    layersWith: ["1"],
    inventory: {
      totalUnits: 8,
    },
    isNew: true,
    content: {
      en: {
        label: "The Second Piece",
        name: "Edition 002",
        description:
          "The piece that layers.\nWorn beside the first, or entirely on its own.\nQuiet. Considered. Yours to build on.",
        shortDescription: "The piece that layers with the first.",
        details: {
          materialsAndDimensions:
            "Sterling silver (Silver) or 14k gold-filled chain (Gold). Total length adjustable between 17–19cm. Lobster clasp. Chain width: 1mm. Handmade with care.",
          care:
            "Like the first, this piece is deliberately fine. It is meant to be felt, not seen from across the room. Wear it with awareness, the way you would anything you value. Avoid catching it on fabrics, zippers, or rough surfaces. Remove before sleeping or exercise. Avoid prolonged contact with water, perfume, and lotions. Store flat when not worn. This is not fragility. It is lightness, by design.",
          shipping:
            "Complimentary shipping on all orders. Delivered in 3–5 business days. Each piece arrives in a branded linen pouch.",
        },
      },
      hr: {
        label: "Drugi komad",
        name: "Edition 002",
        description:
          "Komad koji se slaže.\nNošen uz prvi, ili sasvim sam.\nTiho. Promišljeno. Tvoje za nadograditi.",
        shortDescription: "Komad koji se slaže s prvim.",
        details: {
          materialsAndDimensions:
            "Sterling srebro (Srebro) ili 14k pozlaćeni lanac (Zlato). Ukupna duljina podesiva između 17–19cm. Kopca jastog. Širina lanca: 1mm. Ručno izrađeno s pažnjom.",
          care:
            "Kao i prvi, ovaj komad je namjerno fin. Napravljen je da se osjeti, ne da se vidi s drugog kraja prostorije. Nosi ga svjesno, kao što bi nosila bilo što što cijeniš. Izbjegavaj da se zakvaci za tkanine, patentne zatvarače ili grube površine. Skini prije spavanja ili vježbanja. Izbjegavaj dulji kontakt s vodom, parfemom i losionima. Spremi ravno kad ga ne nosiš. Ovo nije krhkost. Ovo je lakoća, prema dizajnu.",
          shipping:
            "Besplatna dostava na sve narudžbe. Isporuka u 3–5 radnih dana. Svaki komad dolazi u brendiranoj lanenoj vrećici.",
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
