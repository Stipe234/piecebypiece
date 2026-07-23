// One-off maintenance: list or clear waitlist_signups.
//   node --env-file=.env.local scripts/clear-waitlist.mjs list
//   node --env-file=.env.local scripts/clear-waitlist.mjs delete
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const mode = process.argv[2] === "delete" ? "delete" : "list";
const sql = postgres(url, { max: 1, prepare: false });

try {
  const rows = await sql`
    select email, source, created_at::text as created_at
    from waitlist_signups
    order by created_at desc
  `;
  console.log(`Current signups: ${rows.length}`);
  for (const r of rows) {
    console.log(`  ${r.created_at}  ${r.email}  (source: ${r.source ?? "—"})`);
  }

  if (mode === "delete") {
    const del = await sql`delete from waitlist_signups`;
    const [{ n }] = await sql`select count(*)::int as n from waitlist_signups`;
    console.log(`\nDeleted ${del.count} row(s). Remaining: ${n}`);
  } else {
    console.log("\n(list only — no rows deleted)");
  }
} finally {
  await sql.end();
}
