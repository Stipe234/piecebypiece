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
      <span className="inline-flex items-center rounded-full bg-[#f0dfe0] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[#8a4a52]">
        Refunded
      </span>
    );
  }

  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="orderId" value={orderId} />
      {confirming ? (
        <>
          <span className="text-xs text-[#6b4852]">Refund {amountLabel}?</span>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[#8a4a52] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-[#6f3a41] disabled:opacity-60"
          >
            {pending ? "Refunding..." : "Confirm refund"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={pending}
            className="rounded-full border border-[#c48a78]/40 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#7a4a53]"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-full border border-[#c48a78]/50 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#7a4a53] transition hover:border-[#8a4a52] hover:text-[#3a222a]"
        >
          Refund order
        </button>
      )}
      {state.error ? (
        <p className="basis-full text-xs text-[#b03a2e]">{state.error}</p>
      ) : null}
    </form>
  );
}
