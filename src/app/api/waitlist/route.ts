import { NextResponse } from "next/server";
import { addWaitlistSignup, isValidEmail } from "@/lib/waitlist";
import { sendWaitlistEmails } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: unknown; source?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const source = typeof body.source === "string" ? body.source.slice(0, 40) : null;

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const { created, signup } = await addWaitlistSignup(email, source, "en");

    // Only email a fresh signup; never block the response on email delivery.
    if (created) {
      void sendWaitlistEmails({ email: signup.email, source });
    }

    return NextResponse.json({ ok: true, alreadyJoined: !created });
  } catch (error) {
    console.error("[waitlist] failed to save signup", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
