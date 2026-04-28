import type { Metadata } from "next";

const TITLE = "Journal";
const DESCRIPTION =
  "Reflections on minimalist jewellery, intentional collecting, and the quiet rituals of everyday wear, from the Piece by Piece studio.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/journal" },
  openGraph: {
    type: "website",
    title: `${TITLE} | Piece by Piece`,
    description: DESCRIPTION,
    url: "/journal",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Piece by Piece`,
    description: DESCRIPTION,
  },
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
