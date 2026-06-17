"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/i18n/context";
import MobileNav from "./MobileNav";
import SearchOverlay from "@/components/ui/SearchOverlay";

export default function Header() {
  const { openCart, itemCount } = useCart();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinkClass =
    "link-underline text-[11px] font-medium tracking-[0.18em] uppercase text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors";

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg-primary)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex items-center justify-between h-14 md:h-20">
        {/* Mobile menu */}
        <button
          className="md:hidden text-[var(--color-text-primary)] p-1 -ml-1 tap-highlight-transparent"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="7" x2="21" y2="7" />
            <line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        </button>

        {/* Desktop nav left */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/collections/hand-chains" className={navLinkClass}>{t.nav.shop}</Link>
          <Link href="/about" className={navLinkClass}>{t.nav.ourStory}</Link>
        </nav>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <span className="font-heading text-base md:text-xl font-light tracking-[0.12em] md:tracking-[0.18em] uppercase whitespace-nowrap">
            Piece by Piece
          </span>
        </Link>

        {/* Right: search + cart */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label={t.nav.search}
            className="text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] transition-colors p-1"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
          </button>

          <button
            onClick={openCart}
            aria-label={t.nav.cart}
            className="relative text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] transition-colors p-1 -mr-1"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-[var(--color-text-primary)] text-[var(--color-text-inverse)] text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
