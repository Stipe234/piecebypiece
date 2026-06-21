/**
 * Transactional email via Resend's REST API (no SDK dependency).
 *
 * Required env to actually send:
 *   RESEND_API_KEY       — from resend.com
 *   WAITLIST_FROM        — verified sender, e.g. "Piece by Piece <info@piecebypiecewear.com>"
 *   OWNER_NOTIFY_EMAIL   — where signup notifications land, e.g. "info@piecebypiecewear.com"
 *
 * If RESEND_API_KEY is missing, sending is skipped silently (signups are still
 * saved to the database), so the form keeps working before email is configured.
 */

import { broadcastHtml, escapeHtml } from "./broadcast-template";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function getFrom() {
  return process.env.WAITLIST_FROM || "Piece by Piece <info@piecebypiecewear.com>";
}

function getOwnerEmail() {
  return process.env.OWNER_NOTIFY_EMAIL || "info@piecebypiecewear.com";
}

async function sendEmail(payload: { to: string; subject: string; html: string; replyTo?: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping send to", payload.to);
    return { sent: false as const, skipped: true as const };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getFrom(),
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend error", res.status, body);
      return { sent: false as const, skipped: false as const };
    }
    return { sent: true as const, skipped: false as const };
  } catch (error) {
    console.error("[email] Resend request failed", error);
    return { sent: false as const, skipped: false as const };
  }
}

/** Fire welcome + owner-notification emails. Best effort — never throws. */
export async function sendWaitlistEmails(opts: { email: string; firstName?: string | null; source: string | null }) {
  await Promise.allSettled([
    sendEmail({
      to: opts.email,
      subject: "You're on the list — Piece by Piece",
      html: welcomeHtml(opts.firstName),
    }),
    sendEmail({
      to: getOwnerEmail(),
      replyTo: opts.email,
      subject: `New waitlist signup — ${opts.email}`,
      html: ownerHtml(opts.email, opts.source, opts.firstName),
    }),
  ]);
}

function firstNameOf(fullName: string | null | undefined): string | null {
  const n = fullName?.trim();
  if (!n) return null;
  return n.split(/\s+/)[0];
}

