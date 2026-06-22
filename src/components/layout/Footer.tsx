"use client";

import Link from "next/link";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { useI18n } from "@/i18n/context";

export default function Footer() {
  const { t } = useI18n();

  const linkClass =
    "text-[11px] tracking-[0.15em] uppercase text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors";

  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="max-w-[640px] mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center gap-8">
        <span className="font-heading text-base font-light tracking-[0.18em] uppercase">
          Piece by Piece
        </span>

        <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed max-w-xs">
          {t.footer.tagline}
        </p>

        <div className="w-full max-w-xs">
          <p className="text-xs text-[var(--color-text-tertiary)] tracking-wide mb-3">
            {t.footer.stayInTouch}
          </p>
          <NewsletterForm />
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2">
          <Link href="/collections/hand-chains" className={linkClass}>{t.nav.shop}</Link>
          <Link href="/about" className={linkClass}>{t.nav.ourStory}</Link>
          <Link href="/shipping" className={linkClass}>{t.nav.shipping}</Link>
          <Link href="/contact" className={linkClass}>{t.nav.contact}</Link>
          <a href="https://www.instagram.com/piecebypiece.wear/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            {t.nav.instagram}
          </a>
        </nav>

        <div className="pt-2">
          <span className="text-[10px] text-[var(--color-text-tertiary)] tracking-wider">{t.footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
