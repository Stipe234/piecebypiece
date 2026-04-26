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
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#a06b5a]">Total units</span>
        <input
          name="totalUnits"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          defaultValue={defaultValue}
          className="w-32 rounded-full border border-[#eed5cf] bg-white px-5 py-2.5 text-center text-base font-medium text-[#3a222a] outline-none transition focus:border-[#c48a78] focus:ring-2 focus:ring-[#f0d4c4]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="ml-auto rounded-full bg-[#3a222a] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#4a2e35] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save stock"}
      </button>
      {state.error ? (
        <p className="basis-full text-xs text-[#b03a2e]">{state.error}</p>
      ) : state.success ? (
        <p className="basis-full text-xs text-[#4a7c59]">Stock updated.</p>
      ) : null}
    </form>
  );
}
