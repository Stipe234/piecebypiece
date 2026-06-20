"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** ISO timestamp when the hold expires. */
  expiresAt: string;
  /** Fires once when the countdown reaches zero. */
  onExpire?: () => void;
  /** Total hold length, for the progress bar (default 5 minutes). */
  totalMs?: number;
}

/**
 * Shows "your selection is reserved" with a live mm:ss countdown and a bar that
 * shrinks smoothly (CSS transition between 1s ticks).
 */
export default function ReservationBanner({ expiresAt, onExpire, totalMs = 5 * 60 * 1000 }: Props) {
  const expiry = new Date(expiresAt).getTime();
  const [remaining, setRemaining] = useState(() => Math.max(expiry - Date.now(), 0));
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    const update = () => {
      const ms = Math.max(expiry - Date.now(), 0);
      setRemaining(ms);
      if (ms <= 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire?.();
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expiry, onExpire]);

  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const pct = Math.max(Math.min((remaining / totalMs) * 100, 100), 0);
  const expired = remaining <= 0;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs md:text-sm text-[var(--color-text-secondary)]">
          {expired ? "Your hold has expired — refresh to try again." : "Your selection is reserved for you"}
        </p>
        <span
          className={`font-numeric text-sm md:text-base font-medium tabular-nums ${expired ? "text-[var(--color-error)]" : "text-[var(--color-text-primary)]"}`}
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent-dark)] transition-[width] duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
