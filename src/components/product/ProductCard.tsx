"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductContent, type Product } from "@/data/products";
import { useI18n } from "@/i18n/context";

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const { locale } = useI18n();
  const content = getProductContent(product, locale);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-secondary)] mb-3">
        <Image
          src={product.images.studio}
          alt={content.name}
          fill
          className={`object-cover transition-opacity duration-[var(--duration-base)] ${hovered ? "opacity-0" : "opacity-100"}`}
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <Image
          src={product.images.onBody}
          alt={`${content.name} on body`}
          fill
          className={`object-cover transition-opacity duration-[var(--duration-base)] ${hovered ? "opacity-100" : "opacity-0"}`}
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 text-[10px] font-medium tracking-[0.1em] uppercase text-[var(--color-text-secondary)]">
            New
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium">{content.name}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1">€{product.price}</p>
    </Link>
  );
}
