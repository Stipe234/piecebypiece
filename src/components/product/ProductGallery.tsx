"use client";

import { useRef, type TouchEvent } from "react";
import Image from "next/image";

export interface GalleryVariant {
  key: string;
  label: string;
  src: string;
}

interface ProductGalleryProps {
  variants: GalleryVariant[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export default function ProductGallery({ variants, selectedKey, onSelect }: ProductGalleryProps) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const foundIndex = variants.findIndex((v) => v.key === selectedKey);
  const activeIndex = foundIndex === -1 ? 0 : foundIndex;
  const active = variants[activeIndex];

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold && activeIndex < variants.length - 1) {
      onSelect(variants[activeIndex + 1].key);
    } else if (diff < -threshold && activeIndex > 0) {
      onSelect(variants[activeIndex - 1].key);
    }
  };

  if (!active) return null;

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Thumbnails - desktop */}
      <div className="hidden md:flex flex-col gap-2 w-20">
        {variants.map((v) => (
          <button
            key={v.key}
            onClick={() => onSelect(v.key)}
            aria-label={v.label}
            aria-pressed={v.key === selectedKey}
            className={`relative aspect-[4/5] overflow-hidden border transition-colors ${v.key === selectedKey ? "border-[var(--color-border-dark)]" : "border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]"}`}
          >
            <Image src={v.src} alt={v.label} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>

      {/* Main image - swipeable on mobile. All variants are rendered stacked
          (only the active one is visible) so switching is an instant opacity
          swap instead of a fresh network fetch. */}
      <div
        className="flex-1 relative aspect-[3/4] bg-[var(--color-bg-secondary)] overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {variants.map((v) => (
          <Image
            key={v.key}
            src={v.src}
            alt={v.label}
            fill
            quality={90}
            priority={v.key === selectedKey}
            className={`object-cover transition-opacity duration-[var(--duration-base)] ${v.key === selectedKey ? "opacity-100" : "opacity-0"}`}
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        ))}
      </div>

      {/* Mobile indicators - tiny horizontal bars */}
      <div className="flex md:hidden items-center justify-center gap-1.5 pt-4 pb-1">
        {variants.map((v) => (
          <button
            key={v.key}
            onClick={() => onSelect(v.key)}
            className={`h-[3px] rounded-[1px] transition-all duration-300 ${v.key === selectedKey ? "w-6 bg-[var(--color-text-primary)]" : "w-4 bg-[var(--color-border)]"}`}
            aria-label={v.label}
          />
        ))}
      </div>
    </div>
  );
}
