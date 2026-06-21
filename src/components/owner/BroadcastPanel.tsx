"use client";

import { useActionState, useState } from "react";
import { sendBroadcastAction, type BroadcastState } from "@/app/owner/actions";

const initialState: BroadcastState = {};

const inputClass =
  "w-full rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent-dark)]";

const labelClass = "text-[10px] uppercase tracking-[0.26em] text-[var(--color-text-tertiary)]";

export default function BroadcastPanel({ subscriberCount }: { subscriberCount: number }) {
  const [state, action, pending] = useActionState(sendBroadcastAction, initialState);
  const [confirmed, setConfirmed] = useState(false);

  const noSubscribers = subscriberCount === 0;
  const plural = subscriberCount === 1 ? "" : "s";

  return (
    <form action={action} className="flex flex-col gap-5">
      <p className="text-sm text-[var(--color-text-secondary)]">
        Write an update and send it to{" "}
        <span className="font-medium text-[var(--color-text-primary)]">
          {subscriberCount} subscriber{plural}
        </span>
        . Everyone gets their own email — replies come straight back to you.
      </p>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Subject line</span>
        <input name="subject" type="text" maxLength={150} placeholder="Piece 001 is here" className={inputClass} required />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Heading (shown inside the email)</span>
        <input name="heading" type="text" maxLength={120} placeholder="It's time." className={inputClass} required />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Message</span>
        <textarea
          name="body"
          rows={7}
          maxLength={4000}
          placeholder={"Write your message here.\n\nLeave a blank line between paragraphs."}
          className={`${inputClass} resize-y leading-relaxed`}
          required
        />
        <span className="text-[10px] text-[var(--color-text-tertiary)]">
          Leave a blank line between paragraphs. Signed off automatically with “With love, Piece by Piece.”
        </span>
      </label>

      <label className="flex cursor-pointer select-none items-start gap-3">
        <input
          type="checkbox"
          name="confirm"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[var(--color-accent-dark)]"
        />
        <span className="text-xs text-[var(--color-text-secondary)]">
          I understand this sends a real email to all {subscriberCount} subscriber{plural}.
        </span>
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending || noSubscribers || !confirmed}
          onClick={(e) => {
            if (!window.confirm(`Send this email to all ${subscriberCount} subscriber${plural} now? This can't be undone.`)) {
              e.preventDefault();
            }
          }}
          className="rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-accent-dark)] px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-inverse)] shadow-[0_8px_18px_-10px_rgba(0,0,0,0.5)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
        >
          {pending ? "Sending..." : "Send to all"}
        </button>
        {noSubscribers ? <span className="text-xs text-[var(--color-text-tertiary)]">No subscribers yet.</span> : null}
      </div>

      {state.error ? (
        <p className="text-xs text-[var(--color-error)]">{state.error}</p>
      ) : state.success ? (
        <p className="text-xs text-[var(--color-success)]">{state.message}</p>
      ) : null}
    </form>
  );
}
