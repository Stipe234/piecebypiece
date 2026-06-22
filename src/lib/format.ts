/**
 * Format a price in euros for display, always with two decimals and a comma
 * decimal separator (European convention), e.g. 60 -> "€60,00".
 *
 * Deterministic (no locale lookup) so server and client render identically and
 * never trigger a hydration mismatch.
 */
export function formatEur(euros: number): string {
  return `€${euros.toFixed(2).replace(".", ",")}`;
}
