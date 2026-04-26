import Link from "next/link";
import { logoutOwner } from "@/app/owner/actions";
import InventoryEditForm from "@/components/owner/InventoryEditForm";
import OrdersPanel from "@/components/owner/OrdersPanel";
import ProductOverrideForm from "@/components/owner/ProductOverrideForm";
import RevenueSparkline from "@/components/owner/RevenueSparkline";
import { getOwnerDashboardData } from "@/lib/inventory";
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
    <section className="relative min-h-screen overflow-hidden bg-[#f4e6da] text-[#3a222a]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(circle at 15% 10%, rgba(232,196,170,0.75), transparent 45%), radial-gradient(circle at 85% 0%, rgba(196,138,120,0.35), transparent 50%), radial-gradient(circle at 50% 110%, rgba(216,186,132,0.4), transparent 55%), linear-gradient(180deg,#fbf2e8 0%,#f1ddcb 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-4 py-8 md:px-8 md:py-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#a06b5a]">Dashboard for my love</p>
            <h1 className="mt-3 font-heading text-5xl font-normal tracking-[0.25em] text-[#3a222a] lowercase md:text-7xl">
              piece by piece
            </h1>
          </div>

          <form action={logoutOwner}>
            <button
              type="submit"
              className="rounded-full bg-white/40 px-6 py-3 text-xs uppercase tracking-[0.28em] text-[#7a4a53] shadow-[0_10px_30px_-15px_rgba(120,60,70,0.5)] backdrop-blur-sm transition hover:bg-white/70 hover:text-[#3a222a]"
            >
              Log out
            </button>
          </form>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {headlineStats.map(({ label, value, accent }) => {
            const surface =
              accent === "primary"
                ? "bg-[linear-gradient(160deg,#3a222a_0%,#5a3039_100%)] text-[#fbf2e8] shadow-[0_25px_60px_-25px_rgba(58,34,42,0.8)]"
                : accent === "warn"
                ? "bg-[linear-gradient(160deg,#c47f5a_0%,#a04638_100%)] text-[#fbf2e8] shadow-[0_25px_60px_-25px_rgba(160,70,56,0.6)]"
                : "bg-[linear-gradient(160deg,rgba(255,255,255,0.85)_0%,rgba(255,249,244,0.55)_100%)] text-[#3a222a] shadow-[0_20px_50px_-30px_rgba(120,60,70,0.45)]";
            const labelColor = accent ? "text-white/70" : "text-[#a06b5a]";
            return (
              <div
                key={label}
                className={`relative overflow-hidden rounded-[1.6rem] p-5 backdrop-blur-sm ${surface}`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/20 blur-2xl"
                />
                <p className={`relative text-[10px] uppercase tracking-[0.28em] ${labelColor}`}>{label}</p>
                <p className="relative mt-4 text-3xl font-light tracking-tight">{value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <RevenueSparkline series={data.overview.revenueSeries} />
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.75)_0%,rgba(252,243,238,0.55)_100%)] p-6 shadow-[0_30px_80px_-40px_rgba(120,60,70,0.35)] backdrop-blur-sm md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e8c4aa]/40 blur-3xl"
            />

            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#a06b5a]">Inventory</p>
                <h2 className="mt-2 font-heading text-3xl font-light text-[#3a222a] md:text-4xl">Live stock</h2>
              </div>
              <Link
                href="/collections/hand-chains"
                className="text-xs uppercase tracking-[0.2em] text-[#8a5a5e] underline underline-offset-8 decoration-[#c48a78]/50 transition hover:text-[#3a222a] hover:decoration-[#3a222a]"
              >
                View storefront
              </Link>
            </div>

            <dl className="relative mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#e8c4aa]/40 pt-5 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.24em] text-[#a06b5a]">Available</dt>
                <dd className="mt-1 text-2xl font-light text-[#3a222a]">{data.overview.unitsAvailable}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.24em] text-[#a06b5a]">Reserved</dt>
                <dd className="mt-1 text-2xl font-light text-[#3a222a]">{data.overview.reservedUnits}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.24em] text-[#a06b5a]">Running low</dt>
                <dd className={`mt-1 text-2xl font-light ${lowStockCount > 0 ? "text-[#a04638]" : "text-[#3a222a]"}`}>
                  {lowStockCount}
                </dd>
              </div>
            </dl>

            <div className="relative mt-8 space-y-6">
              {data.products.map((product) => {
                const leftColor = product.availableUnits === 0
                  ? "text-[#8a4a52]"
                  : product.isLowStock
                    ? "text-[#a04638]"
                    : "text-[#3a222a]";
                const leftLabel = product.availableUnits === 0
                  ? "Sold out"
                  : product.isLowStock
                    ? "Low stock"
                    : "Available";
                const stockFill = product.totalUnits > 0
                  ? Math.max(Math.min((product.availableUnits / product.totalUnits) * 100, 100), 0)
                  : 0;
                const barGradient = product.availableUnits === 0
                  ? "linear-gradient(90deg,#8a4a52,#5a3039)"
                  : product.isLowStock
                    ? "linear-gradient(90deg,#c47f5a,#a04638)"
                    : "linear-gradient(90deg,#9aab8e,#7f8f76)";

                return (
                  <article
                    key={product.productId}
                    className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(165deg,rgba(255,255,255,0.9)_0%,rgba(249,231,219,0.7)_100%)] p-6 shadow-[0_20px_50px_-30px_rgba(120,60,70,0.35)] ring-1 ring-white/60"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-[#c48a78]/15 blur-3xl"
                    />

                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-heading text-2xl font-light text-[#3a222a] md:text-3xl">{product.name}</p>
                          {!product.isActive ? (
                            <span className="rounded-full bg-[#3a222a]/90 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[#fbf2e8]">
                              Hidden
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-[#a06b5a]">{product.slug}</p>

                        <div className="mt-5">
                          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[#a06b5a]">
                            <span>{leftLabel}</span>
                            <span>{product.availableUnits} / {product.totalUnits}</span>
                          </div>
                          <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-[#3a222a]/8">
                            <div
                              className="h-full rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                              style={{ width: `${stockFill}%`, background: barGradient }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end gap-3 self-end sm:self-auto">
                        <span className={`font-heading text-6xl font-light leading-none md:text-7xl ${leftColor}`}>
                          {product.availableUnits}
                        </span>
                        <span className="pb-1 text-[11px] uppercase tracking-[0.26em] text-[#a06b5a]">
                          {leftLabel}
                        </span>
                      </div>
                    </div>

                    <div className="relative mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-[#e8c4aa]/40 pt-4 text-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.24em] text-[#a06b5a]">Sold</p>
                        <p className="mt-0.5 text-lg font-light text-[#3a222a]">{product.soldUnits}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.24em] text-[#a06b5a]">Reserved</p>
                        <p className="mt-0.5 text-lg font-light text-[#3a222a]">{product.reservedUnits}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-[#a06b5a]">Updated</p>
                        <p className="mt-0.5 text-xs font-light text-[#3a222a]">{formatDate(product.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="relative mt-6 grid gap-5 md:grid-cols-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a06b5a]">Stock</p>
                        <div className="mt-3">
                          <InventoryEditForm productId={product.productId} defaultValue={product.totalUnits} />
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a06b5a]">Pricing</p>
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

          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(252,243,238,0.6)_100%)] p-6 shadow-[0_30px_80px_-40px_rgba(120,60,70,0.35)] backdrop-blur-sm md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#d8ba84]/30 blur-3xl"
            />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#a06b5a]">Orders</p>
              <h2 className="mt-2 font-heading text-3xl font-light text-[#3a222a] md:text-4xl">Recent sales &amp; shipping</h2>
            </div>

            <div className="relative mt-6">
              <OrdersPanel orders={data.orders} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
