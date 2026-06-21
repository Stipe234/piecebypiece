import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/products";
import ProductPageClient from "@/components/product/ProductPageClient";

const SITE_URL = "https://www.piecebypiecewear.com";
const SITE_NAME = "Piece by Piece";

// Pre-render every product page at build time.
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  // Metadata is rendered server-side, so use the default (English) content.
  const content = product.content.en;
  const title = `${content.name} — ${content.label}`;
  const description = content.shortDescription || content.description;
  const url = `${SITE_URL}/products/${product.slug}`;
  const images = product.images.gallery.map((src) => `${SITE_URL}${src}`);

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const content = product.content.en;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${content.name} — ${content.label}`,
    description: content.shortDescription || content.description,
    image: product.images.gallery.map((src) => `${SITE_URL}${src}`),
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Jewellery",
    material: product.materials.join(", "),
    countryOfOrigin: "IT",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "EUR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      // Pieces are released via the waitlist rather than sold from open stock.
      availability: "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductPageClient slug={slug} />
    </>
  );
}
