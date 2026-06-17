"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useEffect, useRef } from "react";

export default function CheckoutSuccessPage() {
  const { items, clearCart } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    if (!cleared.current && items.length > 0) {
      cleared.current = true;
      clearCart();
    }
  }, [clearCart, items.length]);

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
          Thank you for your order
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">
          Your order has been confirmed. We&apos;ve sent you a confirmation email.
        </p>
        <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed mb-8">
          Delivered in 3–5 business days.
        </p>

        <Link
          href="/"
          className="text-sm text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-text-primary)] transition-colors"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
