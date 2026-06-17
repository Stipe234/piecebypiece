"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/context";

export default function NewsletterForm() {
  const { t, locale } = useI18n();
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
        body: JSON.stringify({ email, source: "newsletter", locale }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return <p className="text-sm text-[var(--color-text-secondary)]">{t.newsletter.thanks}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.newsletter.placeholder}
          required
          disabled={status === "loading"}
          className="flex-1 bg-transparent border-b border-[var(--color-border)] py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-border-dark)] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="text-sm font-medium tracking-[0.05em] uppercase text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] transition-colors py-2 disabled:opacity-50"
        >
          {status === "loading" ? "…" : t.newsletter.submit}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-[var(--color-error)]">{t.waitlist.error}</p>
      )}
    </form>
  );
}
