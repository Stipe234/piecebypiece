/**
 * Croatian fiscalization via Solo (solo.com.hr) REST API.
 *
 * Stripe does NOT fiscalize — under the Croatian Fiscalization Act every B2C sale
 * must be reported to the Tax Administration, which returns a JIR; the invoice
 * must also carry a locally-generated ZKI and a QR code. Solo does all of that
 * (it holds the FINA certificate and talks to CIS); we call its API when a Stripe
 * payment succeeds and store what it returns.
 *
 * Required env to actually fiscalize:
 *   SOLO_API_TOKEN     — API token from Solo → Postavke
 *   SOLO_TIP_USLUGE    — service-type id from Solo → Usluge → Tipovi usluga
 *   SOLO_TIP_KUPCA     — customer type that selects an F1 (B2C) invoice; from
 *                        Solo → "Tipovi kupaca" (the private-consumer / građanin value)
 * Optional:
 *   SOLO_PDV_RATE      — VAT rate applied to every line: 0, 5, 13 or 25 (default "25").
 *                        Set 0 if you are NOT in the VAT system (paušalac) and your
 *                        Solo account is configured for VAT exemption.
 *
 * Business premises (poslovnica), payment device and the FINA certificate are
 * configured once inside the Solo account, not per request — so they are not env.
 *
 * If SOLO_API_TOKEN is missing, fiscalization is skipped (a warning is logged) so
 * the shop keeps working before Solo is wired up — exactly like email in email.ts.
 */

import { randomUUID } from "node:crypto";
import { getSql } from "@/lib/db";

const SOLO_INVOICE_ENDPOINT = "https://api.solo.com.hr/racun";
const SOLO_STORNO_ENDPOINT = "https://api.solo.com.hr/storno";

// Solo payment-method ids (nacin_placanja). Every Stripe payment here is a card
// payment (checkout is created with payment_method_types: ["card"]).
const SOLO_NACIN_PLACANJA_CARD = 3;
// Invoice type: 3 = "bez oznake" — the plain retail invoice for a private
// consumer (R1/R2 are for business buyers, which we never have).
const SOLO_TIP_RACUNA_B2C = 3;

export type FiscalStatus =
  | "pending" // row created, Solo not yet called (or mid-retry)
  | "fiscalized" // JIR received
  | "awaiting_jir" // Solo issued the invoice with a ZKI but CIS was down — JIR pending
  | "failed" // Solo/CIS call failed; retryable
  | "storno" // a full refund was reversed with a storno invoice
  | "storno_failed"; // refund happened but the storno call failed; needs attention

export interface FiscalRecord {
  orderId: string;
  status: FiscalStatus;
  soloInvoiceId: string | null;
  brojRacuna: string | null;
  jir: string | null;
  zki: string | null;
  pdfUrl: string | null;
}

export function isSoloConfigured(): boolean {
  return Boolean(process.env.SOLO_API_TOKEN);
}

interface SoloConfig {
  token: string;
  tipUsluge: string;
  tipKupca: string;
  pdvRate: number;
  sendNetPrices: boolean;
}

function getSoloConfig(): SoloConfig {
  const token = process.env.SOLO_API_TOKEN;
  const tipUsluge = process.env.SOLO_TIP_USLUGE;
  const tipKupca = process.env.SOLO_TIP_KUPCA;

  if (!token) throw new Error("SOLO_API_TOKEN is not set");
  if (!tipUsluge) throw new Error("SOLO_TIP_USLUGE is not set");
  if (!tipKupca) throw new Error("SOLO_TIP_KUPCA is not set");

  const pdvRate = Number(process.env.SOLO_PDV_RATE ?? "25");
  if (![0, 5, 13, 25].includes(pdvRate)) {
    throw new Error(`SOLO_PDV_RATE must be one of 0, 5, 13, 25 (got ${process.env.SOLO_PDV_RATE})`);
  }

  // Our catalog prices are what the customer actually pays — VAT included.
  // Solo's `cijena_x` is a NET unit price and it adds `porez_stopa_x` on top, so
  // we divide the VAT back out before sending. Set SOLO_SEND_NET_PRICES=false
  // only if a test invoice proves the account expects VAT-inclusive prices.
  const sendNetPrices = (process.env.SOLO_SEND_NET_PRICES ?? "true") !== "false";

  return { token, tipUsluge, tipKupca, pdvRate, sendNetPrices };
}

