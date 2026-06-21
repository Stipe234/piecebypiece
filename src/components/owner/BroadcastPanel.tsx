"use client";

import { useActionState, useState } from "react";
import { sendBroadcastAction, type BroadcastState } from "@/app/owner/actions";
import { broadcastHtml } from "@/lib/broadcast-template";

const initialState: BroadcastState = {};

const inputClass =
  "w-full rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent-dark)]";

const labelClass = "text-[10px] uppercase tracking-[0.26em] text-[var(--color-text-tertiary)]";

// Placeholders so the preview is never blank while composing.
const PLACEHOLDER_SUBJECT = "Piece 001 is here";
const PLACEHOLDER_EYEBROW = "An update";
const PLACEHOLDER_HEADING = "It's time.";
const PLACEHOLDER_BODY = "Write your message here.\n\nLeave a blank line between paragraphs.";

export default function BroadcastPanel({ subscriberCount }: { subscriberCount: number }) {
  const [state, action, pending] = useActionState(sendBroadcastAction, initialState);

  const [subject, setSubject] = useState("");
  const [eyebrow, setEyebrow] = useState("");
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const noSubscribers = subscriberCount === 0;
  const plural = subscriberCount === 1 ? "" : "s";

  // Exact email recipients will see — same template as the real send.
  const previewHtml = broadcastHtml({
    eyebrow: eyebrow.trim() || PLACEHOLDER_EYEBROW,
    heading: heading.trim() || PLACEHOLDER_HEADING,
    body: body.trim() || PLACEHOLDER_BODY,
  });
  const previewSubject = subject.trim() || PLACEHOLDER_SUBJECT;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ── Composer ── */}
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
          <input
            name="subject"
            type="text"
            maxLength={150}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={PLACEHOLDER_SUBJECT}
            className={inputClass}
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Eyebrow — small label above the title (optional)</span>
          <input
            name="eyebrow"
            type="text"
            maxLength={40}
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            placeholder={PLACEHOLDER_EYEBROW}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Heading — the large title inside the email</span>
          <input
            name="heading"
            type="text"
            maxLength={120}
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder={PLACEHOLDER_HEADING}
            className={inputClass}
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Message</span>
          <textarea
            name="body"
            rows={8}
            maxLength={4000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={PLACEHOLDER_BODY}
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

      {/* ── Live preview ── */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-t-lg border border-b-0 border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
          <p className={labelClass}>Live preview — exactly what they&apos;ll receive</p>
          <p className="mt-3 truncate text-sm text-[var(--color-text-primary)]">
            <span className="text-[var(--color-text-tertiary)]">From&nbsp;&nbsp;</span>
            {`Piece by Piece <info@piecebypiecewear.com>`}
          </p>
          <p className="truncate text-sm text-[var(--color-text-primary)]">
            <span className="text-[var(--color-text-tertiary)]">Subject&nbsp;&nbsp;</span>
            {previewSubject}
          </p>
        </div>
        <iframe
          title="Email preview"
          srcDoc={previewHtml}
          sandbox=""
          className="block h-[560px] w-full rounded-b-lg border border-[var(--color-border)] bg-white"
        />
      </div>
    </div>
  );
}
