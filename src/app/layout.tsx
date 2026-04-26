import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { I18nProvider } from "@/i18n/context";
import SiteChrome from "@/components/layout/SiteChrome";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Piece by Piece | Minimalist Everyday Jewellery",
  description:
    "Minimalist, everyday jewellery designed to be worn and layered over time, creating quiet confidence, piece by piece.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
