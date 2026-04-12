"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/context";

export default function NewsletterForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  if (submitted) {
    return <p className="text-sm text-[var(--color-text-secondary)]">{t.newsletter.thanks}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.newsletter.placeholder}
        required
        className="flex-1 bg-transparent border-b border-[var(--color-border)] py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-border-dark)] transition-colors"
      />
      <button
        type="submit"
        className="text-sm font-medium tracking-[0.05em] uppercase text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] transition-colors py-2"
      >
        {t.newsletter.submit}
      </button>
    </form>
  );
}
