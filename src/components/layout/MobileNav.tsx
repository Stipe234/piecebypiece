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
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-[84%] max-w-xs bg-[var(--color-bg-primary)] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 h-14 border-b border-[var(--color-border)]">
          <span className="font-heading text-sm font-medium tracking-[0.14em] uppercase text-[var(--color-text-primary)]">
            Piece by Piece
          </span>
          <button onClick={onClose} aria-label="Close menu" className="-mr-1 p-1 text-[var(--color-text-primary)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-8 pt-10 gap-7">
          {[
            { href: "/collections/hand-chains", label: t.nav.shop },
            { href: "/about", label: t.nav.ourStory },
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

        <div className="mt-auto px-8 pb-12">
          <hr className="hr-accent mb-6" />
          <nav className="flex flex-col gap-3">
            <Link href="/shipping" onClick={onClose} className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{t.nav.shipping}</Link>
            <Link href="/returns" onClick={onClose} className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{t.nav.returns}</Link>
            <Link href="/contact" onClick={onClose} className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{t.nav.contact}</Link>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{t.nav.instagram}</a>
          </nav>
        </div>
      </div>
    </>
  );
}
