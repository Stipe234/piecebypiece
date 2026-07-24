"use client";

import { useCallback, useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getProductContent, getVariantPrice } from "@/data/products";
import { formatEur } from "@/lib/format";
import { GLS_DELIVERY_CENTS, type DeliveryMethod } from "@/lib/shipping";
import { useI18n } from "@/i18n/context";
import Button from "@/components/ui/Button";
import ReservationBanner from "@/components/checkout/ReservationBanner";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { t, locale } = useI18n();
  const [reservation, setReservation] = useState<{ url: string; expiresAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState("");
  // GLS home delivery is the only method we offer — there is nothing to choose,
  // so it's fixed here and shown as an information box rather than a selector.
  const deliveryMethod: DeliveryMethod = "delivery";

  const deliveryFeeCents = GLS_DELIVERY_CENTS;
  const total = subtotal + deliveryFeeCents / 100;
  const deliveryFeeLabel =
    deliveryFeeCents === 0 ? t.checkout.shippingFree : formatEur(deliveryFeeCents / 100);

  // Stable signature of the cart so we only re-reserve when it actually changes.
  const itemsKey = items.map((i) => `${i.id}x${i.quantity}`).join(",");

  const reserve = useCallback(async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    setExpired(false);
    setReservation(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            material: item.selectedMaterial,
            style: item.selectedStyle,
            length: item.selectedLength,
          })),
          deliveryMethod,
          locale,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || (res.status === 409 ? t.checkout.stockConflict : "Something went wrong"),
        );
      }
      setReservation({ url: data.url, expiresAt: data.expiresAt });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [items, locale, deliveryMethod, t.checkout.stockConflict]);

  // Reserve the stock (5-min hold) as soon as the shopper reaches checkout, and
  // re-reserve if they switch delivery method (it changes the Stripe session).
  useEffect(() => {
    reserve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey, deliveryMethod]);

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

  return (
    <section className="py-8 md:py-20 px-4 md:px-12">
      <div className="max-w-[580px] mx-auto">
        <div className="mb-8 text-center md:mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">
            {t.checkout.eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-light tracking-wide md:text-4xl">
            {t.checkout.title}
          </h1>
          <span className="mx-auto mt-5 block h-px w-10 bg-[var(--color-gold)]" aria-hidden="true" />
        </div>

        {reservation && !expired && (
          <div className="mb-6">
            <ReservationBanner expiresAt={reservation.expiresAt} onExpire={() => setExpired(true)} />
          </div>
        )}

        {/* One panel, hairline-separated: delivery, items, totals and the
            handmade note read as a single document rather than three unrelated
            blocks with different edges. */}
        <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="px-5 py-5 md:px-8 md:py-6">
            <h2 className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-tertiary)] md:mb-5">
              {t.checkout.orderSummary}
            </h2>

            <div className="flex flex-col divide-y divide-[var(--color-border)]">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative h-[70px] w-14 flex-shrink-0 bg-[var(--color-bg-primary)]">
                    <Image
                      src={item.product.images.studio}
                      alt={getProductContent(item.product, locale).name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{getProductContent(item.product, locale).name}</p>
                    <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                      {item.selectedMaterial} · {item.selectedStyle}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                      {t.cart.quantity} {item.quantity}
                    </p>
                  </div>
                  <p className="flex-shrink-0 text-sm tabular-nums">
                    {formatEur(getVariantPrice(item.product, item.selectedStyle) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 border-t border-[var(--color-border)] px-5 py-4 md:px-8 md:py-5">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-[var(--color-text-secondary)]">{t.cart.subtotal}</span>
              <span className="tabular-nums">{formatEur(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-[var(--color-text-secondary)]">
                {t.checkout.deliveryOption}
                <span className="mt-0.5 block text-xs text-[var(--color-text-tertiary)]">
                  {t.checkout.deliveryEstimate}
                </span>
              </span>
              <span className="text-[var(--color-text-tertiary)]">{deliveryFeeLabel}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-[var(--color-border)] pt-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">
                {t.checkout.total}
              </span>
              <span className="font-heading text-2xl font-light tabular-nums">{formatEur(total)}</span>
            </div>
          </div>

          {/* Closing reassurance — the quiet promises that come with the piece. */}
          <div className="flex flex-col gap-2 border-t border-[var(--color-border)] px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)] md:px-8">
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" aria-hidden="true" />
              {t.product.handmade}
            </span>
            <span className="flex items-center gap-2">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="ml-[-1px] text-[var(--color-text-tertiary)]"
                aria-hidden="true"
              >
                <rect x="4" y="11" width="16" height="10" rx="1.5" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              {t.checkout.securePayment}
            </span>
          </div>
        </div>

        <div className="mt-6 md:mt-8">
          {error && <p className="mb-4 text-center text-sm text-[var(--color-error)]">{error}</p>}

          {expired ? (
            <Button onClick={reserve} fullWidth>
              Refresh hold
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (reservation) {
                  track("proceed_to_payment", {
                    items: items.reduce((n, i) => n + i.quantity, 0),
                  });
                  window.location.href = reservation.url;
                }
              }}
              fullWidth
              disabled={loading || !reservation}
            >
              {loading ? "Reserving..." : t.checkout.placeOrder}
            </Button>
          )}
          <p className="text-xs text-[var(--color-text-tertiary)] text-center mt-3">
            {t.checkout.paymentNote}
          </p>
        </div>
      </div>
    </section>
  );
}
