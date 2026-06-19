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

// The image is driven entirely by the variant the shopper picks (Gold/Silver
// + Static/Dangling). No thumbnails or indicators — swipe still cycles
// variants on touch devices as a bonus.
export default function ProductGallery({ variants, selectedKey, onSelect }: ProductGalleryProps) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const foundIndex = variants.findIndex((v) => v.key === selectedKey);
  const activeIndex = foundIndex === -1 ? 0 : foundIndex;

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

  if (variants.length === 0) return null;

  return (
    <div
      className="relative aspect-[3/4] bg-[var(--color-bg-secondary)] overflow-hidden touch-pan-y"
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
  );
}
