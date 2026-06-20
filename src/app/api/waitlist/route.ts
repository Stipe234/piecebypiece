import { NextResponse } from "next/server";
import { addWaitlistSignup, isValidEmail } from "@/lib/waitlist";
import { sendWaitlistEmails } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: unknown; source?: unknown; locale?: unknown; material?: unknown; style?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const source = typeof body.source === "string" ? body.source.slice(0, 40) : null;
  const material = typeof body.material === "string" ? body.material.slice(0, 40) : null;
  const style = typeof body.style === "string" ? body.style.slice(0, 40) : null;

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const { created, signup } = await addWaitlistSignup(email, source, "en", material, style);

    // Only email a fresh signup. We must await: on serverless the function is
    // frozen once the response returns, which kills any in-flight email request.
    // sendWaitlistEmails never throws (Promise.allSettled), so this can't fail the signup.
    if (created) {
      await sendWaitlistEmails({ email: signup.email, source });
    }

    return NextResponse.json({ ok: true, alreadyJoined: !created });
  } catch (error) {
    console.error("[waitlist] failed to save signup", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
