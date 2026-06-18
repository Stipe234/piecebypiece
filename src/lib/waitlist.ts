import { randomUUID } from "node:crypto";
import { getSql } from "@/lib/db";

export interface WaitlistSignup {
  id: string;
  email: string;
  source: string | null;
  locale: string | null;
  material: string | null;
  style: string | null;
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

      // The product page captures the material × style the shopper wanted.
      // Nullable: footer/homepage signups carry no variant.
      await sql`
        alter table waitlist_signups
        add column if not exists material text,
        add column if not exists style text
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
  material: string | null = null,
  style: string | null = null,
): Promise<AddWaitlistResult> {
  await ensureWaitlistReady();
  const sql = getSql();
  const normalized = email.trim().toLowerCase();
  const id = randomUUID();

  // Upsert so a repeat email still records the variant the shopper picked.
  // coalesce keeps an existing variant if a later signup (e.g. the footer
  // newsletter form) arrives with no variant — never overwrite a real choice
  // with NULL, and leave `source` as first set. `(xmax = 0)` distinguishes a
  // fresh insert from an update so we only send the welcome email once.
  const rows = await sql<(WaitlistRow & { created: boolean })[]>`
    insert into waitlist_signups (id, email, source, locale, material, style)
    values (${id}, ${normalized}, ${source}, ${locale}, ${material}, ${style})
    on conflict (email) do update set
      material = coalesce(excluded.material, waitlist_signups.material),
      style = coalesce(excluded.style, waitlist_signups.style)
    returning id, email, source, locale, material, style, created_at::text, (xmax = 0) as created
  `;

  const row = rows[0];
  return { created: row.created, signup: mapRow(row) };
}

export async function getWaitlistSignups(): Promise<WaitlistSignup[]> {
  await ensureWaitlistReady();
  const sql = getSql();
  const rows = await sql<WaitlistRow[]>`
    select id, email, source, locale, material, style, created_at::text
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
  material: string | null;
  style: string | null;
  created_at: string;
}

function mapRow(row: WaitlistRow): WaitlistSignup {
  return {
    id: row.id,
    email: row.email,
    source: row.source,
    locale: row.locale,
    material: row.material,
    style: row.style,
    createdAt: row.created_at,
  };
}

export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
