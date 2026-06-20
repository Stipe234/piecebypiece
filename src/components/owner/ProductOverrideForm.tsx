"use client";

import { useActionState } from "react";
import { saveProductOverride, type OwnerActionState } from "@/app/owner/actions";
import ToggleButton from "@/components/owner/ToggleButton";

const initialState: OwnerActionState = {};

interface Props {
  productId: string;
  isActive: boolean;
}

export default function ProductOverrideForm({ productId, isActive }: Props) {
  const [state, action, pending] = useActionState(saveProductOverride, initialState);

  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="productId" value={productId} />

      <ToggleButton name="isActive" defaultChecked={isActive} label="On storefront" />

      <button
        type="submit"
        disabled={pending}
        className="ml-auto rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-accent-dark)] px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-inverse)] shadow-[0_8px_18px_-10px_rgba(0,0,0,0.5)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save"}
      </button>

      {state.error ? (
        <p className="basis-full text-xs text-[var(--color-error)]">{state.error}</p>
      ) : state.success ? (
        <p className="basis-full text-xs text-[var(--color-success)]">Updated.</p>
      ) : null}
    </form>
  );
}
