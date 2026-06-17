import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-32 md:py-48 min-h-[60vh]">
      <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-4">
        404
      </p>
      <h1 className="font-heading text-3xl md:text-5xl font-light tracking-wide mb-6">
        This page is not here.
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm mb-10">
        The piece you were looking for has moved, or perhaps was never quite
        finished. Begin again from the start.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center text-sm font-medium tracking-[0.1em] uppercase py-3 px-8 md:py-3.5 md:px-10 bg-[var(--color-accent-dark)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)] transition-colors rounded-sm"
      >
        Return home
      </Link>
    </section>
  );
}
