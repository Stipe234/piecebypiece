"use client";

import { useActionState } from "react";
import { saveProductOverride, type OwnerActionState } from "@/app/owner/actions";
import ToggleButton from "@/components/owner/ToggleButton";

const initialState: OwnerActionState = {};

interface Props {
  productId: string;
  priceEuros: number;
  isActive: boolean;
}

export default function ProductOverrideForm({ productId, priceEuros, isActive }: Props) {
  const [state, action, pending] = useActionState(saveProductOverride, initialState);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="productId" value={productId} />

      <label className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">Price</span>
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-5 text-base text-[var(--color-text-tertiary)]">€</span>
          <input
            name="priceEuros"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            defaultValue={priceEuros.toFixed(2)}
            className="font-numeric w-36 rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-5 text-center text-base font-medium text-[var(--color-text-primary)] shadow-[inset_0_1px_2px_rgba(26,26,26,0.06)] outline-none transition focus:border-[var(--color-border-dark)]"
          />
        </div>
      </label>

      <div className="pb-1">
        <ToggleButton name="isActive" defaultChecked={isActive} label="On storefront" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="ml-auto rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-accent-dark)] px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-inverse)] shadow-[0_8px_18px_-10px_rgba(0,0,0,0.5)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save product"}
      </button>

      {state.error ? (
        <p className="basis-full text-xs text-[var(--color-error)]">{state.error}</p>
      ) : state.success ? (
        <p className="basis-full text-xs text-[var(--color-success)]">Product updated.</p>
      ) : null}
    </form>
  );
}
