"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import ScrollReveal from "@/components/ui/ScrollReveal";

const PRODUCT_HREF = "/products/edition-001";

export default function HandChainsCollection() {
  const { t } = useI18n();

  const looks = [
    { img: "/images/gold-static.jpg", label: `${t.product.gold} · ${t.product.static}` },
    { img: "/images/silver-static.jpg", label: `${t.product.silver} · ${t.product.static}` },
    { img: "/images/gold-dangling.jpg", label: `${t.product.gold} · ${t.product.dangling}` },
    { img: "/images/silver-dangling.jpg", label: `${t.product.silver} · ${t.product.dangling}` },
  ];

  return (
    <>
      <section className="pt-24 md:pt-36 pb-12 md:pb-20 px-6 text-center">
        <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[var(--color-text-tertiary)] mb-5">
          {t.collection.launchLabel}
        </p>
        <h1 className="font-heading text-4xl md:text-6xl font-light tracking-wide">
          {t.collection.title}
        </h1>
      </section>

      <section className="px-6 md:px-12 pb-28 md:pb-40">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-5 md:gap-x-8 gap-y-14">
          {looks.map((look, i) => (
            <ScrollReveal key={look.img} delay={i * 90}>
              <Link href={PRODUCT_HREF} className="block group">
                <div className="img-tactile relative aspect-[4/5] overflow-hidden bg-white mb-4">
                  <Image
                    src={look.img}
                    alt={look.label}
                    fill
                    quality={90}
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <p className="text-center text-[11px] md:text-xs tracking-[0.12em] text-[var(--color-text-secondary)]">
                  {look.label}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
