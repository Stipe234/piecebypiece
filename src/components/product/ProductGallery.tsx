"use client";

import { useState, useRef, type TouchEvent } from "react";
import Image from "next/image";

export default function ProductGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold && activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (diff < -threshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Thumbnails - desktop */}
      <div className="hidden md:flex flex-col gap-2 w-20">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative aspect-[4/5] overflow-hidden border transition-colors ${activeIndex === i ? "border-[var(--color-border-dark)]" : "border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]"}`}
          >
            <Image src={img} alt="" fill className="object-cover" sizes="80px" />
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
          src={images[activeIndex]}
          alt=""
          fill
          className="object-cover transition-opacity duration-[var(--duration-base)]"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>

      {/* Mobile dots */}
      <div className="flex md:hidden items-center justify-center gap-2.5 pt-3 pb-1">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`rounded-full transition-all ${activeIndex === i ? "w-2 h-2 bg-[var(--color-text-primary)]" : "w-1.5 h-1.5 bg-[var(--color-border)]"}`}
            aria-label={`View image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
