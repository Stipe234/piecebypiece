"use client";

import { useActionState, useState } from "react";
import { saveOrderEmailAction, type OwnerActionState } from "@/app/owner/actions";
import type { OrderEmailCopy } from "@/lib/settings";

const initialState: OwnerActionState = {};

const inputClass =
  "w-full rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent-dark)]";
const labelClass = "text-[10px] uppercase tracking-[0.26em] text-[var(--color-text-tertiary)]";

function Field({
  label,
  name,
  defaultValue,
  hint,
  rows,
  maxLength,
}: {
  label: string;
  name: string;
  defaultValue: string;
  hint?: string;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className={labelClass}>{label}</span>
      {rows ? (
        <textarea name={name} rows={rows} defaultValue={defaultValue} maxLength={maxLength} className={`${inputClass} resize-y leading-relaxed`} />
      ) : (
        <input name={name} type="text" defaultValue={defaultValue} maxLength={maxLength} className={inputClass} />
      )}
      {hint ? <span className="text-[10px] text-[var(--color-text-tertiary)]">{hint}</span> : null}
    </label>
  );
}

export default function EmailTemplatePanel({ copy }: { copy: OrderEmailCopy }) {
  const [state, action, pending] = useActionState(saveOrderEmailAction, initialState);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");

  // `savedAt` changes on every successful save, so the preview reloads with the
  // freshly-saved copy without needing an effect.
  const previewSrc = `/api/owner/email-preview?fulfillment=${fulfillment}&v=${state.savedAt ?? 0}`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ── Editor ── */}
      <form action={action} className="flex flex-col gap-5">
        <p className="text-sm text-[var(--color-text-secondary)]">
          This is the “thank you” email each customer gets when they buy. Edit the wording, save, and the preview
          updates. The greeting (“Hi Ana,”) and the order summary fill in automatically.
        </p>

        <Field label="Subject line" name="subject" defaultValue={copy.subject} maxLength={150} />
        <Field label="Eyebrow — small label above the title" name="eyebrow" defaultValue={copy.eyebrow} maxLength={40} />
        <Field label="Heading — the large title" name="heading" defaultValue={copy.heading} maxLength={120} />
        <Field label="Opening paragraph" name="intro" defaultValue={copy.intro} rows={3} maxLength={600} />
        <Field
          label="Next step — home delivery"
          name="nextStepDelivery"
          defaultValue={copy.nextStepDelivery}
          rows={3}
          maxLength={600}
          hint="Shown when the order is being shipped."
        />
        <Field
          label="Next step — personal pickup"
          name="nextStepPickup"
          defaultValue={copy.nextStepPickup}
          rows={3}
          maxLength={600}
          hint="Shown when the customer chose pickup."
        />
        <Field label="Care section heading" name="careHeading" defaultValue={copy.careHeading} maxLength={60} />
        <Field
          label="Care points"
          name="careItems"
          defaultValue={copy.careItems.join("\n")}
          rows={6}
          maxLength={2000}
          hint="One point per line."
        />
        <Field label="Closing paragraph" name="careFooter" defaultValue={copy.careFooter} rows={3} maxLength={600} />

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-[var(--color-border-dark)] bg-[var(--color-accent-dark)] px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-inverse)] shadow-[0_8px_18px_-10px_rgba(0,0,0,0.5)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save email"}
          </button>
          {state.error ? (
            <span className="text-xs text-[var(--color-error)]">{state.error}</span>
          ) : state.success ? (
            <span className="text-xs text-[var(--color-success)]">{state.message}</span>
          ) : null}
        </div>
      </form>

      {/* ── Live preview ── */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="flex items-center justify-between gap-3 rounded-t-lg border border-b-0 border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
          <p className={labelClass}>Preview — saved version</p>
          <div className="flex overflow-hidden rounded-md border border-[var(--color-border-dark)] text-[10px] uppercase tracking-[0.18em]">
            {(["delivery", "pickup"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFulfillment(mode)}
                className={`px-3 py-1.5 transition-colors ${
                  fulfillment === mode
                    ? "bg-[var(--color-accent-dark)] text-[var(--color-text-inverse)]"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <iframe
          key={previewSrc}
          title="Order email preview"
          src={previewSrc}
          className="block h-[620px] w-full rounded-b-lg border border-[var(--color-border)] bg-white"
        />
        <p className="mt-2 text-[10px] text-[var(--color-text-tertiary)]">
          Preview reflects the last saved version — save to see your latest edits.
        </p>
      </div>
    </div>
  );
}
