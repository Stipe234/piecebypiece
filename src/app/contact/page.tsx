"use client";

import { useI18n } from "@/i18n/context";

const EMAIL = "hello@piecebypiecewear.com";

export default function ContactPage() {
  const { t } = useI18n();
  const body = "We'd love to hear from you. Write to us anytime and we'll reply personally.";

  return (
    <section className="py-28 md:py-44 px-6">
      <div className="max-w-[560px] mx-auto text-center">
        <h1 className="font-heading text-3xl md:text-5xl font-light tracking-wide mb-8">
          {t.nav.contact}
        </h1>
        <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.9] mb-8">
          {body}
        </p>
        <div className="flex flex-col items-center gap-3">
          <a href={`mailto:${EMAIL}`} className="text-sm tracking-[0.05em] border-b border-[var(--color-border-dark)] hover:border-transparent pb-0.5 transition-colors">
            {EMAIL}
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
            {t.nav.instagram}
          </a>
        </div>
      </div>
    </section>
  );
}
