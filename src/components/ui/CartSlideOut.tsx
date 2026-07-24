"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useCart } from "@/context/CartContext";
import { getProductContent, getVariantPrice } from "@/data/products";
import { formatEur } from "@/lib/format";
import { useI18n } from "@/i18n/context";
import Button from "./Button";

/** Bordered − / n / + control. A real control instead of three loose glyphs. */
function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const buttonClass =
    "flex h-7 w-7 items-center justify-center text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:hover:text-[var(--color-text-tertiary)]";

  return (
    <div className="inline-flex items-center rounded-sm border border-[var(--color-border)]">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className={buttonClass}
      >
        &minus;
      </button>
      <span className="flex h-7 w-7 items-center justify-center border-x border-[var(--color-border)] text-xs tabular-nums">
        {quantity}
      </span>
      <button type="button" onClick={onIncrease} aria-label="Increase quantity" className={buttonClass}>
        +
      </button>
    </div>
  );
}

export default function CartSlideOut() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const { t, locale } = useI18n();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeCart}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-bg-primary)] z-50 transform transition-transform duration-300 shadow-lg flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-6">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg font-light tracking-[0.1em] uppercase">{t.cart.title}</span>
            {itemCount > 0 && (
              <span className="text-xs tabular-nums text-[var(--color-text-tertiary)]">({itemCount})</span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-[var(--color-text-primary)] transition-opacity hover:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-[var(--color-text-tertiary)] mb-6">{t.cart.empty}</p>
              <Button variant="secondary" onClick={closeCart}>{t.cart.continueShopping}</Button>
            </div>
          ) : (
            /* Hairline-divided list: the rows read as one column rather than
               floating cards. Each row's text fills the thumbnail's height, so
               there's no dead space beside the image. */
            <div className="flex flex-col divide-y divide-[var(--color-border)]">
              {items.map((item) => {
                const content = getProductContent(item.product, locale);

                return (
                  <div key={item.id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                    <div className="relative h-[90px] w-[72px] flex-shrink-0 bg-[var(--color-bg-secondary)]">
                      <Image
                        src={item.product.images.studio}
                        alt={content.name}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm">{content.name}</p>
                          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                            {item.selectedMaterial} · {item.selectedLength}
                          </p>
                        </div>
                        <span className="whitespace-nowrap text-sm tabular-nums">
                          {formatEur(getVariantPrice(item.product, item.selectedStyle) * item.quantity)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <QuantityStepper
                          quantity={item.quantity}
                          onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                          onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
                        >
                          {t.cart.remove}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex flex-col gap-5 border-t border-[var(--color-border)] p-6">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-text-tertiary)]">
                {t.cart.subtotal}
              </span>
              <span className="text-base tabular-nums">{formatEur(subtotal)}</span>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-[var(--color-text-tertiary)]">{t.cart.shippingNote}</p>
              <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" aria-hidden="true" />
                {t.product.handmade}
              </p>
            </div>

            <Link
              href="/checkout"
              className="block"
              onClick={() => {
                track("begin_checkout", {
                  items: items.reduce((n, i) => n + i.quantity, 0),
                  subtotal,
                });
                closeCart();
              }}
            >
              <Button fullWidth>{t.cart.checkout}</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
