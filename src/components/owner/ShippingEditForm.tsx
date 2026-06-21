"use client";

import { useActionState } from "react";
import { saveShippingStatus, type OwnerActionState } from "@/app/owner/actions";
import type { ShippingStatus } from "@/lib/inventory";

const initialState: OwnerActionState = {};

const fieldClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] shadow-[inset_0_1px_2px_rgba(26,26,26,0.06)] outline-none transition focus:border-[var(--color-border-dark)]";

const labelClass = "mb-2 block text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]";

interface Props {
  orderId: string;
  currentStatus: ShippingStatus;
  currentCarrier: string | null;
  currentTrackingUrl: string | null;
}

export default function ShippingEditForm({ orderId, currentStatus, currentCarrier, currentTrackingUrl }: Props) {
  const [state, action, pending] = useActionState(saveShippingStatus, initialState);

  return (
    <form action={action} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1.4fr_auto]">
      <input type="hidden" name="orderId" value={orderId} />

      <label className="text-sm">
        <span className={labelClass}>Status</span>
        <select name="shippingStatus" defaultValue={currentStatus} className={fieldClass}>
          <option value="pending">pending</option>
          <option value="packed">packed</option>
          <option value="shipped">shipped</option>
          <option value="delivered">delivered</option>
        </select>
      </label>

      <label className="text-sm">
        <span className={labelClass}>Carrier</span>
        <input name="carrier" defaultValue={currentCarrier ?? ""} placeholder="e.g. UPS" className={fieldClass} />
      </label>

      <label className="text-sm">
        <span className={labelClass}>Tracking link</span>
        <input
          name="trackingUrl"
          type="url"
          defaultValue={currentTrackingUrl ?? ""}
          placeholder="https://..."
          className={fieldClass}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="self-end rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-accent-dark)] px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-inverse)] shadow-[0_8px_18px_-10px_rgba(0,0,0,0.5)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Update"}
      </button>

      <p className="md:col-span-4 text-[11px] leading-relaxed text-[var(--color-text-tertiary)]">
        Moving to <span className="text-[var(--color-text-secondary)]">packed</span>,{" "}
        <span className="text-[var(--color-text-secondary)]">shipped</span>, or{" "}
        <span className="text-[var(--color-text-secondary)]">delivered</span> emails the customer. Shipped sends the
        tracking link, so add the carrier and link first.
      </p>

      {state.error ? (
        <p className="md:col-span-4 text-xs text-[var(--color-error)]">{state.error}</p>
      ) : state.success ? (
        <p className="md:col-span-4 text-xs text-[var(--color-success)]">{state.message ?? "Shipping updated."}</p>
      ) : null}
    </form>
  );
}
