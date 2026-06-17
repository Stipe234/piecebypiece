"use client";

import { useMemo, useState } from "react";
import type { DashboardOrder } from "@/lib/inventory";
import RefundOrderButton from "@/components/owner/RefundOrderButton";
import ShippingEditForm from "@/components/owner/ShippingEditForm";

interface Props {
  orders: DashboardOrder[];
}

type Filter = "all" | "pending" | "packed" | "shipped" | "delivered" | "refunded";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "refunded", label: "Refunded" },
];

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatAddress(address: DashboardOrder["shippingAddress"]) {
  return [address.line1, address.line2, [address.postalCode, address.city].filter(Boolean).join(" "), address.country]
    .filter(Boolean)
    .join(", ");
}

export default function OrdersPanel({ orders }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return orders.filter((order) => {
      if (filter === "refunded") {
        if (!order.refundedAt) return false;
      } else if (filter !== "all") {
        if (order.shippingStatus !== filter) return false;
        if (order.refundedAt) return false;
      }

      if (query) {
        const hay = [
          order.customerName,
          order.customerEmail,
          order.customerPhone,
          order.stripeSessionId,
          order.trackingNumber,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }

      return true;
    });
  }, [orders, filter, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href="/api/owner/orders.csv"
          className="border border-[var(--color-border-dark)] px-5 py-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent-dark)] hover:text-[var(--color-text-inverse)]"
        >
          Export CSV
        </a>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, tracking..."
          className="flex-1 min-w-[200px] border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-border-dark)]"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors ${
                active
                  ? "bg-[var(--color-accent-dark)] text-[var(--color-text-inverse)]"
                  : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-dark)]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        {visible.length === 0 ? (
          <div className="border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-10 text-center text-sm text-[var(--color-text-tertiary)]">
            No orders match the current view.
          </div>
        ) : (
          visible.map((order) => (
            <div key={order.id} className="dash-inset rounded-2xl p-4 md:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {order.customerName || order.customerEmail || "Unknown customer"}
                    </p>
                    <span className="border border-[var(--color-border)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                      {order.shippingStatus}
                    </span>
                    {order.refundedAt ? (
                      <span className="bg-[var(--color-bg-tertiary)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--color-error)]">
                        Refunded {formatMoney(order.refundAmountCents, order.currency)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    {order.customerEmail || "No email"}{order.customerPhone ? ` • ${order.customerPhone}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{formatAddress(order.shippingAddress)}</p>

                  <dl className="mt-3 grid grid-cols-1 gap-x-5 gap-y-1 text-xs sm:grid-cols-3">
                    <div>
                      <dt className="uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">Paid</dt>
                      <dd className="mt-0.5 text-[var(--color-text-primary)]">{formatDate(order.paidAt ?? order.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">Fulfilled</dt>
                      <dd className="mt-0.5 text-[var(--color-text-primary)]">{formatDate(order.fulfilledAt)}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">Items</dt>
                      <dd className="mt-0.5 text-[var(--color-text-primary)]">{order.itemCount}</dd>
                    </div>
                  </dl>
                </div>

                <div className="text-left xl:text-right">
                  <p className="font-numeric text-2xl font-semibold text-[var(--color-text-primary)]">
                    {formatMoney(order.amountTotalCents, order.currency)}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
                    Session {order.stripeSessionId}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 shadow-[0_1px_2px_rgba(58,44,32,0.04)]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">Pieces</p>
                <div className="mt-3 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">{item.productName}</p>
                        <p className="text-[var(--color-text-secondary)]">
                          {item.material} / {item.length} • Qty {item.quantity}
                        </p>
                      </div>
                      <p className="font-numeric font-medium text-[var(--color-text-primary)]">{formatMoney(item.lineTotalCents, order.currency)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <ShippingEditForm
                orderId={order.id}
                currentStatus={order.shippingStatus}
                currentTracking={order.trackingNumber}
              />

              <div className="mt-4">
                <RefundOrderButton
                  orderId={order.id}
                  alreadyRefunded={Boolean(order.refundedAt)}
                  amountLabel={formatMoney(order.amountTotalCents, order.currency)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
