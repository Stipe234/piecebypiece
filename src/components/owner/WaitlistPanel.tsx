"use client";

import { useState } from "react";
import type { WaitlistSignup } from "@/lib/waitlist";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function WaitlistPanel({ signups }: { signups: WaitlistSignup[] }) {
  const [copied, setCopied] = useState(false);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(signups.map((s) => s.email).join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-heading text-6xl font-light leading-none text-[#3a222a] md:text-7xl">
            {signups.length}
          </span>
          <span className="pb-1 text-[11px] uppercase tracking-[0.26em] text-[#a06b5a]">
            {signups.length === 1 ? "signup" : "signups"}
          </span>
        </div>

        {signups.length > 0 && (
          <button
            onClick={copyAll}
            className="rounded-full bg-white/50 px-5 py-2.5 text-[10px] uppercase tracking-[0.24em] text-[#7a4a53] shadow-[0_10px_30px_-15px_rgba(120,60,70,0.5)] backdrop-blur-sm transition hover:bg-white/80 hover:text-[#3a222a]"
          >
            {copied ? "Copied" : "Copy all"}
          </button>
        )}
      </div>

      {signups.length === 0 ? (
        <p className="mt-8 text-sm text-[#a06b5a]">No signups yet. They&apos;ll appear here the moment someone joins.</p>
      ) : (
        <div className="mt-7 max-h-[420px] overflow-y-auto pr-1">
          <ul className="divide-y divide-[#e8c4aa]/40">
            {signups.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <a
                    href={`mailto:${s.email}`}
                    className="block truncate text-sm text-[#3a222a] transition hover:text-[#8a5a5e]"
                  >
                    {s.email}
                  </a>
                  {s.source ? (
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#a06b5a]">{s.source}</span>
                  ) : null}
                </div>
                <span className="flex-shrink-0 text-[11px] text-[#a06b5a]">{formatDate(s.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
