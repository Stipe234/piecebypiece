/**
 * Delivery options offered at checkout: GLS home delivery or personal pickup.
 * Shared by the checkout page (client) and the checkout API route (server) so the
 * price and labels never drift apart.
 *
 * GLS_DELIVERY_CENTS is the home-delivery price. It's 0 (free) today, matching the
 * previous free-shipping flow — set it to e.g. 490 for a €4.90 flat delivery charge.
 * Personal pickup is always free and collects no shipping address; we email the
 * customer to arrange collection.
 */
export type DeliveryMethod = "delivery" | "pickup";

export const GLS_DELIVERY_CENTS = 0;

export const DELIVERY_ESTIMATE_DAYS = { min: 3, max: 5 } as const;

export function isDeliveryMethod(value: unknown): value is DeliveryMethod {
  return value === "delivery" || value === "pickup";
}
