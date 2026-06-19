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
export async function sendWaitlistEmails(opts: { email: string; source: string | null }) {
  await Promise.allSettled([
    sendEmail({
      to: opts.email,
      subject: "Welcome — Piece by Piece",
      html: welcomeHtml(),
    }),
    sendEmail({
      to: getOwnerEmail(),
      replyTo: opts.email,
      subject: `New waitlist signup — ${opts.email}`,
      html: ownerHtml(opts.email, opts.source),
    }),
  ]);
}

const COPY = {
  eyebrow: "Built Over Time",
  title: "You're on the list.",
  p1: "Thank you for joining. You're now among the first to know when Piece 001 opens.",
  p2: "Piece by Piece is built on a simple idea: the best jewelry collections aren't bought all at once. They're collected slowly, intentionally, and personally — one piece at a time.",
  p3: "We'll write to you before anyone else, the moment the first edition is ready. No noise in between.",
  signoff: "With warmth,",
  team: "Piece by Piece",
  footer: "You're receiving this because you joined the waitlist at piecebypiecewear.com.",
};

function welcomeHtml() {
  const c = COPY;
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
              <p style="margin:0 0 18px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.85;color:#2a2724;">${c.p1}</p>
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

function ownerHtml(email: string, source: string | null) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f0e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0e8;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fcfaf5;border:1px solid #e6e0d6;">
        <tr><td style="padding:32px 36px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#6b6660;">New waitlist signup</p>
          <p style="margin:16px 0 0 0;font-family:Georgia,serif;font-size:24px;color:#1a1a1a;">${email}</p>
          <p style="margin:18px 0 0 0;font-family:Arial,sans-serif;font-size:13px;color:#6b6660;">Source: ${source ?? "—"}</p>
          <p style="margin:6px 0 0 0;font-family:Arial,sans-serif;font-size:13px;color:#6b6660;">Reply to this email to write back directly.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
