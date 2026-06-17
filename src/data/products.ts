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
  styles: string[];
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
    slug: "edition-001",
    price: 59,
    material: "gold",
    materials: ["Gold", "Silver"],
    styles: ["Static", "Dangling"],
    lengths: ["One size"],
    images: {
      studio: "/images/gold-static.jpg",
      onBody: "/images/intimate.jpg",
      gallery: [
        "/images/gold-static.jpg",
        "/images/gold-dangling.jpg",
        "/images/silver-static.jpg",
        "/images/silver-dangling.jpg",
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
        label: "The Hand Chain",
        name: "Edition 001",
        description:
          "A hand chain that feels like part of you.\nOne quiet line, from wrist to finger.\nSubtle. Intentional. Yours.",
        shortDescription: "The hand chain that begins your collection.",
        details: {
          materialsAndDimensions:
            "Gold plated or silver plated chain. Lobster clasp. Chain width: 1mm. Handmade with care.",
          care:
            "Avoid catching it on fabrics, zippers, or rough surfaces. Remove before sleeping or exercise. Avoid prolonged contact with water, perfume, and lotions. Store flat when not worn.",
          shipping:
            "Complimentary shipping on all orders. Delivered in 3–5 business days.",
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
