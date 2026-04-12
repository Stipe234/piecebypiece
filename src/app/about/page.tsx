"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/context";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <>
      <section className="relative h-[50vh] md:h-[60vh] min-h-[350px] md:min-h-[500px] overflow-hidden">
        <Image src="/images/lifestyle.jpg" alt="Piece by Piece" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-black/20" />
      </section>

      <section className="py-20 md:py-40 px-6">
        <ScrollReveal>
          <div className="max-w-[640px] mx-auto text-center">
            <hr className="hr-accent mx-auto mb-8 md:mb-10" />
            <h1 className="pull-quote text-2xl md:text-4xl leading-[1.4] text-[var(--color-text-primary)]">
              {t.about.opening}
            </h1>
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-[var(--color-bg-secondary)] md:min-h-[80vh]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2">
          <ScrollReveal className="relative aspect-[3/4] md:aspect-auto">
            <Image src="/images/intimate.jpg" alt="Hand chain on skin" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </ScrollReveal>
          <div className="flex flex-col justify-center px-6 md:px-20 py-16 md:py-32">
            <ScrollReveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-8">
                {t.about.beliefLabel}
              </p>
              <div className="flex flex-col gap-6 text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.8] max-w-md">
                <p>{t.about.beliefP1}</p>
                <p>{t.about.beliefP2}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-40 px-6">
        <div className="max-w-[960px] mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {t.about.values.map((value) => (
                <div key={value.title}>
                  <hr className="hr-accent mb-6" />
                  <h3 className="font-heading text-xl font-light tracking-wide mb-4">{value.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-[1.8]">{value.text}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section>
        <ScrollReveal>
          <div className="relative aspect-[4/3] md:aspect-[21/9] overflow-hidden">
            <Image src="/images/detail.jpg" alt="Hand chain close-up" fill className="object-cover" sizes="100vw" />
          </div>
        </ScrollReveal>
      </section>

      <section className="py-20 md:py-40 px-6">
        <ScrollReveal>
          <div className="max-w-[640px] mx-auto text-center">
            <blockquote className="pull-quote text-2xl md:text-3xl text-[var(--color-text-primary)] leading-[1.4] mb-8 whitespace-pre-line">
              {t.about.closing}
            </blockquote>
            <hr className="hr-accent mx-auto" />
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
