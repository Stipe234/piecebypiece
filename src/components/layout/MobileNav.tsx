"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useI18n } from "@/i18n/context";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[var(--color-bg-primary)] z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-end p-6">
          <button onClick={onClose} aria-label="Close menu" className="text-[var(--color-text-primary)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col px-8 gap-8">
          {[
            { href: "/collections/hand-chains", label: t.nav.shop },
            { href: "/about", label: t.nav.about },
            { href: "/journal", label: t.nav.journal },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="font-heading text-2xl font-light tracking-wide text-[var(--color-text-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-12 left-8 right-8">
          <hr className="hr-accent mb-6" />
          <nav className="flex flex-col gap-3 mb-6">
            <Link href="/pages/care" onClick={onClose} className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{t.nav.care}</Link>
            <Link href="/pages/shipping-returns" onClick={onClose} className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{t.nav.shipping}</Link>
            <Link href="/pages/contact" onClick={onClose} className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{t.nav.contact}</Link>
          </nav>
          <button
            onClick={() => { setLocale(locale === "en" ? "hr" : "en"); onClose(); }}
            className="text-xs font-medium tracking-[0.15em] uppercase text-[var(--color-text-tertiary)]"
          >
            {locale === "en" ? "Hrvatski" : "English"}
          </button>
        </div>
      </div>
    </>
  );
}
