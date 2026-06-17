import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProductContent, products } from "@/data/products";

const SITE_URL = "https://www.piecebypiecewear.com";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const c = getProductContent(product, "en");
  const url = `/products/${product.slug}`;
  const image = `${SITE_URL}${product.images.studio}`;

  return {
    title: c.name,
    description: c.description,
    keywords: [
      c.name,
      c.label,
      "hand chain",
      "minimalist jewellery",
      "everyday jewellery",
      product.material,
      ...product.materials,
      "Piece by Piece",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${c.name} | Piece by Piece`,
      description: c.description,
      url,
      images: [{ url: image, alt: c.name, width: 1200, height: 1200 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.name} | Piece by Piece`,
      description: c.description,
      images: [image],
    },
    other: {
      "product:price:amount": String(product.price),
      "product:price:currency": "EUR",
      "product:availability":
        product.inventory.totalUnits > 0 ? "in stock" : "out of stock",
    },
  };
}

export default async function ProductLayout({ params, children }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const c = getProductContent(product, "en");
  const productUrl = `${SITE_URL}/products/${product.slug}`;
  const inStock = product.inventory.totalUnits > 0;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: c.name,
    description: c.description,
    sku: product.id,
    image: product.images.gallery.map((img) => `${SITE_URL}${img}`),
    brand: {
      "@type": "Brand",
      name: "Piece by Piece",
    },
    category: "Jewelry > Hand Chains",
    material: product.materials.join(", "),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "EUR",
      price: product.price.toFixed(2),
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Piece by Piece",
        url: SITE_URL,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "EUR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "EU",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hand Chains",
        item: `${SITE_URL}/collections/hand-chains`,
      },
      { "@type": "ListItem", position: 3, name: c.name, item: productUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
