"use client";

import Image from "next/image";
import Link from "next/link";
import { products, getProductContent, type Product } from "@/data/products";
import { useI18n } from "@/i18n/context";
import ScrollReveal from "@/components/ui/ScrollReveal";

function EditionItem({ product, delay = 0 }: { product: Product; delay?: number }) {
  const { locale } = useI18n();
  const content = getProductContent(product, locale);

  return (
    <ScrollReveal delay={delay}>
      <Link href={`/products/${product.slug}`} className="block group">
        <div className="img-tactile relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-secondary)] mb-5">
          <Image
            src={product.images.studio}
            alt={content.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-1.5">
          {content.label}
        </p>
        <h2 className="font-heading text-xl md:text-2xl font-light tracking-wide">
          {content.name}
        </h2>
      </Link>
    </ScrollReveal>
  );
}

export default function HandChainsCollection() {
  const { t } = useI18n();

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

      <section className="px-6 md:px-12 pb-24 md:pb-40">
        <div className="max-w-[920px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-16">
          {products.map((product, i) => (
            <EditionItem key={product.id} product={product} delay={i * 120} />
          ))}
        </div>
      </section>

      <section className="pb-28 md:pb-40 px-6">
        <ScrollReveal>
          <div className="max-w-[420px] mx-auto text-center">
            <hr className="hr-accent mx-auto mb-8" />
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {t.collection.moreTitle}
            </p>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
