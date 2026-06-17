"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products, getProductContent } from "@/data/products";
import { useI18n } from "@/i18n/context";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const results = products.filter((p) => {
    if (!q) return true;
    const c = getProductContent(p, locale);
    return `${c.name} ${c.label} hand chain lančić`.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-[60] bg-[var(--color-bg-primary)] scroll-reveal-fade is-visible overflow-y-auto">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12 pt-6 pb-20">
        <div className="flex items-center gap-4 border-b border-[var(--color-border)] pb-4">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${t.nav.search}…`}
            className="flex-1 bg-transparent text-xl md:text-3xl font-heading font-light tracking-wide text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {results.map((p) => {
            const c = getProductContent(p, locale);
            return (
              <Link key={p.id} href={`/products/${p.slug}`} onClick={onClose} className="block group">
                <div className="img-tactile relative aspect-[4/5] overflow-hidden bg-white mb-3">
                  <Image src={p.images.studio} alt={c.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-tertiary)]">{c.label}</p>
                <p className="text-sm font-medium mt-0.5">{c.name}</p>
              </Link>
            );
          })}
        </div>

        {results.length === 0 && (
          <p className="mt-10 text-sm text-[var(--color-text-tertiary)]">—</p>
        )}
      </div>
    </div>
  );
}