/** Branded shell for order-status emails: heading, paragraphs, optional CTA button. */
function orderEmailHtml(opts: {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  button?: { label: string; url: string };
}): string {
  // Only allow http(s) links — never render an unsafe href.
  const safeUrl = opts.button && /^https?:\/\//i.test(opts.button.url) ? opts.button.url : null;
  const renderedParagraphs = opts.paragraphs
    .map((p, i) => {
      const isLast = i === opts.paragraphs.length - 1 && !safeUrl;
      const margin = isLast ? "0" : "0 0 18px 0";
      return `              <p style="margin:${margin};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.85;color:#2a2724;">${escapeHtml(p)}</p>`;
    })
    .join("\n");

  const buttonRow = safeUrl
    ? `
          <tr>
            <td style="padding:26px 44px 0 44px;">
              <a href="${escapeHtml(safeUrl)}" style="display:inline-block;background-color:#1a1a1a;color:#fcfaf5;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:14px 30px;">${escapeHtml(opts.button!.label)}</a>
            </td>
          </tr>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
</head>
<body style="margin:0;padding:0;background-color:#f4f0e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f0e8;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#fcfaf5;border:1px solid #e6e0d6;">
          <tr>
            <td align="center" style="padding:36px 40px 0 40px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#000000;">Piece&nbsp;by&nbsp;Piece</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:28px 40px 0 40px;">
              <div style="width:32px;height:1px;background-color:#c9a96e;margin:0 auto;"></div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 40px 0 40px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#6b6660;">${escapeHtml(opts.eyebrow)}</p>
              <h1 style="margin:14px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:32px;line-height:1.2;color:#1a1a1a;">${escapeHtml(opts.heading)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 44px 0 44px;">
${renderedParagraphs}
            </td>
          </tr>${buttonRow}
          <tr>
            <td style="padding:30px 44px 40px 44px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:16px;color:#2a2724;">With love,</p>
              <p style="margin:4px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:16px;letter-spacing:2px;color:#1a1a1a;">Piece by Piece</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 44px 40px 44px;">
              <div style="height:1px;background-color:#e6e0d6;margin-bottom:18px;"></div>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.7;color:#9c968c;">You're receiving this because you placed an order at piecebypiecewear.com. Reply to this email if you need anything.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Email the customer when their order is packed, shipped, or delivered. Best effort. */
export async function sendOrderStatusEmail(opts: {
  to: string;
  customerName: string | null;
  status: "packed" | "shipped" | "delivered";
  carrier?: string | null;
  trackingUrl?: string | null;
}): Promise<{ sent: boolean; skipped: boolean }> {
  const first = firstNameOf(opts.customerName);
  const hi = first ? `Hi ${first},` : "Hello,";

  let subject: string;
  let eyebrow: string;
  let heading: string;
  let paragraphs: string[];
  let button: { label: string; url: string } | undefined;

  if (opts.status === "packed") {
    subject = "Your order is packed — Piece by Piece";
    eyebrow = "Your order";
    heading = "It's packed.";
    paragraphs = [
      hi,
      "Your piece has been packed by hand with care, and we've arranged collection with our courier.",
      "As soon as they pick it up, we'll email you a tracking link so you can follow it all the way to your door.",
    ];
  } else if (opts.status === "shipped") {
    subject = "Your order is on its way — Piece by Piece";
    eyebrow = "On its way";
    heading = "Your order has shipped.";
    const via = opts.carrier?.trim() ? ` with ${opts.carrier.trim()}` : "";
    paragraphs = [hi, `Your order is on its way${via}. You can follow its journey using the link below.`];
    if (opts.trackingUrl?.trim()) {
      button = { label: "Track your order", url: opts.trackingUrl.trim() };
    } else {
      paragraphs.push("We'll keep you posted until it arrives.");
    }
  } else {
    subject = "Your order has been delivered — Piece by Piece";
    eyebrow = "Delivered";
    heading = "It's arrived.";
    paragraphs = [
      hi,
      "Your order has been delivered. We hope it becomes part of how you move through your days.",
      "Wear it well — and if anything isn't quite right, just reply to this email.",
    ];
  }

  const html = orderEmailHtml({ eyebrow, heading, paragraphs, button });
  const res = await sendEmail({ to: opts.to, subject, html });
  return { sent: res.sent, skipped: res.skipped === true };
}

const RESEND_BATCH_ENDPOINT = "https://api.resend.com/emails/batch";

export interface BroadcastResult {
  /** Recipients we attempted to send to. */
  total: number;
  /** Messages Resend accepted. */
  sent: number;
  /** Messages Resend rejected or that errored. */
  failed: number;
  /** True when RESEND_API_KEY is missing, so nothing was sent. */
  skipped: boolean;
}

/**
 * Send one branded email to every recipient via Resend's batch endpoint
 * (max 100 messages per request). Each recipient gets their own message, so
 * addresses are never shared. Replies land on the From address (info@…),
 * which forwards to the owner — no reply_to needed. Best effort: never throws.
 */
export async function sendBroadcast(opts: {
  recipients: string[];
  subject: string;
  eyebrow?: string;
  heading: string;
  body: string;
}): Promise<BroadcastResult> {
  const total = opts.recipients.length;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping broadcast to", total, "recipient(s)");
    return { total, sent: 0, failed: 0, skipped: true };
  }
  if (total === 0) {
    return { total: 0, sent: 0, failed: 0, skipped: false };
  }

  const html = broadcastHtml({ eyebrow: opts.eyebrow, heading: opts.heading, body: opts.body });
  const from = getFrom();

  let sent = 0;
  let failed = 0;

  // Resend's batch endpoint accepts at most 100 messages per request.
  for (let i = 0; i < opts.recipients.length; i += 100) {
    const chunk = opts.recipients.slice(i, i + 100);
    const payload = chunk.map((to) => ({ from, to: [to], subject: opts.subject, html }));

    try {
      const res = await fetch(RESEND_BATCH_ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        sent += chunk.length;
      } else {
        failed += chunk.length;
        console.error("[email] broadcast batch error", res.status, await res.text());
      }
    } catch (error) {
      failed += chunk.length;
      console.error("[email] broadcast batch request failed", error);
    }
  }

  return { total, sent, failed, skipped: false };
}

const COPY = {
  eyebrow: "Built Over Time",
  title: "You're in.",
  p1: "Piece by Piece begins with Piece 001, a hand chain drawn in one quiet line from wrist to finger.",
  p2: "Released in limited numbers, it will be shared first with the waitlist.",
  p3: "You'll have early access when it opens.",
  signoff: "With love,",
  team: "Piece by Piece",
  footer: "You're receiving this because you joined the Piece by Piece waitlist.",
};

function welcomeHtml(firstName?: string | null) {
  const c = COPY;
  const name = firstName?.trim();
  const greeting = name
    ? `<p style="margin:0 0 18px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.85;color:#2a2724;">Hi ${escapeHtml(name)},</p>\n              `
    : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
</head>
<body style="margin:0;padding:0;background-color:#f4f0e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f0e8;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#fcfaf5;border:1px solid #e6e0d6;">
          <tr>
            <td align="center" style="padding:36px 40px 0 40px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#000000;">Piece&nbsp;by&nbsp;Piece</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:28px 40px 0 40px;">
              <div style="width:32px;height:1px;background-color:#c9a96e;margin:0 auto;"></div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 40px 0 40px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#6b6660;">${c.eyebrow}</p>
              <h1 style="margin:14px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:34px;line-height:1.2;color:#1a1a1a;">${c.title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 44px 0 44px;">
              ${greeting}<p style="margin:0 0 18px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.85;color:#2a2724;">${c.p1}</p>
              <p style="margin:0 0 18px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.85;color:#2a2724;">${c.p2}</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.85;color:#2a2724;">${c.p3}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 44px 40px 44px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:16px;color:#2a2724;">${c.signoff}</p>
              <p style="margin:4px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:16px;letter-spacing:2px;color:#1a1a1a;">${c.team}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 44px 40px 44px;">
              <div style="height:1px;background-color:#e6e0d6;margin-bottom:18px;"></div>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.7;color:#9c968c;">${c.footer}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ownerHtml(email: string, source: string | null, firstName?: string | null) {
  const name = firstName?.trim();
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f0e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0e8;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fcfaf5;border:1px solid #e6e0d6;">
        <tr><td style="padding:32px 36px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#6b6660;">New waitlist signup</p>
          ${name ? `<p style="margin:16px 0 0 0;font-family:Georgia,serif;font-size:22px;color:#1a1a1a;">${escapeHtml(name)}</p>` : ""}
          <p style="margin:${name ? "4px" : "16px"} 0 0 0;font-family:Georgia,serif;font-size:${name ? "16px" : "24px"};color:${name ? "#6b6660" : "#1a1a1a"};">${email}</p>
          <p style="margin:18px 0 0 0;font-family:Arial,sans-serif;font-size:13px;color:#6b6660;">Source: ${source ?? "—"}</p>
          <p style="margin:6px 0 0 0;font-family:Arial,sans-serif;font-size:13px;color:#6b6660;">Reply to this email to write back directly.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