/**
 * Convert a VAT-inclusive (gross) amount to the net amount Solo expects.
 * €60.00 at 25% -> €48.00 net + €12.00 VAT = €60.00 gross, so the fiscal
 * invoice total matches what Stripe charged instead of adding 25% on top.
 */
function toNetCents(grossCents: number, pdvRate: number): number {
  if (pdvRate <= 0) return grossCents;
  return Math.round(grossCents / (1 + pdvRate / 100));
}

/** Format cents as Solo's amount string, e.g. 123450 -> "1.234,50". */
function formatSoloAmount(cents: number): string {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100).toString();
  const frac = (abs % 100).toString().padStart(2, "0");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negative ? "-" : ""}${grouped},${frac}`;
}

let schemaReady: Promise<void> | null = null;

async function ensureFiscalReady() {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = (async () => {
      // One fiscalization record per order. Unique(order_id) is the idempotency
      // key: a Stripe webhook redelivery can never create a second invoice.
      await sql`
        create table if not exists fiscal_invoices (
          id text primary key,
          order_id text not null unique references orders(id) on delete cascade,
          stripe_session_id text,
          stripe_payment_intent_id text,
          status text not null default 'pending' check (status in (
            'pending', 'fiscalized', 'awaiting_jir', 'failed', 'storno', 'storno_failed'
          )),
          solo_invoice_id text,
          broj_racuna text,
          jir text,
          zki text,
          pdf_url text,
          amount_total_cents integer not null default 0,
          currency text not null default 'eur',
          storno_solo_id text,
          storno_jir text,
          storno_zki text,
          attempts integer not null default 0,
          last_error text,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          fiscalized_at timestamptz,
          storno_at timestamptz
        )
      `;
    })();
  }
  await schemaReady;
}

interface OrderForFiscalization {
  orderId: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  customerEmail: string | null;
  customerName: string | null;
  amountTotalCents: number;
  currency: string;
  items: Array<{
    productName: string;
    material: string;
    style: string | null;
    length: string;
    quantity: number;
    unitPriceCents: number;
  }>;
}

async function loadOrderForFiscalization(orderId: string): Promise<OrderForFiscalization | null> {
  const sql = getSql();

  const orderRows = await sql<{
    id: string;
    stripe_session_id: string;
    stripe_payment_intent_id: string | null;
    customer_email: string | null;
    customer_name: string | null;
    amount_total_cents: number;
    currency: string;
  }[]>`
    select id, stripe_session_id, stripe_payment_intent_id, customer_email,
           customer_name, amount_total_cents, currency
    from orders
    where id = ${orderId}
    limit 1
  `;

  const order = orderRows[0];
  if (!order) return null;

  const itemRows = await sql<{
    product_name: string;
    material: string;
    style: string | null;
    length: string;
    quantity: number;
    unit_price_cents: number;
  }[]>`
    select product_name, material, style, length, quantity, unit_price_cents
    from order_items
    where order_id = ${orderId}
  `;

  return {
    orderId: order.id,
    stripeSessionId: order.stripe_session_id,
    stripePaymentIntentId: order.stripe_payment_intent_id,
    customerEmail: order.customer_email,
    customerName: order.customer_name,
    amountTotalCents: order.amount_total_cents,
    currency: order.currency,
    items: itemRows.map((row) => ({
      productName: row.product_name,
      material: row.material,
      style: row.style,
      length: row.length,
      quantity: row.quantity,
      unitPriceCents: row.unit_price_cents,
    })),
  };
}

interface SoloInvoiceResponse {
  status?: number;
  message?: string;
  racun?: {
    id?: string;
    broj_racuna?: string;
    zki?: string;
    jir?: string;
    pdf?: string;
    bruto_suma?: string;
  };
}

/** Build the form-encoded body Solo expects for an F1 (B2C) invoice. */
function buildInvoiceBody(order: OrderForFiscalization, config: SoloConfig): URLSearchParams {
  const body = new URLSearchParams();
  body.set("token", config.token);
  body.set("tip_usluge", config.tipUsluge);
  body.set("tip_racuna", String(SOLO_TIP_RACUNA_B2C));
  body.set("tip_kupca", config.tipKupca);
  body.set("nacin_placanja", String(SOLO_NACIN_PLACANJA_CARD));

  const lines: Array<{ description: string; unitPriceCents: number; quantity: number }> = order.items.map(
    (item) => ({
      description: [item.productName, item.material, item.style, item.length]
        .filter((part) => part && String(part).trim())
        .join(" / "),
      unitPriceCents: item.unitPriceCents,
      quantity: item.quantity,
    }),
  );

  // The customer paid amount_total (which for home delivery includes the GLS fee,
  // collected by Stripe as a shipping line — never in our order_items). Add a
  // delivery line so the fiscal invoice total equals what was actually charged.
  const itemsSum = order.items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
  const deliveryCents = order.amountTotalCents - itemsSum;
  if (deliveryCents > 0) {
    lines.push({ description: "Dostava (GLS)", unitPriceCents: deliveryCents, quantity: 1 });
  }

  body.set("usluga", String(lines.length));
  lines.forEach((line, index) => {
    const i = index + 1;
    // Our prices are VAT-inclusive; Solo adds VAT on top of `cijena_x`, so send
    // the net unit price and let it rebuild the same gross total.
    const unitPriceForSolo = config.sendNetPrices
      ? toNetCents(line.unitPriceCents, config.pdvRate)
      : line.unitPriceCents;

    body.set(`opis_usluge_${i}`, line.description.slice(0, 500));
    body.set(`cijena_${i}`, formatSoloAmount(unitPriceForSolo));
    body.set(`kolicina_${i}`, String(line.quantity));
    body.set(`porez_stopa_${i}`, String(config.pdvRate));
  });

  return body;
}

/**
 * Fiscalize one order via Solo, exactly once.
 *
 * Idempotent: the unique fiscal_invoices row is created first, so concurrent or
 * repeated calls for the same order can't produce two invoices; an order already
 * fiscalized (or stornoed) short-circuits. Returns the record, or null when Solo
 * isn't configured yet. Throws only on an unexpected internal error — a Solo/CIS
 * failure is recorded as 'failed' and returned for the retry job to pick up.
 */
export async function fiscalizeOrder(orderId: string): Promise<FiscalRecord | null> {
  if (!isSoloConfigured()) {
    console.warn("[solo] SOLO_API_TOKEN not set — skipping fiscalization of order", orderId);
    return null;
  }

  await ensureFiscalReady();
  const sql = getSql();

  const order = await loadOrderForFiscalization(orderId);
  if (!order) {
    console.error("[solo] order not found for fiscalization:", orderId);
    return null;
  }

  // Claim the order: insert the pending row, or read the existing one. If it's
  // already done, we're finished — this is the exactly-once guard.
  const claimed = await sql<{
    status: FiscalStatus;
    solo_invoice_id: string | null;
    broj_racuna: string | null;
    jir: string | null;
    zki: string | null;
    pdf_url: string | null;
  }[]>`
    insert into fiscal_invoices (
      id, order_id, stripe_session_id, stripe_payment_intent_id,
      amount_total_cents, currency, status
    )
    values (
      ${randomUUID()}, ${order.orderId}, ${order.stripeSessionId}, ${order.stripePaymentIntentId},
      ${order.amountTotalCents}, ${order.currency}, 'pending'
    )
    on conflict (order_id) do update set updated_at = now()
    returning status, solo_invoice_id, broj_racuna, jir, zki, pdf_url
  `;

  const existing = claimed[0];
  if (existing && (existing.status === "fiscalized" || existing.status === "storno")) {
    return {
      orderId: order.orderId,
      status: existing.status,
      soloInvoiceId: existing.solo_invoice_id,
      brojRacuna: existing.broj_racuna,
      jir: existing.jir,
      zki: existing.zki,
      pdfUrl: existing.pdf_url,
    };
  }

  // Croatian fiscal invoices must be in EUR. If Stripe ever settles in another
  // currency (e.g. Adaptive Pricing left on), refuse rather than fiscalize a
  // wrong-currency invoice — this is flagged for the owner to fix in Stripe.
  if (order.currency.toLowerCase() !== "eur") {
    const message = `Order currency is ${order.currency.toUpperCase()}, not EUR — refusing to fiscalize. Disable Stripe Adaptive Pricing.`;
    await markFailed(order.orderId, message);
    console.error("[solo]", message, order.orderId);
    return { orderId: order.orderId, status: "failed", soloInvoiceId: null, brojRacuna: null, jir: null, zki: null, pdfUrl: null };
  }

  const config = getSoloConfig();
  const body = buildInvoiceBody(order, config);

  try {
    const res = await fetch(SOLO_INVOICE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = (await res.json().catch(() => ({}))) as SoloInvoiceResponse;
    const racun = data.racun;

    // Success needs both HTTP ok and an invoice with at least a ZKI. A ZKI but no
    // JIR means Solo issued the invoice while CIS was unreachable (the legal
    // offline case): it's valid, and Solo delivers the JIR within 48h — we mark
    // it 'awaiting_jir' so the retry job can refresh it.
    if (!res.ok || data.status !== 0 || !racun?.zki) {
      const message = data.message || `Solo returned status ${res.status}`;
      await markFailed(order.orderId, message);
      console.error("[solo] fiscalization failed for order", order.orderId, message);
      return { orderId: order.orderId, status: "failed", soloInvoiceId: null, brojRacuna: null, jir: null, zki: null, pdfUrl: null };
    }

    const hasJir = Boolean(racun.jir);
    const status: FiscalStatus = hasJir ? "fiscalized" : "awaiting_jir";

    await sql`
      update fiscal_invoices set
        status = ${status},
        solo_invoice_id = ${racun.id ?? null},
        broj_racuna = ${racun.broj_racuna ?? null},
        jir = ${racun.jir ?? null},
        zki = ${racun.zki},
        pdf_url = ${racun.pdf ?? null},
        last_error = null,
        attempts = attempts + 1,
        updated_at = now(),
        fiscalized_at = coalesce(fiscalized_at, ${hasJir ? sql`now()` : null})
      where order_id = ${order.orderId}
    `;

    // Safety net: the fiscal total must equal what Stripe charged. A mismatch
    // usually means the VAT (gross vs net) config is off — surface it loudly.
    if (racun.bruto_suma) {
      const bruto = Math.round(Number(racun.bruto_suma.replace(/\./g, "").replace(",", ".")) * 100);
      if (Number.isFinite(bruto) && Math.abs(bruto - order.amountTotalCents) > 1) {
        console.error(
          `[solo] TOTAL MISMATCH on order ${order.orderId}: invoice ${bruto} vs charged ${order.amountTotalCents} cents — check SOLO_PDV_RATE / gross-vs-net.`,
        );
      }
    }

    return {
      orderId: order.orderId,
      status,
      soloInvoiceId: racun.id ?? null,
      brojRacuna: racun.broj_racuna ?? null,
      jir: racun.jir ?? null,
      zki: racun.zki,
      pdfUrl: racun.pdf ?? null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown fiscalization error";
    await markFailed(order.orderId, message);
    console.error("[solo] fiscalization threw for order", order.orderId, message);
    return { orderId: order.orderId, status: "failed", soloInvoiceId: null, brojRacuna: null, jir: null, zki: null, pdfUrl: null };
  }
}

async function markFailed(orderId: string, message: string) {
  const sql = getSql();
  await sql`
    update fiscal_invoices set
      status = case when status in ('fiscalized', 'storno') then status else 'failed' end,
      last_error = ${message.slice(0, 1000)},
      attempts = attempts + 1,
      updated_at = now()
    where order_id = ${orderId}
  `;
}

interface SoloStornoResponse {
  status?: number;
  message?: string;
  racun?: { id?: string; jir?: string; zki?: string };
}

/**
 * Reverse a fiscalized sale after a Stripe refund.
 *
 * A refund is never a deletion in Croatian law — you issue a corrective document
 * that is itself fiscalized. Solo's /storno cancels the whole invoice, so we call
 * it on a FULL refund. A PARTIAL refund legally needs a credit note (odobrenje)
 * for the refunded portion, which /storno can't express — we flag it for manual
 * handling rather than silently doing the wrong thing.
 */
export async function stornoOrderByPaymentIntent(
  paymentIntentId: string,
  fullyRefunded: boolean,
): Promise<void> {
  if (!isSoloConfigured()) return;
  await ensureFiscalReady();
  const sql = getSql();

  const rows = await sql<{ order_id: string; status: FiscalStatus; solo_invoice_id: string | null }[]>`
    select order_id, status, solo_invoice_id
    from fiscal_invoices
    where stripe_payment_intent_id = ${paymentIntentId}
    limit 1
  `;

  const record = rows[0];
  if (!record) {
    console.warn("[solo] refund for a sale with no fiscal invoice on file:", paymentIntentId);
    return;
  }
  if (record.status === "storno") return; // already reversed
  if (record.status !== "fiscalized" && record.status !== "awaiting_jir") {
    console.warn("[solo] refund on an order that was never fiscalized — nothing to storno:", record.order_id);
    return;
  }

  if (!fullyRefunded) {
    console.warn(
      `[solo] PARTIAL refund on order ${record.order_id} — issue a credit note (odobrenje) in Solo manually; /storno only cancels the full invoice.`,
    );
    return;
  }

  if (!record.solo_invoice_id) {
    console.error("[solo] cannot storno order without a Solo invoice id:", record.order_id);
    return;
  }

  const config = getSoloConfig();
  const body = new URLSearchParams();
  body.set("token", config.token);
  body.set("id", record.solo_invoice_id);

  try {
    const res = await fetch(SOLO_STORNO_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json().catch(() => ({}))) as SoloStornoResponse;

    if (!res.ok || data.status !== 0) {
      const message = data.message || `Solo storno returned status ${res.status}`;
      await sql`
        update fiscal_invoices set status = 'storno_failed', last_error = ${message.slice(0, 1000)}, updated_at = now()
        where order_id = ${record.order_id}
      `;
      console.error("[solo] storno failed for order", record.order_id, message);
      return;
    }

    await sql`
      update fiscal_invoices set
        status = 'storno',
        storno_solo_id = ${data.racun?.id ?? null},
        storno_jir = ${data.racun?.jir ?? null},
        storno_zki = ${data.racun?.zki ?? null},
        storno_at = now(),
        last_error = null,
        updated_at = now()
      where order_id = ${record.order_id}
    `;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown storno error";
    await sql`
      update fiscal_invoices set status = 'storno_failed', last_error = ${message.slice(0, 1000)}, updated_at = now()
      where order_id = ${record.order_id}
    `;
    console.error("[solo] storno threw for order", record.order_id, message);
  }
}

export interface RetryResult {
  attempted: number;
  fiscalized: number;
  stillPending: number;
}

/**
 * Re-run fiscalization for anything unfinished: orders that were paid but never
 * got a fiscal row (a crash between recording the order and fiscalizing), and
 * rows left 'failed' or 'awaiting_jir' by an earlier CIS outage. Meant to be
 * called on a schedule (e.g. a Vercel Cron every few minutes) so the legal 48h
 * window is always met. Only recent orders are considered.
 */
export async function retryPendingFiscalizations(limit = 25): Promise<RetryResult> {
  if (!isSoloConfigured()) return { attempted: 0, fiscalized: 0, stillPending: 0 };
  await ensureFiscalReady();
  const sql = getSql();

  const rows = await sql<{ id: string }[]>`
    select o.id
    from orders o
    left join fiscal_invoices f on f.order_id = o.id
    where o.paid_at is not null
      and o.refunded_at is null
      and (f.id is null or f.status in ('pending', 'failed', 'awaiting_jir'))
      and o.created_at > now() - interval '10 days'
    order by o.created_at asc
    limit ${limit}
  `;

  let fiscalized = 0;
  let stillPending = 0;
  for (const row of rows) {
    const result = await fiscalizeOrder(row.id);
    if (result?.status === "fiscalized") fiscalized += 1;
    else stillPending += 1;
  }

  return { attempted: rows.length, fiscalized, stillPending };
}
