"use client";

import { useEffect, useState } from "react";

export interface VariantAvail {
  variantKey: string;
  material: string;
  style: string;
  priceCents: number | null;
  availableUnits: number;
  isSoldOut: boolean;
}

export interface ProductAvail {
  priceCents: number | null;
  isActive: boolean;
  variants: VariantAvail[];
}

/**
 * Fetches live, override-aware availability + per-variant pricing for a product.
 * Returns null until loaded — callers fall back to the catalog price so the
 * page renders instantly.
 */
export function useProductAvailability(productId: string): ProductAvail | null {
  const [availability, setAvailability] = useState<ProductAvail | null>(null);

  useEffect(() => {
    if (!productId) return;
    let active = true;
    fetch(`/api/products/availability?productId=${encodeURIComponent(productId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const entry = data?.availability?.[productId];
        if (entry) setAvailability(entry as ProductAvail);
      })
      .catch(() => {
        /* keep the catalog fallback */
      });
    return () => {
      active = false;
    };
  }, [productId]);

  return availability;
}
