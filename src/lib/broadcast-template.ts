/**
 * Branded HTML for owner broadcasts. Pure and side-effect free so it can run on
 * the server (real send) AND in the client dashboard (live preview) — both use
 * this exact function, so what the owner previews is what subscribers receive.
 */

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Split a textarea body into paragraphs on blank lines (shared by send + preview). */
export function splitParagraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function broadcastHtml(opts: { eyebrow?: string; heading: string; body: string }): string {
  const paragraphs = splitParagraphs(opts.body);
  const list = paragraphs.length > 0 ? paragraphs : [""];
  const renderedParagraphs = list
    .map((p, i) => {
      const margin = i === list.length - 1 ? "0" : "0 0 18px 0";
      const text = escapeHtml(p).replace(/\n/g, "<br />");
      return `              <p style="margin:${margin};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.85;color:#2a2724;">${text}</p>`;
    })
    .join("\n");

  const eyebrow = opts.eyebrow?.trim();
  const eyebrowMarkup = eyebrow
    ? `<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#6b6660;">${escapeHtml(eyebrow)}</p>`
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
              ${eyebrowMarkup}
              <h1 style="margin:${eyebrow ? "14px" : "0"} 0 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:32px;line-height:1.2;color:#1a1a1a;">${escapeHtml(opts.heading)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 44px 0 44px;">
${renderedParagraphs}
            </td>
          </tr>
          <tr>
            <td style="padding:30px 44px 40px 44px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:16px;color:#2a2724;">With love,</p>
              <p style="margin:4px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:16px;letter-spacing:2px;color:#1a1a1a;">Piece by Piece</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 44px 40px 44px;">
              <div style="height:1px;background-color:#e6e0d6;margin-bottom:18px;"></div>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.7;color:#9c968c;">You're receiving this because you joined the Piece by Piece waitlist. Reply to this email if you'd prefer not to receive updates.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
