import { NextResponse } from "next/server";
import { renderOrderConfirmationEmail } from "@/lib/email";
import { getOrderEmailCopy } from "@/lib/settings";
import { GLS_DELIVERY_CENTS } from "@/lib/shipping";

export const runtime = "nodejs";

/**
 * Development-only preview of the order-confirmation ("thank you") email, so the
 * exact template that customers receive can be checked in a browser without
 * sending anything. Never available in production.
 *
 *   http://localhost:3000/api/dev/email-preview
 *   ?name=Ana&fulfillment=pickup   — tweak the sample order
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? "Ana";
  const fulfillment = searchParams.get("fulfillment") === "pickup" ? "pickup" : "delivery";

  // Mirrors the real catalog: Gold / Dangling / One size at €65.
  const items = [
    {
      name: "Piece 001",
      material: "Gold",
      style: "Dangling",
      length: "One size",
      quantity: 1,
      unitPriceCents: 6500,
    },
  ];

  const itemsTotal = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
  const deliveryCents = fulfillment === "delivery" ? GLS_DELIVERY_CENTS : 0;

  const copy = await getOrderEmailCopy();
  const html = renderOrderConfirmationEmail(
    { customerName: name, items, amountTotalCents: itemsTotal + deliveryCents, currency: "eur", fulfillment },
    copy,
  );

  return new NextResponse(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
