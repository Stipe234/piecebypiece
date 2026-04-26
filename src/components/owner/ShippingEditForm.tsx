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
        <span className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#a06b5a]">Shipping status</span>
        <select
          name="shippingStatus"
          defaultValue={currentStatus}
          className="w-full rounded-full border border-[#efd9cf] bg-white px-4 py-2.5 text-sm text-[#3a222a] outline-none transition focus:border-[#c48a78]"
        >
          <option value="pending">pending</option>
          <option value="packed">packed</option>
          <option value="shipped">shipped</option>
          <option value="delivered">delivered</option>
        </select>
      </label>

      <label className="text-sm">
        <span className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#a06b5a]">Tracking</span>
        <input
          name="trackingNumber"
          defaultValue={currentTracking ?? ""}
          placeholder="Optional tracking code"
          className="w-full rounded-full border border-[#efd9cf] bg-white px-4 py-2.5 text-sm text-[#3a222a] outline-none transition focus:border-[#c48a78]"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="self-end rounded-full bg-[#3a222a] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#4a2e35] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Update"}
      </button>
      {state.error ? (
        <p className="md:col-span-3 text-xs text-[#b03a2e]">{state.error}</p>
      ) : state.success ? (
        <p className="md:col-span-3 text-xs text-[#4a7c59]">Shipping updated.</p>
      ) : null}
    </form>
  );
}
