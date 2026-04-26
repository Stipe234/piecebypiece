import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById, getProductContent } from "@/data/products";
import type { Locale } from "@/i18n/translations";
import { getCatalogOverrides } from "@/lib/inventory";
import {
  attachReservationSession,
  createReservation,
  InventoryError,
  releaseReservationById,
} from "@/lib/inventory";

export const runtime = "nodejs";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

interface LineItem {
  productId: string;
  quantity: number;
  material: string;
  length: string;
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

    const localeKey: Locale = locale === "hr" ? "hr" : "en";
    const origin = request.headers.get("origin") || new URL(request.url).origin;
    const overrides = await getCatalogOverrides();
    const validatedItems = items.map((item) => {
      const product = getProductById(item.productId);

      if (!product) {
        throw new Error(`Unknown product: ${item.productId}`);
      }

      const override = overrides[item.productId];
      if (override && !override.isActive) {
        throw new Error(`Product is no longer available: ${item.productId}`);
      }

      if (!product.materials.includes(item.material)) {
        throw new Error(`Invalid material for product: ${item.productId}`);
      }

      if (!product.lengths.includes(item.length)) {
        throw new Error(`Invalid length for product: ${item.productId}`);
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error(`Invalid quantity for product: ${item.productId}`);
      }

      const unitPriceCents = override?.priceCents ?? Math.round(product.price * 100);

      return {
        item,
        product,
        unitPriceCents,
        content: getProductContent(product, localeKey),
      };
    });

    const stripe = getStripe();
    const sessionExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const reservationId = await createReservation(
      validatedItems.map(({ item, product, content, unitPriceCents }) => ({
        productId: item.productId,
        quantity: item.quantity,
        material: item.material,
        length: item.length,
        unitPriceCents,
        productName: content.name,
        productSlug: product.slug,
      })),
      sessionExpiresAt,
    );

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        locale: localeKey === "hr" ? "hr" : "auto",
        expires_at: Math.floor(sessionExpiresAt.getTime() / 1000),
        metadata: {
          reservationId,
        },
        line_items: validatedItems.map(({ item, product, content, unitPriceCents }) => {
          return {
            price_data: {
              currency: "eur",
              product_data: {
                name: content.name,
                description: `${item.material} / ${item.length}`,
                images: [`${origin}${product.images.studio}`],
              },
              unit_amount: unitPriceCents,
            },
            quantity: item.quantity,
          };
        }),
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

      await attachReservationSession(reservationId, session.id);

      return NextResponse.json({ url: session.url });
    } catch (error) {
      await releaseReservationById(reservationId);
      throw error;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = err instanceof InventoryError ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
