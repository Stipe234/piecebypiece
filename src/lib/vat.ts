/**
 * VAT (PDV) contained in our prices.
 *
 * Every price in the catalog and in the owner dashboard is the FINAL price the
 * customer pays — VAT is already inside it. Nothing is ever added on top at
 * checkout: write 60 in the dashboard and the customer pays exactly €60.
 *
 * That €60 is then split for the fiscal invoice: €48 net + €12 VAT at 25%.
 * VAT is a percentage of the NET amount, not of the final price, so the
 * inclusive maths is `net = gross / 1.25`, never `gross × 0.25`.
 *
 * Set to 0 if the business is not in the VAT system (below the registration
 * threshold). The fiscal invoice then needs the exemption wording configured in
 * Solo, and the VAT line disappears from checkout on its own.
 */
export const VAT_RATE = 25;

/** The VAT contained in a VAT-inclusive amount. €60 at 25% -> €12.00. */
export function vatPortionCents(grossCents: number, rate: number = VAT_RATE): number {
  if (rate <= 0) return 0;
  return grossCents - Math.round(grossCents / (1 + rate / 100));
}
