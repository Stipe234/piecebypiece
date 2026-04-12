"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/i18n/context";
import { useEffect, useRef } from "react";

export default function CheckoutSuccessPage() {
  const { t, locale } = useI18n();
  const cart = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    if (!cleared.current && cart.items.length > 0) {
      cleared.current = true;
      cart.items.forEach((item) => cart.removeItem(item.product.id));
    }
  }, [cart]);

  const isHr = locale === "hr";

  return (
    <section className="py-32 px-6 text-center">
      <div className="max-w-md mx-auto">
        <hr className="hr-accent mx-auto mb-10" />

        <div className="mb-8">
          <svg
            className="w-12 h-12 mx-auto mb-6 text-[var(--color-text-primary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-light tracking-wide mb-4">
          {isHr ? "Hvala na narudžbi" : "Thank you for your order"}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">
          {isHr
            ? "Tvoja narudžba je potvrđena. Poslali smo ti email s potvrdom."
            : "Your order has been confirmed. We've sent you a confirmation email."}
        </p>
        <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed mb-8">
          {isHr
            ? "Svaki komad dolazi u brendiranoj lanenoj vrećici, isporučen u 3–5 radnih dana."
            : "Each piece arrives in a branded linen pouch, delivered in 3–5 business days."}
        </p>

        <Link
          href="/"
          className="text-sm text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-text-primary)] transition-colors"
        >
          {isHr ? "Natrag na početnu" : "Back to home"}
        </Link>
      </div>
    </section>
  );
}
