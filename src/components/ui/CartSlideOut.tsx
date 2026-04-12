"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/i18n/context";
import Button from "./Button";

export default function CartSlideOut() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();
  const { t } = useI18n();

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
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <span className="font-heading text-lg font-light tracking-[0.1em] uppercase">{t.cart.title}</span>
          <button onClick={closeCart} aria-label="Close cart" className="text-[var(--color-text-primary)]">
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
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative w-20 h-24 flex-shrink-0 bg-[var(--color-bg-secondary)]">
                    <Image
                      src={item.product.images.studio}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium">{t.product.name}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                        {item.selectedMaterial} / {item.selectedLength}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                        >
                          &minus;
                        </button>
                        <span className="text-xs w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">€{item.product.price * item.quantity}</span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] underline"
                        >
                          {t.cart.remove}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{t.cart.subtotal}</span>
              <span className="text-sm font-medium">€{subtotal}</span>
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)] mb-4">{t.cart.shippingNote}</p>
            <Link href="/checkout" onClick={closeCart}>
              <Button fullWidth>{t.cart.checkout}</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
