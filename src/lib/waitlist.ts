import { randomUUID } from "node:crypto";
import { getSql } from "@/lib/db";

export interface WaitlistSignup {
  id: string;
  email: string;
  source: string | null;
  locale: string | null;
  createdAt: string;
}

let waitlistReady: Promise<void> | null = null;

export async function ensureWaitlistReady() {
  if (!waitlistReady) {
    const sql = getSql();
    waitlistReady = (async () => {
      await sql`
        create table if not exists waitlist_signups (
          id text primary key,
          email text not null unique,
          source text,
          locale text,
          created_at timestamptz not null default now()
        )
      `;
    })();
  }
  await waitlistReady;
}

export interface AddWaitlistResult {
  created: boolean;
  signup: WaitlistSignup;
}

/**
 * Insert a signup. If the email already exists, returns the existing row
 * with created=false so we don't send a duplicate welcome email.
 */
export async function addWaitlistSignup(
  email: string,
  source: string | null,
  locale: string | null,
): Promise<AddWaitlistResult> {
  await ensureWaitlistReady();
  const sql = getSql();
  const normalized = email.trim().toLowerCase();
  const id = randomUUID();

  const inserted = await sql<WaitlistRow[]>`
    insert into waitlist_signups (id, email, source, locale)
    values (${id}, ${normalized}, ${source}, ${locale})
    on conflict (email) do nothing
    returning id, email, source, locale, created_at::text
  `;

  if (inserted.length > 0) {
    return { created: true, signup: mapRow(inserted[0]) };
  }

  const existing = await sql<WaitlistRow[]>`
    select id, email, source, locale, created_at::text
    from waitlist_signups
    where email = ${normalized}
    limit 1
  `;

  return { created: false, signup: mapRow(existing[0]) };
}

export async function getWaitlistSignups(): Promise<WaitlistSignup[]> {
  await ensureWaitlistReady();
  const sql = getSql();
  const rows = await sql<WaitlistRow[]>`
    select id, email, source, locale, created_at::text
    from waitlist_signups
    order by created_at desc
  `;
  return rows.map(mapRow);
}

interface WaitlistRow {
  id: string;
  email: string;
  source: string | null;
  locale: string | null;
  created_at: string;
}

function mapRow(row: WaitlistRow): WaitlistSignup {
  return {
    id: row.id,
    email: row.email,
    source: row.source,
    locale: row.locale,
    createdAt: row.created_at,
  };
}

export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
