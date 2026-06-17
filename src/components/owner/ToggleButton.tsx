"use client";

import { useState } from "react";

interface Props {
  name: string;
  defaultChecked: boolean;
  label: string;
}

export default function ToggleButton({ name, defaultChecked, label }: Props) {
  const [on, setOn] = useState(defaultChecked);

  return (
    <label className="flex cursor-pointer items-center gap-3 select-none">
      <input type="hidden" name={name} value={on ? "on" : "off"} />
      <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">{label}</span>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          on ? "bg-[var(--color-accent-dark)]" : "bg-[var(--color-surface-stone)]"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            on ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}
