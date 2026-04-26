"use client";

import { useActionState } from "react";
import { saveProductOverride, type OwnerActionState } from "@/app/owner/actions";
import ToggleButton from "@/components/owner/ToggleButton";

const initialState: OwnerActionState = {};

interface Props {
  productId: string;
  priceEuros: number;
  isActive: boolean;
}

export default function ProductOverrideForm({ productId, priceEuros, isActive }: Props) {
  const [state, action, pending] = useActionState(saveProductOverride, initialState);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="productId" value={productId} />

      <label className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#a06b5a]">Price</span>
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-5 text-base text-[#a06b5a]">€</span>
          <input
            name="priceEuros"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            defaultValue={priceEuros.toFixed(2)}
            className="w-36 rounded-full border border-[#eed5cf] bg-white py-2.5 pl-10 pr-5 text-center text-base font-medium text-[#3a222a] outline-none transition focus:border-[#c48a78] focus:ring-2 focus:ring-[#f0d4c4]"
          />
        </div>
      </label>

      <div className="pb-1">
        <ToggleButton name="isActive" defaultChecked={isActive} label="On storefront" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="ml-auto rounded-full bg-[#3a222a] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#4a2e35] disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save product"}
      </button>

      {state.error ? (
        <p className="basis-full text-xs text-[#b03a2e]">{state.error}</p>
      ) : state.success ? (
        <p className="basis-full text-xs text-[#4a7c59]">Product updated.</p>
      ) : null}
    </form>
  );
}
