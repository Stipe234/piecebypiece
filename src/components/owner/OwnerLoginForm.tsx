"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import { loginOwner, type OwnerLoginState } from "@/app/owner/actions";

const initialState: OwnerLoginState = {};

export default function OwnerLoginForm() {
  const [state, action, pending] = useActionState(loginOwner, initialState);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-[11px] font-medium uppercase tracking-[0.24em] text-white/60"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d8ba84] focus:bg-white/10"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-[11px] font-medium uppercase tracking-[0.24em] text-white/60"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d8ba84] focus:bg-white/10"
        />
      </div>

      {state?.error ? (
        <p className="text-sm text-[#f4b5b5]">{state.error}</p>
      ) : null}

      <Button
        type="submit"
        fullWidth
        disabled={pending}
        className="rounded-2xl bg-[#d8ba84] text-[#171411] hover:bg-[#e5c792]"
      >
        {pending ? "Opening..." : "Open dashboard"}
      </Button>
    </form>
  );
}
