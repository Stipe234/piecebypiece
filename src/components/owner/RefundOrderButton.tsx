"use client";

import { useActionState, useState } from "react";
import { refundOrder, type OwnerActionState } from "@/app/owner/actions";

const initialState: OwnerActionState = {};

interface Props {
  orderId: string;
  alreadyRefunded: boolean;
  amountLabel: string;
}

export default function RefundOrderButton({ orderId, alreadyRefunded, amountLabel }: Props) {
  const [state, action, pending] = useActionState(refundOrder, initialState);
  const [confirming, setConfirming] = useState(false);

  if (alreadyRefunded) {
    return (
      <span className="inline-flex items-center bg-[var(--color-bg-tertiary)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--color-error)]">
        Refunded
      </span>
    );
  }

  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="orderId" value={orderId} />
      {confirming ? (
        <>
          <span className="text-xs text-[var(--color-text-secondary)]">Refund {amountLabel}?</span>
          <button
            type="submit"
            disabled={pending}
            className="border border-[var(--color-error)] bg-[var(--color-error)] px-5 py-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-inverse)] transition-colors hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Refunding..." : "Confirm refund"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={pending}
            className="border border-[var(--color-border)] px-5 py-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-dark)]"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="border border-[var(--color-border)] px-5 py-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-dark)] hover:text-[var(--color-text-primary)]"
        >
          Refund order
        </button>
      )}
      {state.error ? (
        <p className="basis-full text-xs text-[var(--color-error)]">{state.error}</p>
      ) : null}
    </form>
  );
}
