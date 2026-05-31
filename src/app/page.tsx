"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/context";

export default function Home() {
  const { t } = useI18n();

  return (
    <section className="relative h-[100svh] min-h-[550px] md:min-h-[700px] overflow-hidden">
      <div className="hero-image-enter absolute inset-0">
        <div className="hero-drift absolute inset-0">
          <Image
            src="/images/intimate.jpg"
            alt="Close-up of a hand wearing a delicate gold chain"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="hero-text-enter font-heading text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-wide leading-[1.05]">
          {t.hero.slogan}
        </h1>
        <Link
          href="/collections/hand-chains"
          className="hero-text-enter-delayed mt-10 md:mt-12 inline-flex items-center text-[11px] md:text-xs font-medium tracking-[0.3em] uppercase text-white border-b border-white/40 hover:border-white pb-1 transition-colors"
        >
          {t.hero.shopAll}
        </Link>
      </div>
    </section>
  );
}
