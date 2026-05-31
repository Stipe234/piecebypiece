"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/context";

export default function WaitlistForm({ editionName }: { editionName?: string }) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Local capture for now — mirrors the existing newsletter behaviour.
    // Wire to a real list (Klaviyo / Mailchimp / DB) when ready.
    if (email) setSubmitted(true);
  };

  if (submitted) {
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
          aria-label={editionName ? `${t.waitlist.cta} — ${editionName}` : t.waitlist.cta}
          className="flex-1 bg-transparent border-b border-[var(--color-border)] py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-border-dark)] transition-colors"
        />
        <button
          type="submit"
          className="text-sm font-medium tracking-[0.08em] uppercase text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] transition-colors py-2.5 whitespace-nowrap"
        >
          {t.waitlist.submit}
        </button>
      </div>
      <p className="text-xs text-[var(--color-text-tertiary)] mt-3">{t.waitlist.note}</p>
    </form>
  );
}
