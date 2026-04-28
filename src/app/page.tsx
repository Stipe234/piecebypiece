"use client";

import Image from "next/image";
import Link from "next/link";
import { products, getProductContent } from "@/data/products";
import { useI18n } from "@/i18n/context";
import ScrollReveal from "@/components/ui/ScrollReveal";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { useProductAvailability } from "@/hooks/useProductAvailability";

export default function Home() {
  const { t, locale } = useI18n();
  const featuredProduct = products[0];
  const featuredContent = getProductContent(featuredProduct, locale);
  const { availability } = useProductAvailability(featuredProduct.id);
  const isSoldOut = availability?.isSoldOut ?? false;
  const displayPrice = availability?.priceCents != null ? availability.priceCents / 100 : featuredProduct.price;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[100svh] min-h-[550px] md:min-h-[700px] overflow-hidden">
        <div className="hero-image-enter absolute inset-0">
          <Image
            src="/images/intimate.jpg"
            alt="Close-up of a hand wearing a delicate gold chain"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-32 text-center px-6">
          <p className="hero-text-enter text-[10px] md:text-xs tracking-[0.25em] uppercase text-white/70 mb-4 md:mb-6">
            {t.hero.introducing}
          </p>
          <h1 className="hero-text-enter font-heading text-4xl md:text-7xl lg:text-8xl font-light text-white tracking-wide leading-[1.1]">
            {t.hero.title}
          </h1>
          <p className="hero-text-enter-delayed text-sm text-white/70 mt-4 md:mt-6 max-w-xs md:max-w-sm leading-relaxed">
            {t.hero.subtitle}
          </p>
        </div>
      </section>

      {/* ── Brand Statement ── */}
      <section className="py-20 md:py-44 px-6">
        <ScrollReveal>
          <div className="max-w-[640px] mx-auto text-center">
            <hr className="hr-accent mx-auto mb-8 md:mb-10" />
            <p className="pull-quote text-xl md:text-[2rem] leading-[1.5]">
              {t.brandStatement}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Product Introduction ── */}
      <section className="px-4 md:px-0">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-12 gap-1 md:gap-2">
          <ScrollReveal className="col-span-1 md:col-span-7">
            <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
              <Image
                src="/images/lifestyle.jpg"
                alt="Hand chain worn with white blazer and denim"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 58vw"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal className="col-span-1 md:col-span-5" delay={200}>
            <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
              <Image
                src="/images/detail.jpg"
                alt="Hand chain detail with gold bangles"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 42vw"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Product Details Band ── */}
      <section className="py-16 md:py-32 px-6">
        <ScrollReveal>
          <div className="max-w-[640px] mx-auto text-center">
            <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-3 md:mb-4">
              {featuredContent.label}
            </p>
            <h2 className="font-heading text-2xl md:text-4xl font-light tracking-wide mb-3 md:mb-4">
              {featuredContent.name}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-md mx-auto mb-6 md:mb-8 whitespace-pre-line">
              {featuredContent.description}
            </p>
            <p className="text-lg font-medium mb-6 md:mb-8">€{displayPrice}</p>
            <Link
              href={`/products/${featuredProduct.slug}`}
              className="inline-flex items-center justify-center text-sm font-medium tracking-[0.1em] uppercase py-3 px-8 md:py-3.5 md:px-10 bg-[var(--color-accent-dark)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)] transition-colors rounded-sm"
            >
              {isSoldOut ? t.product.soldOut : t.product.viewPiece}
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Editorial Split ── */}
      <section className="bg-[var(--color-bg-secondary)]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 md:min-h-[80vh]">
          <div className="flex flex-col justify-center px-6 md:px-20 py-16 md:py-32 order-2 md:order-1">
            <ScrollReveal>
              <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-6 md:mb-8">
                {t.philosophy.label}
              </p>
              <h2 className="font-heading text-2xl md:text-4xl font-light tracking-wide leading-[1.2] mb-6 md:mb-8 whitespace-pre-line">
                {t.philosophy.title}
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-[1.8] max-w-md mb-4 md:mb-6">
                {t.philosophy.p1}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-[1.8] max-w-md">
                {t.philosophy.p2}
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal className="relative aspect-[4/5] md:aspect-auto order-1 md:order-2">
            <Image
              src="/images/intimate.jpg"
              alt="Intimate detail of hand chain on skin"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Pull Quote ── */}
      <section className="py-20 md:py-44 px-6">
        <ScrollReveal>
          <div className="max-w-[720px] mx-auto text-center">
            <blockquote className="pull-quote text-xl md:text-4xl text-[var(--color-text-primary)] leading-[1.4] whitespace-pre-line">
              {t.pullQuote}
            </blockquote>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Full-Width Editorial ── */}
      <section className="px-4 md:px-0">
        <ScrollReveal>
          <div className="max-w-[1440px] mx-auto relative aspect-[4/3] md:aspect-[16/7] overflow-hidden">
            <Image
              src="/images/lifestyle.jpg"
              alt="Hand chain editorial"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </ScrollReveal>
      </section>

      {/* ── Coming Soon ── */}
      <section className="py-20 md:py-44 px-6">
        <ScrollReveal>
          <div className="max-w-[640px] mx-auto text-center">
            <hr className="hr-accent mx-auto mb-8 md:mb-10" />
            <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-4 md:mb-6">
              {t.comingSoon.label}
            </p>
            <h2 className="font-heading text-xl md:text-3xl font-light tracking-wide mb-4 md:mb-6 whitespace-pre-line">
              {t.comingSoon.title}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto">
              {t.comingSoon.text}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-[var(--color-bg-secondary)] py-16 md:py-32 px-6">
        <ScrollReveal>
          <div className="max-w-sm mx-auto text-center">
            <p className="pull-quote text-lg md:text-2xl mb-6 md:mb-8 whitespace-pre-line">
              {t.newsletter.title}
            </p>
            <NewsletterForm />
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
