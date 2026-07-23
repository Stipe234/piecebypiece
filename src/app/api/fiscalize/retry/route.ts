import { NextResponse } from "next/server";
import { retryPendingFiscalizations } from "@/lib/solo";

export const runtime = "nodejs";

/**
 * Re-attempts any sale that hasn't been fiscalized yet — orders left behind by a
 * CIS outage or a crash between recording the order and calling Solo. Runs the
 * fiscalization within the legal 48h window without a customer waiting.
 *
 * Protect it with FISCAL_RETRY_SECRET and call it on a schedule, e.g. a Vercel
 * Cron every few minutes:
 *   vercel.json → { "crons": [{ "path": "/api/fiscalize/retry", "schedule": "*\/10 * * * *" }] }
 * and set the Authorization header (or configure the cron with the same secret).
 */
function authorized(request: Request): boolean {
  const header = request.headers.get("authorization");
  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET`; FISCAL_RETRY_SECRET
  // covers manual/curl triggers. Either matching secret is accepted.
  const secrets = [process.env.FISCAL_RETRY_SECRET, process.env.CRON_SECRET].filter(Boolean);
  return secrets.length > 0 && secrets.some((secret) => header === `Bearer ${secret}`);
}

async function handle(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await retryPendingFiscalizations();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Retry failed";
    console.error("[fiscalize/retry]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET so a plain Vercel Cron can trigger it; POST for manual/curl use.
export const GET = handle;
export const POST = handle;
