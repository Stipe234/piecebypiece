import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner",
  robots: { index: false, follow: false, nocache: true },
};

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
