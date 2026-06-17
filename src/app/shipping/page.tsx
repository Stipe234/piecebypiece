"use client";

import { useI18n } from "@/i18n/context";

export default function ShippingPage() {
  const { t } = useI18n();
  const body =
    "Complimentary shipping on all orders, delivered within 3–5 business days. You'll receive tracking by email once your piece is on its way.";

  return (
    <section className="py-28 md:py-44 px-6">
      <div className="max-w-[560px] mx-auto text-center">
        <h1 className="font-heading text-3xl md:text-5xl font-light tracking-wide mb-8">
          {t.nav.shipping}
        </h1>
        <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.9]">
          {body}
        </p>
      </div>
    </section>
  );
}
