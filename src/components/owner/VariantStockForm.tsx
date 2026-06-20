"use client";

import { useActionState } from "react";
import { saveVariant, type OwnerActionState } from "@/app/owner/actions";

const initialState: OwnerActionState = {};

interface Props {
  productId: string;
  material: string;
  style: string;
  label: string;
  available: number;
  total: number;
  defaultStock: number;
  defaultPriceEuros: number;
}

export default function VariantStockForm({
  productId,
  material,
  style,
  label,
  available,
  total,
  defaultStock,
  defaultPriceEuros,
}: Props) {
  const [state, action, pending] = useActionState(saveVariant, initialState);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="material" value={material} />
      <input type="hidden" name="style" value={style} />

      <div className="min-w-0 flex-1 basis-full sm:basis-auto">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
        <p className="font-numeric text-[11px] text-[var(--color-text-tertiary)]">
          {available} / {total} available
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">Stock</span>
        <input
          name="totalUnits"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          defaultValue={defaultStock}
          aria-label={`${label} stock`}
          className="font-numeric w-20 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-center text-base font-medium text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-dark)]"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">Price</span>
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-3 text-sm text-[var(--color-text-tertiary)]">€</span>
          <input
            name="priceEuros"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            defaultValue={defaultPriceEuros.toFixed(2)}
            aria-label={`${label} price`}
            className="font-numeric w-24 rounded-lg border border-[var(--color-border)] bg-white py-2 pl-7 pr-3 text-center text-base font-medium text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-dark)]"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-accent-dark)] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
      >
        {pending ? "…" : "Save"}
      </button>

      {state.error ? (
        <p className="basis-full text-xs text-[var(--color-error)]">{state.error}</p>
      ) : state.success ? (
        <p className="basis-full text-xs text-[var(--color-success)]">Saved.</p>
      ) : null}
    </form>
  );
}
