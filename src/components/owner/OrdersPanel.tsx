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
          className="rounded-full border border-[#c48a78]/40 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#7a4a53] transition hover:border-[#8a4a52] hover:text-[#3a222a]"
        >
          Export CSV
        </a>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, tracking..."
          className="flex-1 min-w-[200px] rounded-full border border-[#efd9cf] bg-white px-4 py-2 text-sm text-[#3a222a] placeholder:text-[#b69791] outline-none focus:border-[#c48a78]"
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
              className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition ${
                active
                  ? "bg-[#3a222a] text-white"
                  : "border border-[#c48a78]/40 text-[#7a4a53] hover:border-[#8a4a52]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        {visible.length === 0 ? (
          <div className="rounded-[1.25rem] border border-dashed border-[#e9c8be] bg-[#fcf3ee] px-5 py-10 text-center text-sm text-[#8a5a5e]">
            No orders match the current view.
          </div>
        ) : (
          visible.map((order) => (
            <div key={order.id} className="rounded-[1.25rem] border border-[#eed5cf] bg-[#fcf3ee] p-4 md:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-medium text-[#3a222a]">
                      {order.customerName || order.customerEmail || "Unknown customer"}
                    </p>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#8a5a5e]">
                      {order.shippingStatus}
                    </span>
                    {order.refundedAt ? (
                      <span className="rounded-full bg-[#f0dfe0] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#8a4a52]">
                        Refunded {formatMoney(order.refundAmountCents, order.currency)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-[#6b4852]">
                    {order.customerEmail || "No email"}{order.customerPhone ? ` • ${order.customerPhone}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-[#6b4852]">{formatAddress(order.shippingAddress)}</p>

                  <dl className="mt-3 grid grid-cols-1 gap-x-5 gap-y-1 text-xs sm:grid-cols-3">
                    <div>
                      <dt className="uppercase tracking-[0.18em] text-[#a06b5a]">Paid</dt>
                      <dd className="mt-0.5 text-[#3a222a]">{formatDate(order.paidAt ?? order.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.18em] text-[#a06b5a]">Fulfilled</dt>
                      <dd className="mt-0.5 text-[#3a222a]">{formatDate(order.fulfilledAt)}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.18em] text-[#a06b5a]">Items</dt>
                      <dd className="mt-0.5 text-[#3a222a]">{order.itemCount}</dd>
                    </div>
                  </dl>
                </div>

                <div className="text-left xl:text-right">
                  <p className="text-2xl font-medium text-[#3a222a]">
                    {formatMoney(order.amountTotalCents, order.currency)}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#a06b5a]">
                    Session {order.stripeSessionId}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[1.1rem] bg-white p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#a06b5a]">Pieces</p>
                <div className="mt-3 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-[#3a222a]">{item.productName}</p>
                        <p className="text-[#6b4852]">
                          {item.material} / {item.length} • Qty {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-[#3a222a]">{formatMoney(item.lineTotalCents, order.currency)}</p>
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
