"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/context";

export default function CheckoutCancelPage() {
  const { locale } = useI18n();
  const isHr = locale === "hr";

  return (
    <section className="py-32 px-6 text-center">
      <div className="max-w-md mx-auto">
        <hr className="hr-accent mx-auto mb-10" />

        <h1 className="font-heading text-2xl md:text-3xl font-light tracking-wide mb-4">
          {isHr ? "Narudžba otkazana" : "Order cancelled"}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-8">
          {isHr
            ? "Tvoja narudžba nije dovršena. Ništa ti nije naplaćeno."
            : "Your order was not completed. You have not been charged."}
        </p>

        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/checkout"
            className="text-sm text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-text-primary)] transition-colors"
          >
            {isHr ? "Pokušaj ponovo" : "Try again"}
          </Link>
          <Link
            href="/collections/hand-chains"
            className="text-sm text-[var(--color-text-tertiary)] underline underline-offset-4 hover:text-[var(--color-text-primary)] transition-colors"
          >
            {isHr ? "Nastavi kupovinu" : "Continue shopping"}
          </Link>
        </div>
      </div>
    </section>
  );
}
