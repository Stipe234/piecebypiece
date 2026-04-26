import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const OWNER_COOKIE = "pbp-owner-session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/owner/login")) {
    return NextResponse.next();
  }

  if (!request.cookies.has(OWNER_COOKIE)) {
    const loginUrl = new URL("/owner/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*"],
};
