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
          className="w-32 border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-5 py-2.5 text-center text-base font-light text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-dark)]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="ml-auto border border-[var(--color-border-dark)] bg-[var(--color-accent-dark)] px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
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
