import Link from "next/link";
import { logoutOwner } from "@/app/owner/actions";
import InventoryEditForm from "@/components/owner/InventoryEditForm";
import OrdersPanel from "@/components/owner/OrdersPanel";
import ProductOverrideForm from "@/components/owner/ProductOverrideForm";
import RevenueSparkline from "@/components/owner/RevenueSparkline";
import WaitlistPanel from "@/components/owner/WaitlistPanel";
import { getOwnerDashboardData } from "@/lib/inventory";
import { getWaitlistSignups } from "@/lib/waitlist";
import { requireOwnerAuth } from "@/lib/owner-auth";

export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function OwnerDashboardPage() {
  await requireOwnerAuth();
  const data = await getOwnerDashboardData();
  const waitlist = await getWaitlistSignups();
  const lowStockCount = data.products.filter((product) => product.isLowStock && product.availableUnits > 0).length;

  const headlineStats: Array<{ label: string; value: string; accent?: "primary" | "warn" }> = [
    { label: "Revenue", value: formatMoney(data.overview.revenueCents, "EUR"), accent: "primary" },
    { label: "Orders", value: String(data.overview.totalOrders) },
    { label: "Units sold", value: String(data.overview.unitsSold) },
    { label: "Available", value: String(data.overview.unitsAvailable) },
    { label: "Reserved", value: String(data.overview.reservedUnits) },
    { label: "Need shipping", value: String(data.overview.pendingShipments), accent: data.overview.pendingShipments > 0 ? "warn" : undefined },
  ];

  return (
    <section className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
        <header className="flex flex-col gap-6 border-b border-[var(--color-border)] pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">Dashboard for my love</p>
            <h1 className="mt-4 font-heading text-5xl font-light tracking-wide text-[var(--color-text-primary)] md:text-7xl">
              PIECE BY PIECE
            </h1>
          </div>

          <form action={logoutOwner}>
            <button
              type="submit"
              className="border border-[var(--color-border-dark)] px-7 py-3 text-[11px] uppercase tracking-[0.25em] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent-dark)] hover:text-[var(--color-text-inverse)]"
            >
              Log out
            </button>
          </form>
        </header>

        {/* ── Overview stats ── */}
        <div className="mt-12 grid grid-cols-2 border-l border-t border-[var(--color-border)] sm:grid-cols-3 xl:grid-cols-6">
          {headlineStats.map(({ label, value, accent }) => {
            const surface =
              accent === "primary"
                ? "bg-[var(--color-accent-dark)] text-[var(--color-text-inverse)]"
                : accent === "warn"
                ? "bg-[var(--color-bg-secondary)]"
                : "bg-[var(--color-bg-primary)]";
            const labelColor =
              accent === "primary"
                ? "text-white/60"
                : accent === "warn"
                ? "text-[var(--color-error)]"
                : "text-[var(--color-text-tertiary)]";
            const valueColor = accent === "warn" ? "text-[var(--color-error)]" : "";
            return (
              <div key={label} className={`border-b border-r border-[var(--color-border)] p-6 ${surface}`}>
                <p className={`text-[10px] uppercase tracking-[0.28em] ${labelColor}`}>{label}</p>
                <p className={`mt-5 font-heading text-3xl font-light ${valueColor}`}>{value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <RevenueSparkline series={data.overview.revenueSeries} />
        </div>

        {/* ── Inventory ── */}
        <div className="mt-12 border-t border-[var(--color-border)] pt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">Inventory</p>
              <h2 className="mt-3 font-heading text-3xl font-light tracking-wide text-[var(--color-text-primary)] md:text-4xl">
                Live stock
              </h2>
            </div>
            <Link
              href="/collections/hand-chains"
              className="border-b border-[var(--color-border-dark)] pb-1 text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition-colors hover:border-transparent"
            >
              View storefront
            </Link>
          </div>

          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-3 border-t border-[var(--color-border)] pt-6 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Available</dt>
              <dd className="mt-2 font-heading text-2xl font-light">{data.overview.unitsAvailable}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Reserved</dt>
              <dd className="mt-2 font-heading text-2xl font-light">{data.overview.reservedUnits}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Running low</dt>
              <dd className={`mt-2 font-heading text-2xl font-light ${lowStockCount > 0 ? "text-[var(--color-error)]" : ""}`}>
                {lowStockCount}
              </dd>
            </div>
          </dl>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {data.products.map((product) => {
              const leftColor = product.availableUnits === 0
                ? "text-[var(--color-error)]"
                : product.isLowStock
                  ? "text-[var(--color-error)]"
                  : "text-[var(--color-text-primary)]";
              const leftLabel = product.availableUnits === 0
                ? "Sold out"
                : product.isLowStock
                  ? "Low stock"
                  : "Available";
              const stockFill = product.totalUnits > 0
                ? Math.max(Math.min((product.availableUnits / product.totalUnits) * 100, 100), 0)
                : 0;
              const barColor = product.availableUnits === 0 || product.isLowStock
                ? "var(--color-error)"
                : "var(--color-accent-dark)";

              return (
                <article
                  key={product.productId}
                  className="border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 md:p-8"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-heading text-2xl font-light text-[var(--color-text-primary)] md:text-3xl">{product.name}</p>
                        {!product.isActive ? (
                          <span className="bg-[var(--color-accent-dark)] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-inverse)]">
                            Hidden
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-[var(--color-text-tertiary)]">{product.slug}</p>

                      <div className="mt-6">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">
                          <span>{leftLabel}</span>
                          <span>{product.availableUnits} / {product.totalUnits}</span>
                        </div>
                        <div className="relative mt-2 h-1.5 overflow-hidden bg-[var(--color-bg-tertiary)]">
                          <div className="h-full" style={{ width: `${stockFill}%`, background: barColor }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end gap-3 self-end sm:self-auto">
                      <span className={`font-heading text-6xl font-light leading-none md:text-7xl ${leftColor}`}>
                        {product.availableUnits}
                      </span>
                      <span className="pb-1 text-[11px] uppercase tracking-[0.26em] text-[var(--color-text-tertiary)]">
                        {leftLabel}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-2 border-t border-[var(--color-border)] pt-5 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Sold</p>
                      <p className="mt-1 text-lg font-light">{product.soldUnits}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Reserved</p>
                      <p className="mt-1 text-lg font-light">{product.reservedUnits}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Updated</p>
                      <p className="mt-1 text-xs font-light">{formatDate(product.updatedAt)}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">Stock</p>
                      <div className="mt-3">
                        <InventoryEditForm productId={product.productId} defaultValue={product.totalUnits} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">Pricing</p>
                      <div className="mt-3">
                        <ProductOverrideForm
                          productId={product.productId}
                          priceEuros={product.priceCents / 100}
                          isActive={product.isActive}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ── Recent sales & shipping ── */}
        <div className="mt-12 border-t border-[var(--color-border)] pt-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">Orders</p>
          <h2 className="mt-3 font-heading text-3xl font-light tracking-wide text-[var(--color-text-primary)] md:text-4xl">
            Recent sales &amp; shipping
          </h2>
          <div className="mt-8">
            <OrdersPanel orders={data.orders} />
          </div>
        </div>

        {/* ── Waitlist ── */}
        <div className="mt-12 border-t border-[var(--color-border)] pt-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">Waitlist</p>
          <h2 className="mt-3 font-heading text-3xl font-light tracking-wide text-[var(--color-text-primary)] md:text-4xl">
            Joined the list
          </h2>
          <div className="mt-8">
            <WaitlistPanel signups={waitlist} />
          </div>
        </div>
      </div>
    </section>
  );
}
