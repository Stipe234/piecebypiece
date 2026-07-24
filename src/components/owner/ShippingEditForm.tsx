"use client";

import { useActionState } from "react";
import { saveShippingStatus, type OwnerActionState } from "@/app/owner/actions";
import type { ShippingStatus } from "@/lib/inventory";

const initialState: OwnerActionState = {};

const labelClass = "text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]";

const STATUSES: { value: ShippingStatus; label: string }[] = [
  { value: "pending", label: "To pack" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

interface Props {
  orderId: string;
  currentStatus: ShippingStatus;
  currentTrackingUrl: string | null;
}

export default function ShippingEditForm({ orderId, currentStatus, currentTrackingUrl }: Props) {
  const [state, action, pending] = useActionState(saveShippingStatus, initialState);

  return (
    // Keyed on the saved values so the inputs re-sync after the server updates.
    <form
      key={`${currentStatus}|${currentTrackingUrl ?? ""}`}
      action={action}
      className="mt-4 flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4"
    >
      <input type="hidden" name="orderId" value={orderId} />

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Status — moving it forward emails the customer</span>
        {/* Each button submits its own status, so a change is one click. */}
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => {
            const isCurrent = status.value === currentStatus;
            return (
              <button
                key={status.value}
                type="submit"
                name="shippingStatus"
                value={status.value}
                disabled={pending}
                aria-pressed={isCurrent}
                className={`rounded-lg px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors disabled:opacity-50 ${
                  isCurrent
                    ? "bg-[var(--color-accent-dark)] text-[var(--color-text-inverse)]"
                    : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-dark)]"
                }`}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`tracking-${orderId}`} className={labelClass}>
          GLS tracking link — optional
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id={`tracking-${orderId}`}
            name="trackingUrl"
            type="url"
            defaultValue={currentTrackingUrl ?? ""}
            placeholder="Paste from the GLS app to include it in the email"
            className="min-w-[220px] flex-1 rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition focus:border-[var(--color-border-dark)]"
          />
          <button
            type="submit"
            name="shippingStatus"
            value={currentStatus}
            disabled={pending}
            className="rounded-lg border border-[var(--color-border-dark)] px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent-dark)] hover:text-[var(--color-text-inverse)] disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save link"}
          </button>
        </div>
      </div>

      {state.error ? (
        <p className="text-xs text-[var(--color-error)]">{state.error}</p>
      ) : state.success ? (
        <p className="text-xs text-[var(--color-success)]">{state.message ?? "Shipping updated."}</p>
      ) : null}
    </form>
  );
}
