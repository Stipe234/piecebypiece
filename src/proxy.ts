import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const OWNER_COOKIE = "pbp-owner-session";
const UNLOCK_COOKIE = "pbp-unlock";

/**
 * Temporary "coming soon" gate for the public storefront.
 *
 * Turn it on by setting SITE_LOCKED=true (in Vercel only — leave it unset
 * locally so development is unaffected). Visitors get a branded holding page
 * with HTTP 503, which marks the outage as temporary and keeps the shop from
 * being indexed in this state.
 *
 * To browse the real site while it's locked, open:
 *   https://your-domain/?unlock=<SITE_UNLOCK_TOKEN>
 * That sets a cookie so you can shop normally; everyone else keeps seeing the
 * holding page. Unset SITE_LOCKED to lift it for everyone.
 *
 * /api/* is deliberately never gated — Stripe webhooks and the fiscalization
 * cron must keep working while the storefront is hidden. /owner/* is also
 * exempt: it has its own login.
 */
function comingSoonHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Piece by Piece — Coming soon</title>
  <style>
    html, body { margin: 0; padding: 0; background: #f4f0e8; }
    body {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      font-family: Georgia, "Times New Roman", serif; color: #1a1a1a; text-align: center; padding: 24px;
    }
    .wrap { max-width: 420px; }
    .brand { font-size: 13px; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
    .rule { width: 32px; height: 1px; background: #c9a96e; margin: 28px auto; }
    h1 { font-weight: normal; font-size: 30px; line-height: 1.25; margin: 0 0 16px; }
    p { font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.8; color: #2a2724; margin: 0; }
  </style>
</head>
<body>
  <div class="wrap">
    <p class="brand">Piece&nbsp;by&nbsp;Piece</p>
    <div class="rule"></div>
    <h1>Back very soon.</h1>
    <p>We're putting the finishing touches to the shop. Thank you for your patience.</p>
  </div>
</body>
</html>`;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Owner dashboard: unchanged behaviour, and still reachable while the shop is
  // locked because it is already behind its own login.
  if (pathname.startsWith("/owner")) {
    if (pathname.startsWith("/owner/login")) {
      return NextResponse.next();
    }

    if (!request.cookies.has(OWNER_COOKIE)) {
      const loginUrl = new URL("/owner/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (process.env.SITE_LOCKED !== "true") {
    return NextResponse.next();
  }

  const token = process.env.SITE_UNLOCK_TOKEN;
  const url = request.nextUrl;

  // ?unlock=<token> drops a cookie, then reloads the clean URL.
  if (token && url.searchParams.get("unlock") === token) {
    const clean = new URL(url);
    clean.searchParams.delete("unlock");
    const response = NextResponse.redirect(clean);
    response.cookies.set(UNLOCK_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  if (token && request.cookies.get(UNLOCK_COOKIE)?.value === token) {
    return NextResponse.next();
  }

  return new NextResponse(comingSoonHtml(), {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "retry-after": "3600",
    },
  });
}

export const config = {
  // Gate pages only. Skip /api (Stripe webhook + fiscalization cron), Next
  // internals, and static assets.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|mp4|ico|txt|xml|webmanifest)$).*)",
  ],
};
