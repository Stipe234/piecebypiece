"use client";

import { useActionState } from "react";
import { saveInventoryTotal, type OwnerActionState } from "@/app/owner/actions";

const initialState: OwnerActionState = {};

interface Props {
  productId: string;
  defaultValue: number;
}

export default function InventoryEditForm({ productId, defaultValue }: Props) {
  const [state, action, pending] = useActionState(saveInventoryTotal, initialState);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="productId" value={productId} />
      <label className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">Total units</span>
        <input
          name="totalUnits"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          defaultValue={defaultValue}
          className="font-numeric w-32 rounded-lg border border-[var(--color-border)] bg-white px-5 py-2.5 text-center text-base font-medium text-[var(--color-text-primary)] shadow-[inset_0_1px_2px_rgba(58,44,32,0.06)] outline-none transition focus:border-[var(--color-border-dark)]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="ml-auto rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-accent-dark)] px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-inverse)] shadow-[0_8px_18px_-10px_rgba(0,0,0,0.5)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save stock"}
      </button>
      {state.error ? (
        <p className="basis-full text-xs text-[var(--color-error)]">{state.error}</p>
      ) : state.success ? (
        <p className="basis-full text-xs text-[var(--color-success)]">Stock updated.</p>
      ) : null}
    </form>
  );
}
