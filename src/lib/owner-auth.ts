import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const OWNER_COOKIE = "pbp-owner-session";

const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number | null;
}

const loginAttempts = new Map<string, AttemptRecord>();

export function registerLoginAttempt(identifier: string, succeeded: boolean) {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (succeeded) {
    loginAttempts.delete(identifier);
    return { blocked: false as const, retryAfterMs: 0 };
  }

  if (!record || now - record.firstAttemptAt > LOGIN_ATTEMPT_WINDOW_MS) {
    loginAttempts.set(identifier, { count: 1, firstAttemptAt: now, lockedUntil: null });
    return { blocked: false as const, retryAfterMs: 0 };
  }

  record.count += 1;

  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOGIN_ATTEMPT_WINDOW_MS;
  }

  return {
    blocked: record.lockedUntil !== null,
    retryAfterMs: record.lockedUntil ? Math.max(record.lockedUntil - now, 0) : 0,
  };
}

export function getLoginLock(identifier: string) {
  const record = loginAttempts.get(identifier);
  if (!record || !record.lockedUntil) {
    return { blocked: false as const, retryAfterMs: 0 };
  }
  const retryAfterMs = record.lockedUntil - Date.now();
  if (retryAfterMs <= 0) {
    loginAttempts.delete(identifier);
    return { blocked: false as const, retryAfterMs: 0 };
  }
  return { blocked: true as const, retryAfterMs };
}

function getOwnerPassword() {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_DASHBOARD_PASSWORD is not set");
  }

  return password;
}

function getOwnerUsername() {
  return process.env.ADMIN_DASHBOARD_USERNAME?.trim() || "owner";
}

function getCookieValue() {
  return createHash("sha256")
    .update(`pbp-owner:${getOwnerUsername()}:${getOwnerPassword()}`)
    .digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export async function isOwnerAuthenticated() {
  const cookieStore = await cookies();
  const current = cookieStore.get(OWNER_COOKIE)?.value;

  if (!current) {
    return false;
  }

  return safeEqual(current, getCookieValue());
}

export async function requireOwnerAuth() {
  const authenticated = await isOwnerAuthenticated();

  if (!authenticated) {
    redirect("/owner/login");
  }
}

export async function createOwnerSession() {
  const cookieStore = await cookies();
  cookieStore.set(OWNER_COOKIE, getCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearOwnerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(OWNER_COOKIE);
}

export function validateOwnerCredentials(username: string, password: string) {
  const userOk = safeEqual(username, getOwnerUsername());
  const passOk = safeEqual(password, getOwnerPassword());
  return userOk && passOk;
}
