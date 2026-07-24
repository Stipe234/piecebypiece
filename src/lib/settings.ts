/**
 * Owner-editable store settings, persisted in the database so the brand owner can
 * change wording herself from the dashboard without a code change or deploy.
 *
 * Today it holds the copy for the order-confirmation ("thank you") email. Values
 * are stored as one JSON row per key in `store_settings`; anything not set falls
 * back to the defaults below, so the email always renders even before it's edited.
 */

import { getSql } from "@/lib/db";

export interface OrderEmailCopy {
  subject: string;
  eyebrow: string;
  heading: string;
  /** The thank-you paragraph under the greeting (the greeting itself stays automatic). */
  intro: string;
  /** Second paragraph — shown when the order is being delivered. */
  nextStepDelivery: string;
  /** Second paragraph — shown when the order is a personal pickup. */
  nextStepPickup: string;
  /** Small heading above the care list. */
  careHeading: string;
  /** Care bullet points. */
  careItems: string[];
  /** Closing paragraph after the care list. */
  careFooter: string;
}

export const DEFAULT_ORDER_EMAIL_COPY: OrderEmailCopy = {
  subject: "Thank you for your order — Piece by Piece",
  eyebrow: "Order confirmed",
  heading: "Thank you.",
  intro: "Thank you for your order — it genuinely means the world to a small studio like ours.",
  nextStepDelivery:
    "Each piece is made by hand, so yours is being prepared with care. We'll email you again the moment it's on its way.",
  nextStepPickup:
    "Each piece is made by hand, so yours is being prepared with care. We'll email you as soon as it's ready to collect, to arrange a time.",
  careHeading: "Wearing your piece",
  careItems: [
    "It's fine, feminine, and dainty by design — light enough to feel like part of you, which also means it asks to be worn gently.",
    "Put it on last, after fragrance, lotion, hairspray, and getting dressed — and take it off first, before you undress, shower, or sleep.",
    "Keep it away from water, perfume, lotion, and cleaning products, and avoid catching it on fabrics, zippers, or rough edges.",
    "Store it flat and on its own when you're not wearing it.",
  ],
  careFooter:
    "A fine chain like this rewards a little care: worn thoughtfully it's made to last for years, while a snag or a tug can catch it. Treat it gently and it will stay with you.",
};

const ORDER_EMAIL_KEY = "order_email_copy";

let schemaReady: Promise<void> | null = null;

async function ensureSettingsReady() {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = (async () => {
      await sql`
        create table if not exists store_settings (
          key text primary key,
          value jsonb not null,
          updated_at timestamptz not null default now()
        )
      `;
    })();
  }
  await schemaReady;
}

/**
 * Decode a value read from a jsonb column.
 *
 * Depending on the driver/pooler in use, jsonb arrives either already decoded as
 * an object or still as a raw JSON string — through a connection pooler it comes
 * back as a string. Treating that string as an object made every saved field look
 * empty, so edited copy silently fell back to the defaults. Accept both shapes.
 */
function decodeJsonbObject(value: unknown): Partial<OrderEmailCopy> | null {
  if (!value) return null;
  if (typeof value === "object") return value as Partial<OrderEmailCopy>;

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") return parsed as Partial<OrderEmailCopy>;
    } catch {
      // Unreadable stored copy — fall back to the defaults below.
    }
  }

  return null;
}

/** Merge stored overrides onto the defaults, dropping unknown/empty fields so a
 *  partial or older saved value can never blank out the email. */
function mergeOrderEmailCopy(raw: unknown): OrderEmailCopy {
  const stored = decodeJsonbObject(raw);
  if (!stored) return DEFAULT_ORDER_EMAIL_COPY;
  const careItems = Array.isArray(stored.careItems)
    ? stored.careItems.map((s) => String(s)).filter((s) => s.trim())
    : null;
  return {
    subject: stored.subject?.trim() || DEFAULT_ORDER_EMAIL_COPY.subject,
    eyebrow: stored.eyebrow?.trim() || DEFAULT_ORDER_EMAIL_COPY.eyebrow,
    heading: stored.heading?.trim() || DEFAULT_ORDER_EMAIL_COPY.heading,
    intro: stored.intro?.trim() || DEFAULT_ORDER_EMAIL_COPY.intro,
    nextStepDelivery: stored.nextStepDelivery?.trim() || DEFAULT_ORDER_EMAIL_COPY.nextStepDelivery,
    nextStepPickup: stored.nextStepPickup?.trim() || DEFAULT_ORDER_EMAIL_COPY.nextStepPickup,
    careHeading: stored.careHeading?.trim() || DEFAULT_ORDER_EMAIL_COPY.careHeading,
    careItems: careItems && careItems.length > 0 ? careItems : DEFAULT_ORDER_EMAIL_COPY.careItems,
    careFooter: stored.careFooter?.trim() || DEFAULT_ORDER_EMAIL_COPY.careFooter,
  };
}

export async function getOrderEmailCopy(): Promise<OrderEmailCopy> {
  await ensureSettingsReady();
  const sql = getSql();
  const rows = await sql<{ value: Partial<OrderEmailCopy> }[]>`
    select value from store_settings where key = ${ORDER_EMAIL_KEY} limit 1
  `;
  return mergeOrderEmailCopy(rows[0]?.value ?? null);
}

export async function saveOrderEmailCopy(copy: OrderEmailCopy): Promise<void> {
  await ensureSettingsReady();
  const sql = getSql();
  const clean = mergeOrderEmailCopy(copy);
  await sql`
    insert into store_settings (key, value, updated_at)
    values (${ORDER_EMAIL_KEY}, ${JSON.stringify(clean)}::jsonb, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;
}
