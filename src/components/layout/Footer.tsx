"use client";

import Link from "next/link";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { useI18n } from "@/i18n/context";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="max-w-[560px] mx-auto px-6 py-14 md:py-20 flex flex-col items-center text-center gap-8">
        <span className="font-heading text-base font-light tracking-[0.18em] uppercase">
          Piece by Piece
        </span>

        <div className="w-full max-w-xs">
          <p className="text-xs text-[var(--color-text-tertiary)] tracking-wide mb-3">
            {t.footer.stayInTouch}
          </p>
          <NewsletterForm />
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/collections/hand-chains" className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">{t.nav.shop}</Link>
          <Link href="/about" className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">{t.nav.about}</Link>
          <Link href="/journal" className="text-[11px] tracking-[0.15em] uppercase text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">{t.nav.journal}</Link>
        </nav>

        <p className="text-[10px] text-[var(--color-text-tertiary)] tracking-wider">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}
