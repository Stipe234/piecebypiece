"use client";

import { useState } from "react";
import type { WaitlistSignup } from "@/lib/waitlist";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function WaitlistPanel({ signups, last7Days }: { signups: WaitlistSignup[]; last7Days: number }) {
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
          <span className="font-numeric text-6xl font-semibold leading-none text-[var(--color-text-primary)] md:text-7xl">
            {signups.length}
          </span>
          <span className="pb-1 text-[11px] uppercase tracking-[0.26em] text-[var(--color-text-tertiary)]">
            {signups.length === 1 ? "signup" : "signups"}
          </span>
        </div>

        {signups.length > 0 && (
          <button
            onClick={copyAll}
            className="border border-[var(--color-border-dark)] px-6 py-2.5 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent-dark)] hover:text-[var(--color-text-inverse)]"
          >
            {copied ? "Copied" : "Copy all"}
          </button>
        )}
      </div>

      {signups.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
          <span className="text-[var(--color-text-secondary)]">+{last7Days} this week</span>
          <span>Latest {formatDate(signups[0].createdAt)}</span>
        </div>
      )}

      {signups.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-text-tertiary)]">No signups yet. They&apos;ll appear here the moment someone joins.</p>
      ) : (
        <div className="mt-7 max-h-[420px] overflow-y-auto pr-1">
          <ul className="divide-y divide-[var(--color-border)]">
            {signups.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  {s.firstName ? (
                    <span className="block truncate text-sm text-[var(--color-text-primary)]">{s.firstName}</span>
                  ) : null}
                  <a
                    href={`mailto:${s.email}`}
                    className={`block truncate transition hover:text-[var(--color-text-tertiary)] ${
                      s.firstName ? "text-xs text-[var(--color-text-tertiary)]" : "text-sm text-[var(--color-text-primary)]"
                    }`}
                  >
                    {s.email}
                  </a>
                  {(s.material || s.source) ? (
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
                      {s.material ? [s.material, s.style].filter(Boolean).join(" · ") : s.source}
                    </span>
                  ) : null}
                </div>
                <span className="font-numeric flex-shrink-0 text-[11px] text-[var(--color-text-tertiary)]">{formatDate(s.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
