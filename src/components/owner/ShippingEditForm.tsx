"use client";

import { useActionState } from "react";
import { saveShippingStatus, type OwnerActionState } from "@/app/owner/actions";
import type { ShippingStatus } from "@/lib/inventory";

const initialState: OwnerActionState = {};

interface Props {
  orderId: string;
  currentStatus: ShippingStatus;
  currentTracking: string | null;
}

export default function ShippingEditForm({ orderId, currentStatus, currentTracking }: Props) {
  const [state, action, pending] = useActionState(saveShippingStatus, initialState);

  return (
    <form action={action} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
      <input type="hidden" name="orderId" value={orderId} />
      <label className="text-sm">
        <span className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">Shipping status</span>
        <select
          name="shippingStatus"
          defaultValue={currentStatus}
          className="w-full border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-dark)]"
        >
          <option value="pending">pending</option>
          <option value="packed">packed</option>
          <option value="shipped">shipped</option>
          <option value="delivered">delivered</option>
        </select>
      </label>

      <label className="text-sm">
        <span className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">Tracking</span>
        <input
          name="trackingNumber"
          defaultValue={currentTracking ?? ""}
          placeholder="Optional tracking code"
          className="w-full border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition focus:border-[var(--color-border-dark)]"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="self-end border border-[var(--color-border-dark)] bg-[var(--color-accent-dark)] px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Update"}
      </button>
      {state.error ? (
        <p className="md:col-span-3 text-xs text-[var(--color-error)]">{state.error}</p>
      ) : state.success ? (
        <p className="md:col-span-3 text-xs text-[var(--color-success)]">Shipping updated.</p>
      ) : null}
    </form>
  );
}
