// One-off maintenance: set the canonical per-style prices on the live DB.
// Static = €55,00 and Dangling = €60,00 across every material.
//
//   node --env-file=.env.local scripts/set-variant-prices.mjs        # show current
//   node --env-file=.env.local scripts/set-variant-prices.mjs apply  # write the prices
//
// Safe to re-run. Owner edits made later in the /owner dashboard are NOT
// touched by this script — it only runs when you invoke it.
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Canonical prices in cents, keyed by style.
const PRICE_CENTS_BY_STYLE = { Static: 6000, Dangling: 6500 };
// Product-level "from" price (the lowest variant) shown on cards / catalog.
const BASE_PRICE_CENTS = 6000;

const apply = process.argv[2] === "apply";
const sql = postgres(url, { max: 1, prepare: false });

try {
  const before = await sql`
    select product_id, material, style, price_cents
    from variant_inventory
    order by product_id, style, material
  `;
  console.log("Current variant prices:");
  for (const r of before) {
    console.log(`  ${r.product_id}  ${r.material} · ${r.style}  →  €${((r.price_cents ?? 0) / 100).toFixed(2)}`);
  }

  if (!apply) {
    console.log("\n(read-only — pass `apply` to write the canonical prices)");
  } else {
    for (const [style, cents] of Object.entries(PRICE_CENTS_BY_STYLE)) {
      const res = await sql`
        update variant_inventory set price_cents = ${cents}, updated_at = now()
        where style = ${style}
      `;
      console.log(`\nSet ${style} → €${(cents / 100).toFixed(2)} on ${res.count} variant row(s).`);
    }

    const ov = await sql`
      update product_overrides set price_cents = ${BASE_PRICE_CENTS}, updated_at = now()
    `;
    console.log(`Set product-level "from" price → €${(BASE_PRICE_CENTS / 100).toFixed(2)} on ${ov.count} product row(s).`);
  }
} finally {
  await sql.end();
}
