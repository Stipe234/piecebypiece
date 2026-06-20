"use client";

import { useActionState } from "react";
import { saveVariantStock, type OwnerActionState } from "@/app/owner/actions";

const initialState: OwnerActionState = {};

interface Props {
  productId: string;
  material: string;
  style: string;
  label: string;
  available: number;
  total: number;
  defaultValue: number;
}

export default function VariantStockForm({
  productId,
  material,
  style,
  label,
  available,
  total,
  defaultValue,
}: Props) {
  const [state, action, pending] = useActionState(saveVariantStock, initialState);

  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="material" value={material} />
      <input type="hidden" name="style" value={style} />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
        <p className="font-numeric text-[11px] text-[var(--color-text-tertiary)]">
          {available} / {total} available
        </p>
      </div>

      <input
        name="totalUnits"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        defaultValue={defaultValue}
        aria-label={`${label} total units`}
        className="font-numeric w-20 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-center text-base font-medium text-[var(--color-text-primary)] shadow-[inset_0_1px_2px_rgba(26,26,26,0.06)] outline-none transition focus:border-[var(--color-border-dark)]"
      />

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
