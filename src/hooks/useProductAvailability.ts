"use client";

import { useEffect, useState } from "react";
import type { ProductAvailability } from "@/lib/inventory";

interface AvailabilityState {
  availability: ProductAvailability | null;
  loading: boolean;
  error: string | null;
}

export function useProductAvailability(productId: string) {
  const [state, setState] = useState<AvailabilityState>({
    availability: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      try {
        const res = await fetch(`/api/products/availability?productId=${encodeURIComponent(productId)}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Unable to load availability");
        }

        if (!cancelled) {
          setState({
            availability: data.availability?.[productId] ?? null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            availability: null,
            loading: false,
            error: error instanceof Error ? error.message : "Unable to load availability",
          });
        }
      }
    }

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return state;
}
