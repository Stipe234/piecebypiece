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

      {/* Main image - swipeable on mobile */}
      <div
        className="flex-1 relative aspect-[3/4] bg-[var(--color-bg-secondary)] overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          key={active.key}
          src={active.src}
          alt={active.label}
          fill
          quality={90}
          className="object-cover transition-opacity duration-[var(--duration-base)]"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>

      {/* Mobile dots */}
      <div className="flex md:hidden items-center justify-center gap-2.5 pt-3 pb-1">
        {variants.map((v) => (
          <button
            key={v.key}
            onClick={() => onSelect(v.key)}
            className={`rounded-full transition-all ${v.key === selectedKey ? "w-2 h-2 bg-[var(--color-text-primary)]" : "w-1.5 h-1.5 bg-[var(--color-border)]"}`}
            aria-label={v.label}
          />
        ))}
      </div>
    </div>
  );
}
