export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  shortDescription: string;
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
  isNew?: boolean;
  details: {
    materialsAndDimensions: string;
    care: string;
    shipping: string;
  };
}

export const products: Product[] = [
  {
    id: "1",
    name: "The First Piece",
    slug: "the-first-piece",
    price: 59,
    description:
      "A hand chain designed to feel like it was always there. It traces from wrist to finger in a single, quiet line \u2014 catching light the way skin does. This is where your collection begins.",
    shortDescription: "Where your collection begins.",
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
    isNew: true,
    details: {
      materialsAndDimensions:
        "14k gold-filled chain (Gold) or sterling silver (Silver). Total length adjustable between 16\u201318cm. Lobster clasp. Chain width: 1mm. Handmade with care.",
      care: "Wear it daily. Avoid prolonged contact with water, perfume, and lotions. Store flat when not worn. Clean gently with a soft cloth. This piece is made to age with you.",
      shipping:
        "Complimentary shipping on all orders. Delivered in 3\u20135 business days. Each piece arrives in a branded linen pouch.",
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
