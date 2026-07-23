import { NextResponse } from "next/server";
import { renderOrderConfirmationEmail } from "@/lib/email";
import { getOrderEmailCopy } from "@/lib/settings";
import { isOwnerAuthenticated } from "@/lib/owner-auth";
import { GLS_DELIVERY_CENTS } from "@/lib/shipping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live preview of the order-confirmation ("thank you") email using the copy the
 * owner has saved. Owner-authenticated, so it works in production and is embedded
 * in the dashboard's email editor. Add ?fulfillment=pickup to see that variant.
 */
export async function GET(request: Request) {
  if (!(await isOwnerAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? "Ana";
  const fulfillment = searchParams.get("fulfillment") === "pickup" ? "pickup" : "delivery";

  // A representative order matching the real catalog (Gold / Dangling at €65).
  const items = [
    { name: "Piece 001", material: "Gold", style: "Dangling", length: "One size", quantity: 1, unitPriceCents: 6500 },
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
