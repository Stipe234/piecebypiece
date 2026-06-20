"use client";

import { useEffect, useState } from "react";

/**
 * Fetches the live, override-aware price (in cents) for a product from the
 * availability API. Returns null until loaded — callers fall back to the
 * catalog price so the page still renders instantly.
 */
export function usePriceCents(productId: string): number | null {
  const [cents, setCents] = useState<number | null>(null);

  useEffect(() => {
    if (!productId) return;
    let active = true;
    fetch(`/api/products/availability?productId=${encodeURIComponent(productId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const entry = data?.availability?.[productId];
        if (entry && typeof entry.priceCents === "number") {
          setCents(entry.priceCents);
        }
      })
      .catch(() => {
        /* keep the catalog-price fallback */
      });
    return () => {
      active = false;
    };
  }, [productId]);

  return cents;
}
