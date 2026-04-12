import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

interface LineItem {
  name: string;
  price: number;
  quantity: number;
  material: string;
  length: string;
  image: string;
}

export async function POST(request: Request) {
  try {
    const { items, locale } = (await request.json()) as {
      items: LineItem[];
      locale: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: locale === "hr" ? "hr" : "auto",
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: `${item.material} / ${item.length}`,
            images: item.image.startsWith("http")
              ? [item.image]
              : [`${origin}${item.image}`],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: ["HR", "DE", "AT", "SI", "IT", "FR", "ES", "NL", "BE", "GB", "US"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "eur" },
            display_name:
              locale === "hr" ? "Besplatna dostava" : "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
