"use client";

import Image from "next/image";
import Link from "next/link";
import { journalEntries } from "@/data/journal";
import { useI18n } from "@/i18n/context";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function JournalPage() {
  const { t } = useI18n();

  return (
    <section className="py-20 md:py-32 px-4 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <p className="text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-4">
            {t.journal.label}
          </p>
          <h1 className="font-heading text-3xl md:text-5xl font-light tracking-wide">
            {t.journal.title}
          </h1>
        </div>

        <ScrollReveal>
          <Link href={`/journal/${journalEntries[0].slug}`} className="group block mb-20 md:mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg-secondary)]">
                <Image
                  src={journalEntries[0].image}
                  alt={t.journal.entries[0].title}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center">
                <time className="text-xs text-[var(--color-text-tertiary)] tracking-wide mb-3">
                  {new Date(journalEntries[0].date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </time>
                <h2 className="font-heading text-2xl md:text-3xl font-light tracking-wide mb-4 group-hover:underline underline-offset-4 decoration-[var(--color-border)]">
                  {t.journal.entries[0].title}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-[1.8] max-w-md">
                  {t.journal.entries[0].excerpt}
                </p>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {journalEntries.slice(1).map((entry, i) => (
            <ScrollReveal key={entry.id} delay={i * 150}>
              <Link href={`/journal/${entry.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-[var(--color-bg-secondary)]">
                  <Image
                    src={entry.image}
                    alt={t.journal.entries[i + 1].title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <time className="text-xs text-[var(--color-text-tertiary)] tracking-wide">
                  {new Date(entry.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </time>
                <h2 className="font-heading text-xl md:text-2xl font-light tracking-wide mt-1 mb-2 group-hover:underline underline-offset-4 decoration-[var(--color-border)]">
                  {t.journal.entries[i + 1].title}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {t.journal.entries[i + 1].excerpt}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
