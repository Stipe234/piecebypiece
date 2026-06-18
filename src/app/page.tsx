"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import ScrollReveal from "@/components/ui/ScrollReveal";

const PRODUCT_HREF = "/products/edition-001";
const SHOP_HREF = "/collections/hand-chains";

function TrustIcon({ i }: { i: number }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (i) {
    case 0: // Waterproof — droplet
      return (
        <svg {...common}><path d="M12 3c3 4 5.5 6.8 5.5 9.6A5.5 5.5 0 0 1 12 18a5.5 5.5 0 0 1-5.5-5.4C6.5 9.8 9 7 12 3Z" /></svg>
      );
    case 1: // Tarnish resistant — sparkle
      return (
        <svg {...common}><path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" /></svg>
      );
    case 2: // Everyday wear — sun
      return (
        <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      );
    default: // Made to layer — stacked lines
      return (
        <svg {...common}><path d="M3 8h18M3 13h18M3 18h18" /></svg>
      );
  }
}

export default function Home() {
  const { t } = useI18n();
  const h = t.home;

  const looks = [
    { img: "/images/gold-static.jpg", label: `${t.product.gold} · ${t.product.static}` },
    { img: "/images/silver-static.jpg", label: `${t.product.silver} · ${t.product.static}` },
    { img: "/images/gold-dangling.jpg", label: `${t.product.gold} · ${t.product.dangling}` },
    { img: "/images/silver-dangling.jpg", label: `${t.product.silver} · ${t.product.dangling}` },
  ];

  return (
    <>
      {/* ── 1. Hero ── */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
        <div className="hero-image-enter absolute inset-0">
          <div className="hero-drift absolute inset-0">
            <Image
              src="/images/na_taknini.webp"
              alt="Gold hand chain resting on warm sand-toned fabric"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-[30%_center] md:object-left"
            />
          </div>
        </div>
        {/* Mobile: even wash so centered text stays legible over the bright image */}
        <div className="absolute inset-0 bg-black/35 md:hidden" />
        {/* Desktop: dark on the right where the text block sits */}
        <div className="absolute inset-0 hidden md:block bg-gradient-to-l from-black/55 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center md:justify-end">
          <div className="px-6 md:px-16 lg:px-24 max-w-2xl text-center md:text-right">
            <h1 className="hero-text-enter font-heading text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-wide leading-[1.04]">
              {h.hero.headline}
            </h1>
            <p className="hero-text-enter-delayed text-sm md:text-base text-white/80 mt-6 md:mt-8 max-w-md mx-auto md:ml-auto md:mr-0 leading-relaxed">
              {h.hero.body}
            </p>
            <Link
              href={SHOP_HREF}
              className="hero-text-enter-delayed inline-flex items-center mt-8 md:mt-10 text-[11px] md:text-xs font-medium tracking-[0.25em] uppercase text-white border border-white/50 hover:bg-white hover:text-[var(--color-text-primary)] transition-colors px-8 py-3.5"
            >
              {h.hero.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Trust bar ── */}
      <section className="border-b border-[var(--color-border)]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4">
          {h.trust.map((item, i) => (
            <div
              key={item}
              className="flex flex-col items-center text-center gap-3 px-4 py-8 md:py-12 border-[var(--color-border)] [&:nth-child(odd)]:border-r md:[&:not(:last-child)]:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0"
            >
              <span className="text-[var(--color-text-tertiary)]"><TrustIcon i={i} /></span>
              <span className="text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[var(--color-text-secondary)]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Philosophy ── */}
      <section className="py-28 md:py-48 px-6">
        <ScrollReveal>
          <div className="max-w-[620px] mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-5xl font-light tracking-wide leading-[1.15] mb-10 md:mb-14">
              {h.philosophy.headline}
            </h2>
            <div className="flex flex-col gap-5 text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.9]">
              {h.philosophy.body.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── 4. The Collection ── */}
      <section className="bg-[var(--color-bg-secondary)] py-20 md:py-32 px-6 md:px-12">
        <ScrollReveal>
          <p className="text-center text-[10px] md:text-xs tracking-[0.3em] uppercase text-[var(--color-text-tertiary)] mb-12 md:mb-20">
            {h.collectionTitle}
          </p>
        </ScrollReveal>
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-5 md:gap-x-8 gap-y-12">
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

      {/* ── 5. Editorial split ── */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[88vh]">
          <div className="flex flex-col justify-center px-6 md:px-20 py-20 md:py-32 order-2 md:order-1">
            <ScrollReveal>
              <h2 className="font-heading text-3xl md:text-4xl font-light tracking-wide leading-[1.2] mb-8 whitespace-pre-line">
                {h.story.headline}
              </h2>
              <div className="flex flex-col gap-3 text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.9] max-w-md mb-10">
                {h.story.body.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center text-[11px] md:text-xs font-medium tracking-[0.25em] uppercase text-[var(--color-text-primary)] border-b border-[var(--color-border-dark)] hover:border-transparent pb-1 transition-colors"
              >
                {h.story.cta}
              </Link>
            </ScrollReveal>
          </div>
          <ScrollReveal className="relative aspect-[4/5] md:aspect-auto order-1 md:order-2">
            <Image
              src="/images/lifestyle.jpg"
              alt="Hand chain worn with a cream blazer"
              fill
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 6. Why Hand Chains ── */}
      <section className="bg-[var(--color-bg-secondary)]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[88vh]">
          <div className="flex flex-col justify-center px-6 md:px-20 py-20 md:py-32 order-2 md:order-1">
            <ScrollReveal>
              <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[var(--color-text-tertiary)] mb-8">
                {h.why.title}
              </p>
              <div className="flex flex-col gap-4 text-base md:text-lg text-[var(--color-text-primary)] leading-[1.7] max-w-md font-light">
                {h.why.body.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal className="relative aspect-[4/5] md:aspect-auto order-1 md:order-2">
            <Image
              src="/images/naslovna.webp"
              alt="Gold hand chain resting on soft white fabric"
              fill
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 7. Closing ── */}
      <section className="relative h-[80vh] min-h-[480px] overflow-hidden">
        <Image
          src="/images/editorial.jpg"
          alt="Hand chain resting against skin"
          fill
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <ScrollReveal className="scroll-reveal-fade">
            <h2 className="font-heading text-4xl md:text-6xl font-light tracking-wide text-white leading-[1.1]">
              {h.closing.headline}
            </h2>
            <p className="text-white/80 text-sm md:text-base mt-4 tracking-wide">
              {h.closing.sub}
            </p>
            <Link
              href={SHOP_HREF}
              className="inline-flex items-center mt-9 md:mt-11 text-[11px] md:text-xs font-medium tracking-[0.25em] uppercase text-white border border-white/50 hover:bg-white hover:text-[var(--color-text-primary)] transition-colors px-8 py-3.5"
            >
              {h.closing.cta}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
