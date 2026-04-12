"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/i18n/context";
import Button from "@/components/ui/Button";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { t, locale } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <section className="py-32 px-6 text-center">
        <p className="text-sm text-[var(--color-text-tertiary)] mb-6">{t.cart.empty}</p>
        <Link
          href="/collections/hand-chains"
          className="text-sm text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-text-primary)] transition-colors"
        >
          {t.cart.continueShopping}
        </Link>
      </section>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            material: item.selectedMaterial,
            length: item.selectedLength,
            image: item.product.images.studio,
          })),
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <section className="py-8 md:py-20 px-4 md:px-12">
      <div className="max-w-[580px] mx-auto">
        <h1 className="font-heading text-2xl md:text-3xl font-light tracking-wide mb-8 md:mb-12 text-center">
          {t.checkout.title}
        </h1>

        <div className="bg-[var(--color-bg-secondary)] p-5 md:p-8">
          <h2 className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-4 md:mb-6">
            {t.checkout.orderSummary}
          </h2>

          <div className="flex flex-col gap-4 mb-4 md:mb-6">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3 md:gap-4">
                <div className="relative w-14 h-18 md:w-16 md:h-20 flex-shrink-0 bg-[var(--color-bg-primary)]">
                  <Image
                    src={item.product.images.studio}
                    alt={t.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.product.name}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                    {item.selectedMaterial} / {item.selectedLength}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                    {t.cart.quantity}: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium flex-shrink-0">€{item.product.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--color-border)] pt-3 md:pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">{t.cart.subtotal}</span>
              <span>€{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">{t.product.shippingLabel}</span>
              <span className="text-[var(--color-text-tertiary)]">{t.checkout.shippingFree}</span>
            </div>
            <div className="flex justify-between text-sm font-medium pt-2 border-t border-[var(--color-border)]">
              <span>{t.checkout.total}</span>
              <span>€{subtotal}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8">
          {error && (
            <p className="text-sm text-red-600 text-center mb-4">{error}</p>
          )}

          <Button onClick={handleCheckout} fullWidth disabled={loading}>
            {loading
              ? (locale === "hr" ? "Preusmjeravanje..." : "Redirecting...")
              : t.checkout.placeOrder}
          </Button>
          <p className="text-xs text-[var(--color-text-tertiary)] text-center mt-3">
            {t.checkout.paymentNote}
          </p>
        </div>
      </div>
    </section>
  );
}
