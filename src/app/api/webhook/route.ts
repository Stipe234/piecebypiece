import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  completeReservationFromSession,
  markOrderRefundedByPaymentIntent,
  releaseReservationBySession,
} from "@/lib/inventory";

export const runtime = "nodejs";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await completeReservationFromSession(session);
      console.log("Payment successful!", {
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
      });
      break;
    }
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await releaseReservationBySession(session.id);
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = typeof charge.payment_intent === "string"
        ? charge.payment_intent
        : charge.payment_intent?.id ?? null;

      if (paymentIntentId && typeof charge.amount_refunded === "number") {
        await markOrderRefundedByPaymentIntent(paymentIntentId, charge.amount_refunded);
      }
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
