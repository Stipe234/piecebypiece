"use client";

import Link from "next/link";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { useI18n } from "@/i18n/context";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4">
            <span className="font-heading text-lg font-normal tracking-[0.25em] lowercase block mb-4">
              piece by piece
            </span>
            <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <nav className="flex flex-col gap-3">
              <Link href="/collections/hand-chains" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors tracking-wide">{t.nav.shop}</Link>
              <Link href="/about" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors tracking-wide">{t.nav.about}</Link>
              <Link href="/journal" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors tracking-wide">{t.nav.journal}</Link>
            </nav>
          </div>

          <div className="md:col-span-2">
            <nav className="flex flex-col gap-3">
              <Link href="/pages/care" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors tracking-wide">{t.nav.care}</Link>
              <Link href="/pages/shipping-returns" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors tracking-wide">{t.nav.shipping}</Link>
              <Link href="/pages/contact" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors tracking-wide">{t.nav.contact}</Link>
            </nav>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <p className="text-xs text-[var(--color-text-tertiary)] mb-4 tracking-wide">
              {t.footer.stayInTouch}
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-[var(--color-text-tertiary)] tracking-wider">{t.footer.copyright}</p>
          <div className="flex items-center gap-6">
            <Link href="/pages/privacy-policy" className="text-[10px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors tracking-wider">{t.footer.privacy}</Link>
            <Link href="/pages/terms" className="text-[10px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors tracking-wider">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
