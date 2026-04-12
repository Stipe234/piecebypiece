"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function HandChainsCollection() {
  const { t } = useI18n();

  return (
    <>
      <section className="relative h-[50vh] md:h-[60vh] min-h-[350px] md:min-h-[500px] overflow-hidden">
        <Image
          src="/images/detail.jpg"
          alt="Hand chains collection"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-xs tracking-[0.25em] uppercase text-white/60 mb-4">
            {t.collection.launchLabel}
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-light tracking-wide text-white">
            {t.collection.title}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-32 px-4 md:px-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
          <ScrollReveal>
            <Link href="/products/the-first-piece" className="block group">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-secondary)]">
                <Image
                  src="/images/intimate.jpg"
                  alt={t.product.name}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="flex flex-col justify-center">
              <p className="text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-4">
                {t.product.label}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-light tracking-wide mb-4">
                {t.product.name}
              </h2>
              <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.8] mb-6 max-w-md">
                {t.product.description}
              </p>
              <p className="text-lg font-medium mb-8">€59</p>
              <Link
                href="/products/the-first-piece"
                className="inline-flex items-center justify-center w-fit text-sm font-medium tracking-[0.1em] uppercase py-3.5 px-10 bg-[var(--color-accent-dark)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)] transition-colors rounded-sm"
              >
                {t.product.viewPiece}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section>
        <ScrollReveal>
          <div className="relative aspect-[4/3] md:aspect-[21/9] overflow-hidden">
            <Image src="/images/lifestyle.jpg" alt="Hand chain worn" fill className="object-cover" sizes="100vw" />
          </div>
        </ScrollReveal>
      </section>

      <section className="py-16 md:py-32 px-6">
        <ScrollReveal>
          <div className="max-w-[640px] mx-auto text-center">
            <hr className="hr-accent mx-auto mb-8 md:mb-10" />
            <p className="pull-quote text-xl md:text-2xl leading-[1.5] text-[var(--color-text-primary)] mb-6">
              {t.collection.storyQuote}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-md mx-auto">
              {t.collection.storyText}
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-[var(--color-bg-secondary)] py-16 md:py-32 px-6">
        <ScrollReveal>
          <div className="max-w-[640px] mx-auto text-center">
            <p className="text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-6">
              {t.collection.moreLabel}
            </p>
            <h3 className="font-heading text-2xl md:text-3xl font-light tracking-wide mb-4">
              {t.collection.moreTitle}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto">
              {t.collection.moreText}
            </p>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
