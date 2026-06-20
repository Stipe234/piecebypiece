import Link from "next/link";
import { logoutOwner } from "@/app/owner/actions";
import VariantStockForm from "@/components/owner/VariantStockForm";
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

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="dash-accent" aria-hidden />
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">{eyebrow}</p>
        </div>
        <h2 className="mt-3 font-heading text-3xl font-light tracking-wide text-[var(--color-text-primary)] md:text-4xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export default async function OwnerDashboardPage() {
  await requireOwnerAuth();
  const data = await getOwnerDashboardData();
  const waitlist = await getWaitlistSignups();
  // "Running low" uses the same 10%-remaining rule as the per-variant bars below.
  const isVariantLow = (availableUnits: number, totalUnits: number) =>
    availableUnits > 0 && (totalUnits <= 0 || (availableUnits / totalUnits) * 100 <= 10);
  const lowStockCount = data.products
    .flatMap((product) => product.variants)
    .filter((variant) => isVariantLow(variant.availableUnits, variant.totalUnits)).length;

  const headlineStats: Array<{ label: string; value: string; accent?: "primary" | "warn" }> = [
    { label: "Revenue", value: formatMoney(data.overview.revenueCents, "EUR"), accent: "primary" },
    { label: "Orders", value: String(data.overview.totalOrders) },
    { label: "Units sold", value: String(data.overview.unitsSold) },
    { label: "Available", value: String(data.overview.unitsAvailable) },
    { label: "Reserved", value: String(data.overview.reservedUnits) },
    { label: "Need shipping", value: String(data.overview.pendingShipments), accent: data.overview.pendingShipments > 0 ? "warn" : undefined },
  ];

  return (
    <section className="min-h-screen bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
        <header className="flex flex-col gap-6 border-b border-[var(--color-border)] pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="dash-accent" aria-hidden />
              <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">Dashboard for my love</p>
            </div>
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
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {headlineStats.map(({ label, value, accent }) => {
            const isPrimary = accent === "primary";
            const isWarn = accent === "warn";
            const cardClass = isPrimary ? "dash-card-stone" : "dash-card";
            const labelColor = isWarn
              ? "text-[var(--color-error)]"
              : isPrimary
              ? "text-[var(--color-text-secondary)]"
              : "text-[var(--color-text-tertiary)]";
            const valueColor = isWarn
              ? "text-[var(--color-error)]"
              : "text-[var(--color-text-primary)]";
            return (
              <div key={label} className={`${cardClass} rounded-xl p-5`}>
                <p className={`text-[10px] uppercase tracking-[0.28em] ${labelColor}`}>{label}</p>
                <p className={`font-numeric mt-5 text-3xl font-medium tracking-tight ${valueColor}`}>{value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <RevenueSparkline series={data.overview.revenueSeries} />
        </div>

        {/* ── Inventory ── */}
        <div className="mt-14 border-t border-[var(--color-border)] pt-12">
          <SectionHeading
            eyebrow="Inventory"
            title="Live stock"
            action={
              <Link
                href="/collections/hand-chains"
                className="border-b border-[var(--color-border-dark)] pb-1 text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition-colors hover:border-transparent"
              >
                View storefront
              </Link>
            }
          />

          <div className="dash-card mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl">
            <div className="bg-[var(--color-bg-secondary)] p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Available</p>
              <p className="font-numeric mt-2 text-2xl font-medium">{data.overview.unitsAvailable}</p>
            </div>
            <div className="bg-[var(--color-bg-secondary)] p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Reserved</p>
              <p className="font-numeric mt-2 text-2xl font-medium">{data.overview.reservedUnits}</p>
            </div>
            <div className="bg-[var(--color-bg-secondary)] p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Running low</p>
              <p className={`font-numeric mt-2 text-2xl font-medium ${lowStockCount > 0 ? "text-[var(--color-error)]" : ""}`}>
                {lowStockCount}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {data.products.map((product) => {
              const stockFill = product.totalUnits > 0
                ? Math.max(Math.min((product.availableUnits / product.totalUnits) * 100, 100), 0)
                : 0;
              // Green while healthy; flips to red once 10% or less remains (or sold out).
              const isCritical = product.availableUnits === 0 || stockFill <= 10;
              const leftColor = isCritical ? "text-[var(--color-error)]" : "text-[var(--color-success)]";
              const leftLabel = product.availableUnits === 0
                ? "Sold out"
                : isCritical
                  ? "Low stock"
                  : "Available";
              const barColor = isCritical ? "var(--color-error)" : "var(--color-success)";

              return (
                <article key={product.productId} className="dash-card rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-heading text-2xl font-light text-[var(--color-text-primary)] md:text-3xl">{product.name}</p>
                        {!product.isActive ? (
                          <span className="rounded-full bg-[var(--color-accent-dark)] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-inverse)]">
                            Hidden
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-[var(--color-text-tertiary)]">{product.slug}</p>

                      <div className="mt-6">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">
                          <span>{leftLabel}</span>
                          <span className="font-numeric tracking-normal">{product.availableUnits} / {product.totalUnits}</span>
                        </div>
                        <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-bg-tertiary)] shadow-[inset_0_1px_2px_rgba(26,26,26,0.1)]">
                          <div className="h-full rounded-full" style={{ width: `${stockFill}%`, background: barColor }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end gap-3 self-end sm:self-auto">
                      <span className={`font-numeric text-6xl font-semibold leading-none md:text-7xl ${leftColor}`}>
                        {product.availableUnits}
                      </span>
                      <span className="pb-1 text-[11px] uppercase tracking-[0.26em] text-[var(--color-text-tertiary)]">
                        {leftLabel}
                      </span>
                    </div>
                  </div>

                  <div className="dash-inset mt-6 flex flex-wrap items-center gap-x-10 gap-y-2 rounded-xl px-5 py-4 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Sold</p>
                      <p className="font-numeric mt-1 text-lg font-medium">{product.soldUnits}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Reserved</p>
                      <p className="font-numeric mt-1 text-lg font-medium">{product.reservedUnits}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-tertiary)]">Updated</p>
                      <p className="font-numeric mt-1 text-xs">{formatDate(product.updatedAt)}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">Stock by variant</p>
                    <div className="mt-3 flex flex-col gap-2.5">
                      {product.variants.map((variant) => (
                        <div key={variant.variantKey} className="dash-inset rounded-xl px-4 py-3">
                          <VariantStockForm
                            productId={product.productId}
                            material={variant.material}
                            style={variant.style}
                            label={variant.label}
                            available={variant.availableUnits}
                            total={variant.totalUnits}
                            defaultValue={variant.totalUnits}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">Pricing</p>
                    <div className="mt-3">
                      <ProductOverrideForm
                        productId={product.productId}
                        priceEuros={product.priceCents / 100}
                        isActive={product.isActive}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ── Recent sales & shipping ── */}
        <div className="mt-14 border-t border-[var(--color-border)] pt-12">
          <SectionHeading eyebrow="Orders" title="Recent sales & shipping" />
          <div className="dash-card mt-8 rounded-2xl p-6 md:p-8">
            <OrdersPanel orders={data.orders} />
          </div>
        </div>

        {/* ── Waitlist ── */}
        <div className="mt-14 border-t border-[var(--color-border)] pt-12">
          <SectionHeading eyebrow="Waitlist" title="Joined the list" />
          <div className="dash-card mt-8 rounded-2xl p-6 md:p-8">
            <WaitlistPanel signups={waitlist} />
          </div>
        </div>
      </div>
    </section>
  );
}
