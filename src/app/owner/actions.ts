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
  updateProductActive,
  updateVariant,
  type ShippingStatus,
} from "@/lib/inventory";
import { getStripe } from "@/lib/stripe";
import { getWaitlistSignups } from "@/lib/waitlist";
import { sendBroadcast, sendOrderStatusEmail } from "@/lib/email";
import { saveOrderEmailCopy, type OrderEmailCopy } from "@/lib/settings";

export interface OwnerLoginState {
  error?: string;
}

export interface OwnerActionState {
  error?: string;
  success?: boolean;
  message?: string;
  /** Changes on every successful save; lets a client reload a preview. */
  savedAt?: number;
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

export async function saveVariant(
  _prevState: OwnerActionState | undefined,
  formData: FormData,
): Promise<OwnerActionState> {
  await requireOwnerAuth();

  const productId = String(formData.get("productId") ?? "");
  const material = String(formData.get("material") ?? "");
  const style = String(formData.get("style") ?? "");
  const stockRaw = formData.get("totalUnits");
  const totalUnits = Number(stockRaw);
  const priceRaw = String(formData.get("priceEuros") ?? "").replace(",", ".").trim();
  const priceEuros = Number(priceRaw);

  if (!productId || !material || !style) {
    return { error: "Missing variant." };
  }

  if (stockRaw === null || stockRaw === "" || !Number.isFinite(totalUnits)) {
    return { error: "Enter a whole number for stock." };
  }

  if (!Number.isFinite(priceEuros) || priceEuros < 0) {
    return { error: "Enter a price in euros." };
  }

  try {
    await updateVariant(productId, material, style, totalUnits, Math.round(priceEuros * 100));
    revalidatePath("/owner");
    return { success: true };
  } catch (error) {
    if (error instanceof InventoryError) {
      return { error: error.message };
    }
    return { error: "Unable to save variant." };
  }
}

export async function saveProductOverride(
  _prevState: OwnerActionState | undefined,
  formData: FormData,
): Promise<OwnerActionState> {
  await requireOwnerAuth();

  const productId = String(formData.get("productId") ?? "");
  const isActive = formData.get("isActive") === "on";

  if (!productId) {
    return { error: "Missing product." };
  }

  try {
    await updateProductActive(productId, isActive);
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
  const carrier = String(formData.get("carrier") ?? "").trim() || null;
  const trackingUrl = String(formData.get("trackingUrl") ?? "").trim() || null;

  if (!orderId) {
    return { error: "Missing order." };
  }

  // The shipped email promises a tracking link, so require both before shipping.
  if (shippingStatus === "shipped" && (!carrier || !trackingUrl)) {
    return { error: "Add the carrier and tracking link before marking it shipped." };
  }
  if (trackingUrl && !/^https?:\/\//i.test(trackingUrl)) {
    return { error: "The tracking link must be a full URL starting with http:// or https://." };
  }

  try {
    const result = await updateOrderShipping(orderId, shippingStatus, carrier, trackingUrl);
    revalidatePath("/owner");

    if (!result) {
      return { error: "Order not found." };
    }

    // Email the customer once per forward step (packed → shipped → delivered);
    // re-saving the same status won't resend.
    const rank: Record<ShippingStatus, number> = { pending: 0, packed: 1, shipped: 2, delivered: 3 };
    const movedForward = rank[shippingStatus] > rank[result.previousStatus];

    if (movedForward && shippingStatus !== "pending") {
      if (!result.customerEmail) {
        return { success: true, message: "Saved. No customer email on file, so nothing was sent." };
      }
      const sendResult = await sendOrderStatusEmail({
        to: result.customerEmail,
        customerName: result.customerName,
        status: shippingStatus,
        carrier: result.carrier,
        trackingUrl: result.trackingUrl,
      });
      if (sendResult.skipped) {
        return { success: true, message: "Saved. Email isn't configured yet, so the customer wasn't notified." };
      }
      if (!sendResult.sent) {
        return { success: true, message: "Saved, but the notification email failed to send — check the logs." };
      }
      return { success: true, message: `Saved — ${result.customerEmail} notified.` };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof InventoryError) {
      return { error: error.message };
    }
    return { error: "Unable to update shipping." };
  }
}

export async function saveOrderEmailAction(
  _prevState: OwnerActionState | undefined,
  formData: FormData,
): Promise<OwnerActionState> {
  await requireOwnerAuth();

  const get = (key: string) => String(formData.get(key) ?? "").trim();

  // Care bullets come from one textarea, one bullet per line.
  const careItems = get("careItems")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const copy: OrderEmailCopy = {
    subject: get("subject"),
    eyebrow: get("eyebrow"),
    heading: get("heading"),
    intro: get("intro"),
    nextStepDelivery: get("nextStepDelivery"),
    nextStepPickup: get("nextStepPickup"),
    careHeading: get("careHeading"),
    careItems,
    careFooter: get("careFooter"),
  };

  if (!copy.subject || !copy.heading || !copy.intro) {
    return { error: "Subject, heading and the opening paragraph can't be empty." };
  }

  try {
    await saveOrderEmailCopy(copy);
    revalidatePath("/owner");
    return { success: true, message: "Saved — the next order confirmation will use this.", savedAt: Date.now() };
  } catch {
    return { error: "Unable to save the email. Please try again." };
  }
}

export interface BroadcastState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function sendBroadcastAction(
  _prevState: BroadcastState | undefined,
  formData: FormData,
): Promise<BroadcastState> {
  await requireOwnerAuth();

  const subject = String(formData.get("subject") ?? "").trim();
  const eyebrow = String(formData.get("eyebrow") ?? "").trim();
  const heading = String(formData.get("heading") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const confirmed = formData.get("confirm") === "on";

  if (!subject || !heading || !body) {
    return { error: "Add a subject, a heading, and a message before sending." };
  }
  if (!confirmed) {
    return { error: "Tick the confirmation box so this isn't sent by accident." };
  }

  const signups = await getWaitlistSignups();
  const recipients = signups.map((s) => s.email);
  if (recipients.length === 0) {
    return { error: "There are no subscribers to send to yet." };
  }

  const result = await sendBroadcast({ recipients, subject, eyebrow, heading, body });

  if (result.skipped) {
    return { error: "Email isn't configured yet (RESEND_API_KEY is missing), so nothing was sent." };
  }
  if (result.sent === 0) {
    return { error: `Sending failed for all ${result.total} subscribers. Check the logs and try again.` };
  }

  const failedNote = result.failed > 0 ? ` ${result.failed} failed — check the logs.` : "";
  return {
    success: true,
    message: `Sent to ${result.sent} of ${result.total} subscriber${result.total === 1 ? "" : "s"}.${failedNote}`,
  };
}
