"use client";

import { useI18n } from "@/i18n/context";

export default function ReturnsPage() {
  const { t, locale } = useI18n();
  const body =
    locale === "hr"
      ? "Ako nešto nije u redu, nenošene komade možeš vratiti unutar 14 dana od isporuke. Javi nam se i provest ćemo te kroz postupak."
      : "If something isn't right, unworn pieces may be returned within 14 days of delivery. Reach out and we'll guide you through it.";

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
