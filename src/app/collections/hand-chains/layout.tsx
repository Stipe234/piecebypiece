import type { Metadata } from "next";

const TITLE = "Hand Chains";
const DESCRIPTION =
  "Hand chains by Piece by Piece, delicate, layered jewellery that traces from wrist to finger. Designed for everyday wear in 14k gold-filled and sterling silver.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "hand chain",
    "hand chains",
    "gold hand chain",
    "silver hand chain",
    "minimalist hand chain",
    "delicate hand chain",
    "everyday hand chain",
  ],
  alternates: { canonical: "/collections/hand-chains" },
  openGraph: {
    type: "website",
    title: `${TITLE} | Piece by Piece`,
    description: DESCRIPTION,
    url: "/collections/hand-chains",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Piece by Piece`,
    description: DESCRIPTION,
  },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Hand Chains",
  description: DESCRIPTION,
  url: "https://www.piecebypiecewear.com/collections/hand-chains",
  isPartOf: {
    "@type": "WebSite",
    name: "Piece by Piece",
    url: "https://www.piecebypiecewear.com",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.piecebypiecewear.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: "https://www.piecebypiecewear.com/collections/hand-chains",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Hand Chains",
        item: "https://www.piecebypiecewear.com/collections/hand-chains",
      },
    ],
  },
};

export default function HandChainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      {children}
    </>
  );
}
