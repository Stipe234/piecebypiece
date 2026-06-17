"use client";

import { useI18n } from "@/i18n/context";

export default function ReturnsPage() {
  const { t } = useI18n();
  const body =
    "If something isn't right, unworn pieces may be returned within 14 days of delivery. Reach out and we'll guide you through it.";

  return (
    <section className="py-28 md:py-44 px-6">
      <div className="max-w-[560px] mx-auto text-center">
        <h1 className="font-heading text-3xl md:text-5xl font-light tracking-wide mb-8">
          {t.nav.returns}
        </h1>
        <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.9]">
          {body}
        </p>
      </div>
    </section>
  );
}
