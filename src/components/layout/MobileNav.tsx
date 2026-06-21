"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useI18n } from "@/i18n/context";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-[var(--color-bg-primary)] transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="flex items-center justify-between px-6 h-14 border-b border-[var(--color-border)]">
        <span className="font-heading text-sm font-medium tracking-[0.14em] uppercase text-[var(--color-text-primary)]">
          Piece by Piece
        </span>
        <button onClick={onClose} aria-label="Close menu" className="-mr-1 p-1 text-[var(--color-text-primary)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col items-center justify-center gap-9">
        {[
          { href: "/collections/hand-chains", label: t.nav.shop },
          { href: "/about", label: t.nav.ourStory },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-heading text-3xl font-light tracking-wide text-[var(--color-text-primary)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="px-10 pb-12 text-center">
        <hr className="hr-accent mx-auto mb-6" />
        <nav className="flex flex-col items-center gap-3">
          <Link href="/shipping" onClick={onClose} className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{t.nav.shipping}</Link>
          <Link href="/returns" onClick={onClose} className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{t.nav.returns}</Link>
          <Link href="/contact" onClick={onClose} className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{t.nav.contact}</Link>
          <a href="https://www.instagram.com/piecebypiece.wear/" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{t.nav.instagram}</a>
        </nav>
      </div>
    </div>
  );
}
