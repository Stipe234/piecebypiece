import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById, getProductContent, getVariantPrice, variantKey } from "@/data/products";
import type { Locale } from "@/i18n/translations";
import {
  attachReservationSession,
  createReservation,
  getAvailabilityMap,
  InventoryError,
  releaseReservationById,
} from "@/lib/inventory";
import {
  DELIVERY_ESTIMATE_DAYS,
  GLS_DELIVERY_CENTS,
  isDeliveryMethod,
  type DeliveryMethod,
} from "@/lib/shipping";

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
  style: string;
  length: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items: LineItem[];
      deliveryMethod?: string;
      locale?: string;
    };
    const items = body.items;
    const deliveryMethod: DeliveryMethod = isDeliveryMethod(body.deliveryMethod)
      ? body.deliveryMethod
      : "delivery";

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const localeKey: Locale = "en";
    const origin = request.headers.get("origin") || new URL(request.url).origin;
    const productIds = [...new Set(items.map((i) => i.productId))];
    const availability = await getAvailabilityMap(productIds);
    const validatedItems = items.map((item) => {
      const product = getProductById(item.productId);

      if (!product) {
        throw new Error(`Unknown product: ${item.productId}`);
      }

      const avail = availability[item.productId];
      if (avail && !avail.isActive) {
        throw new Error(`Product is no longer available: ${item.productId}`);
      }

      if (!product.materials.includes(item.material)) {
        throw new Error(`Invalid material for product: ${item.productId}`);
      }

      if (!product.styles.includes(item.style)) {
        throw new Error(`Invalid style for product: ${item.productId}`);
      }

      if (!product.lengths.includes(item.length)) {
        throw new Error(`Invalid length for product: ${item.productId}`);
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error(`Invalid quantity for product: ${item.productId}`);
      }

      // Per-variant price (falls back to product-level / catalog price).
      const variant = avail?.variants.find((v) => v.variantKey === variantKey(item.material, item.style));
      const unitPriceCents = variant?.priceCents ?? avail?.priceCents ?? Math.round(getVariantPrice(product, item.style) * 100);

      return {
        item,
        product,
        unitPriceCents,
        content: getProductContent(product, localeKey),
      };
    });

    const stripe = getStripe();
    // Our stock hold lasts 5 minutes (the countdown the shopper sees). Stripe's
    // own session expiry has a 30-minute minimum, so it's a separate, longer
    // safety window — completeReservationFromSession still honours a late payment.
    const reservationExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const stripeExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const reservationId = await createReservation(
      validatedItems.map(({ item, product, content, unitPriceCents }) => ({
        productId: item.productId,
        quantity: item.quantity,
        material: item.material,
        style: item.style,
        length: item.length,
        unitPriceCents,
        productName: content.name,
        productSlug: product.slug,
      })),
      reservationExpiresAt,
    );

    try {
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        payment_method_types: ["card"],
        locale: "auto",
        expires_at: Math.floor(stripeExpiresAt.getTime() / 1000),
        metadata: {
          reservationId,
          fulfillment: deliveryMethod,
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
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel`,
      };

      if (deliveryMethod === "pickup") {
        // Personal pickup: nothing to ship, so collect no address. Grab a phone
        // number to arrange collection, and say so on the Stripe pay page.
        sessionParams.phone_number_collection = { enabled: true };
        sessionParams.custom_text = {
          submit: {
            message:
              "You've chosen personal pickup — we'll email you to arrange collection. No shipping address needed.",
          },
        };
      } else {
        // GLS home delivery: collect a shipping address and attach the GLS rate.
        sessionParams.shipping_address_collection = {
          allowed_countries: ["HR", "DE", "AT", "SI", "IT", "FR", "ES", "NL", "BE", "GB", "US"],
        };
        sessionParams.shipping_options = [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: GLS_DELIVERY_CENTS, currency: "eur" },
              display_name:
                GLS_DELIVERY_CENTS === 0 ? "GLS home delivery — free" : "GLS home delivery",
              delivery_estimate: {
                minimum: { unit: "business_day", value: DELIVERY_ESTIMATE_DAYS.min },
                maximum: { unit: "business_day", value: DELIVERY_ESTIMATE_DAYS.max },
              },
            },
          },
        ];
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      await attachReservationSession(reservationId, session.id);

      return NextResponse.json({ url: session.url, expiresAt: reservationExpiresAt.toISOString() });
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
