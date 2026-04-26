"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSlideOut from "@/components/ui/CartSlideOut";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isOwnerArea = pathname.startsWith("/owner");

  if (isOwnerArea) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSlideOut />
    </>
  );
}
