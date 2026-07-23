import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  completeReservationFromSession,
  markOrderRefundedByPaymentIntent,
  releaseReservationBySession,
} from "@/lib/inventory";
import { sendInvoiceEmail, sendOrderConfirmationEmail } from "@/lib/email";
import { fiscalizeOrder, stornoOrderByPaymentIntent } from "@/lib/solo";

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
      const order = await completeReservationFromSession(session);
      console.log("Payment successful!", {
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
      });
      // A newly-recorded order returns a summary; a Stripe webhook retry returns
      // null (order already exists), so the confirmation is sent exactly once.
      // Never let email trouble fail the webhook — the order is already saved,
      // and a 500 would make Stripe retry without ever re-sending the email.
      if (order?.customerEmail) {
        try {
          await sendOrderConfirmationEmail({
            to: order.customerEmail,
            customerName: order.customerName,
            items: order.items,
            amountTotalCents: order.amountTotalCents,
            currency: order.currency,
            fulfillment: order.fulfillment,
          });
        } catch (err) {
          console.error("[webhook] order confirmation email failed", err);
        }
      }

      // Fiscalize the sale (Croatian legal requirement) exactly once — `order` is
      // non-null only for a newly-recorded order, so a webhook retry won't
      // re-fiscalize. Never let fiscalization fail the webhook: the order is
      // saved, and a failed attempt is stored for the retry job (48h window).
      if (order) {
        try {
          const fiscal = await fiscalizeOrder(order.orderId);
          if (fiscal?.status === "fiscalized" && order.customerEmail) {
            await sendInvoiceEmail({
              to: order.customerEmail,
              customerName: order.customerName,
              brojRacuna: fiscal.brojRacuna,
              pdfUrl: fiscal.pdfUrl,
            });
          }
        } catch (err) {
          console.error("[webhook] fiscalization failed", err);
        }
      }
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

        // Reverse the fiscal invoice. A full refund gets a storno; a partial
        // refund is flagged for a manual credit note (odobrenje). Never let this
        // fail the webhook — the refund is already recorded.
        try {
          const fullyRefunded = charge.amount_refunded >= charge.amount;
          await stornoOrderByPaymentIntent(paymentIntentId, fullyRefunded);
        } catch (err) {
          console.error("[webhook] storno failed", err);
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
