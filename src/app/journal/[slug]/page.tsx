"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { journalEntries } from "@/data/journal";
import { products, getProductContent } from "@/data/products";
import { useI18n } from "@/i18n/context";
import { useProductAvailability } from "@/hooks/useProductAvailability";

export default function JournalArticlePage() {
  const params = useParams();
  const { t, locale } = useI18n();
  const slug = params.slug as string;

  const entryIndex = journalEntries.findIndex((e) => e.slug === slug);
  if (entryIndex === -1) notFound();

  const entry = journalEntries[entryIndex];
  const tEntry = t.journal.entries[entryIndex];
  const product = products[0];
  const productContent = getProductContent(product, locale);
  const { availability } = useProductAvailability(product.id);
  const displayPrice = availability?.priceCents != null ? availability.priceCents / 100 : product.price;

  return (
    <article className="py-20 md:py-32 px-4">
      <div className="max-w-[720px] mx-auto">
        <div className="text-center mb-12">
          <time className="text-xs text-[var(--color-text-tertiary)] tracking-wide">
            {new Date(entry.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
          <h1 className="font-heading text-3xl md:text-5xl font-light tracking-wide mt-3">
            {tEntry.title}
          </h1>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden mb-16 bg-[var(--color-bg-secondary)]">
          <Image src={entry.image} alt={tEntry.title} fill className="object-cover" sizes="720px" priority />
        </div>

        <div className="flex flex-col gap-8">
          {tEntry.content.map((paragraph, i) => (
            <p key={i} className="text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.9]">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-[var(--color-border)] text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-6">
            {t.journal.featuredPiece}
          </p>
          <Link href={`/products/${product.slug}`} className="group inline-block">
            <div className="relative w-48 aspect-[4/5] overflow-hidden bg-[var(--color-bg-secondary)] mx-auto mb-4">
              <Image
                src={product.images.studio}
                alt={productContent.name}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                sizes="192px"
              />
            </div>
            <p className="font-heading text-lg font-light tracking-wide group-hover:underline underline-offset-4">
              {productContent.name}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">€{displayPrice}</p>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/journal"
            className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors underline underline-offset-4"
          >
            {t.journal.backToJournal}
          </Link>
        </div>
      </div>
    </article>
  );
}
