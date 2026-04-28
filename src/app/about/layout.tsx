import type { Metadata } from "next";

const TITLE = "About";
const DESCRIPTION =
  "Piece by Piece is built on a single belief, that good jewellery is not bought all at once. It is built over time, piece by piece. Read our story.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "article",
    title: `${TITLE} | Piece by Piece`,
    description: DESCRIPTION,
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Piece by Piece`,
    description: DESCRIPTION,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
