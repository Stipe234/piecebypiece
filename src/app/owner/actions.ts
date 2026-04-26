"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearOwnerSession,
  createOwnerSession,
  getLoginLock,
  registerLoginAttempt,
  requireOwnerAuth,
  validateOwnerCredentials,
} from "@/lib/owner-auth";
import {
  InventoryError,
  getOrderForRefund,
  markOrderRefunded,
  updateInventoryTotal,
  updateOrderShipping,
  updateProductOverride,
  type ShippingStatus,
} from "@/lib/inventory";
import { getStripe } from "@/lib/stripe";

export interface OwnerLoginState {
  error?: string;
}

export interface OwnerActionState {
  error?: string;
  success?: boolean;
}

async function getClientIdentifier() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

function formatRetry(ms: number) {
  const minutes = Math.ceil(ms / 60000);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

export async function loginOwner(
  _prevState: OwnerLoginState | undefined,
  formData: FormData,
): Promise<OwnerLoginState | undefined> {
  const identifier = await getClientIdentifier();

  const lock = getLoginLock(identifier);
  if (lock.blocked) {
    return { error: `Too many attempts. Try again in ${formatRetry(lock.retryAfterMs)}.` };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Enter your username and password." };
  }

  const ok = validateOwnerCredentials(username, password);
  const outcome = registerLoginAttempt(identifier, ok);

  if (!ok) {
    if (outcome.blocked) {
      return { error: `Too many attempts. Try again in ${formatRetry(outcome.retryAfterMs)}.` };
    }
    return { error: "Those credentials are not correct." };
  }

  await createOwnerSession();
  redirect("/owner");
}

export async function logoutOwner() {
  await clearOwnerSession();
  redirect("/owner/login");
}

export async function saveInventoryTotal(
  _prevState: OwnerActionState | undefined,
  formData: FormData,
): Promise<OwnerActionState> {
  await requireOwnerAuth();

  const productId = String(formData.get("productId") ?? "");
  const raw = formData.get("totalUnits");
  const totalUnits = Number(raw);

  if (!productId) {
    return { error: "Missing product." };
  }

  if (raw === null || raw === "" || !Number.isFinite(totalUnits)) {
    return { error: "Enter a whole number." };
  }

  try {
    await updateInventoryTotal(productId, totalUnits);
    revalidatePath("/owner");
    return { success: true };
  } catch (error) {
    if (error instanceof InventoryError) {
      return { error: error.message };
    }
    return { error: "Unable to save stock." };
  }
}

export async function saveProductOverride(
  _prevState: OwnerActionState | undefined,
  formData: FormData,
): Promise<OwnerActionState> {
  await requireOwnerAuth();

  const productId = String(formData.get("productId") ?? "");
  const priceRaw = String(formData.get("priceEuros") ?? "").replace(",", ".").trim();
  const priceEuros = Number(priceRaw);
  const isActive = formData.get("isActive") === "on";

  if (!productId) {
    return { error: "Missing product." };
  }

  if (!Number.isFinite(priceEuros) || priceEuros < 0) {
    return { error: "Enter a price in euros." };
  }

  try {
    await updateProductOverride(productId, Math.round(priceEuros * 100), isActive);
    revalidatePath("/owner");
    return { success: true };
  } catch (error) {
    if (error instanceof InventoryError) {
      return { error: error.message };
    }
    return { error: "Unable to save product." };
  }
}

export async function refundOrder(
  _prevState: OwnerActionState | undefined,
  formData: FormData,
): Promise<OwnerActionState> {
  await requireOwnerAuth();

  const orderId = String(formData.get("orderId") ?? "");
  if (!orderId) {
    return { error: "Missing order." };
  }

  const order = await getOrderForRefund(orderId);
  if (!order) {
    return { error: "Order not found." };
  }

  if (order.refundAmountCents > 0) {
    return { error: "This order has already been refunded." };
  }

  if (!order.stripePaymentIntentId) {
    return { error: "No Stripe payment intent linked to this order." };
  }

  try {
    await getStripe().refunds.create({
      payment_intent: order.stripePaymentIntentId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe refund failed.";
    return { error: `Stripe: ${message}` };
  }

  await markOrderRefunded(orderId, order.amountTotalCents);
  revalidatePath("/owner");
  return { success: true };
}

export async function saveShippingStatus(
  _prevState: OwnerActionState | undefined,
  formData: FormData,
): Promise<OwnerActionState> {
  await requireOwnerAuth();

  const orderId = String(formData.get("orderId") ?? "");
  const shippingStatus = String(formData.get("shippingStatus") ?? "") as ShippingStatus;
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim() || null;

  if (!orderId) {
    return { error: "Missing order." };
  }

  try {
    await updateOrderShipping(orderId, shippingStatus, trackingNumber);
    revalidatePath("/owner");
    return { success: true };
  } catch (error) {
    if (error instanceof InventoryError) {
      return { error: error.message };
    }
    return { error: "Unable to update shipping." };
  }
}
