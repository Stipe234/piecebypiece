"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/context";

export default function WaitlistForm({ editionName }: { editionName?: string }) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "waitlist" }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="text-sm text-[var(--color-text-secondary)] py-2">
        {t.waitlist.thanks}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.waitlist.placeholder}
          required
          disabled={status === "loading"}
          aria-label={editionName ? `${t.waitlist.cta} — ${editionName}` : t.waitlist.cta}
          className="flex-1 bg-transparent border-b border-[var(--color-border)] py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-border-dark)] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="text-sm font-medium tracking-[0.08em] uppercase text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] transition-colors py-2.5 whitespace-nowrap disabled:opacity-50"
        >
          {status === "loading" ? "…" : t.waitlist.submit}
        </button>
      </div>
      <p className="text-xs text-[var(--color-text-tertiary)] mt-3">
        {status === "error" ? t.waitlist.error : t.waitlist.note}
      </p>
    </form>
  );
}
