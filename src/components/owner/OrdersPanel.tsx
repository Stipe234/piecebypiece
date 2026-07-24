"use client";

import { useMemo, useState } from "react";
import type { DashboardOrder, ShippingStatus } from "@/lib/inventory";
import RefundOrderButton from "@/components/owner/RefundOrderButton";
import ShippingEditForm from "@/components/owner/ShippingEditForm";

interface Props {
  orders: DashboardOrder[];
}

type Filter = "all" | "pending" | "packed" | "shipped" | "delivered" | "refunded";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "To pack" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "refunded", label: "Refunded" },
];

const STATUS_LABELS: Record<ShippingStatus, string> = {
  pending: "To pack",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
};

// Status reads at a glance: unshipped work is outlined, in-flight is solid black,
// finished is green.
const STATUS_STYLES: Record<ShippingStatus, string> = {
  pending: "border border-[var(--color-border-dark)] text-[var(--color-text-primary)]",
  packed: "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]",
  shipped: "bg-[var(--color-accent-dark)] text-[var(--color-text-inverse)]",
  delivered: "bg-[var(--color-success)] text-[var(--color-text-inverse)]",
};

const labelClass = "text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]";

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

function addressLines(order: DashboardOrder): string[] {
  const { shippingAddress: a } = order;
  return [
    order.customerName,
    a.line1,
    a.line2,
    [a.postalCode, a.city].filter(Boolean).join(" "),
    a.country,
  ].filter((line): line is string => Boolean(line && line.trim()));
}

/** Copies the delivery address so it can be pasted straight into the GLS app. */
function CopyAddressButton({ lines, phone }: { lines: string[]; phone: string | null }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = [...lines, phone].filter(Boolean).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-tertiary)] underline underline-offset-4 transition-colors hover:text-[var(--color-text-primary)]"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
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
          order.id,
          order.trackingNumber,
          order.trackingUrl,
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
          placeholder="Search name, email, order no..."
          className="min-w-[200px] flex-1 border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-border-dark)]"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          const count =
            f.value === "all"
              ? orders.length
              : f.value === "refunded"
                ? orders.filter((o) => o.refundedAt).length
                : orders.filter((o) => o.shippingStatus === f.value && !o.refundedAt).length;

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
              {f.label} <span className="tabular-nums opacity-60">{count}</span>
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
          visible.map((order) => {
            const lines = addressLines(order);
            // Short, human reference — enough to quote back to a customer.
            const reference = order.id.slice(0, 8).toUpperCase();

            return (
              <article key={order.id} className="dash-inset rounded-2xl p-4 md:p-6">
                {/* ── Who, and how much ── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-medium text-[var(--color-text-primary)]">
                        {order.customerName || order.customerEmail || "Unknown customer"}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${STATUS_STYLES[order.shippingStatus]}`}
                      >
                        {STATUS_LABELS[order.shippingStatus]}
                      </span>
                      {order.refundedAt ? (
                        <span className="rounded-full bg-[var(--color-bg-tertiary)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-error)]">
                          Refunded {formatMoney(order.refundAmountCents, order.currency)}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 truncate text-sm text-[var(--color-text-secondary)]">
                      {order.customerEmail || "No email"}
                      {order.customerPhone ? ` · ${order.customerPhone}` : ""}
                    </p>
                    <p className="font-numeric mt-1 text-xs text-[var(--color-text-tertiary)]">
                      No. {reference} · {formatDate(order.paidAt ?? order.createdAt)}
                    </p>
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    <p className="font-numeric text-2xl font-semibold text-[var(--color-text-primary)]">
                      {formatMoney(order.amountTotalCents, order.currency)}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                      {order.itemCount} {order.itemCount === 1 ? "piece" : "pieces"}
                    </p>
                  </div>
                </div>

                {/* ── What to send, and where ── */}
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className={labelClass}>Deliver to</p>
                      {lines.length > 0 ? <CopyAddressButton lines={lines} phone={order.customerPhone} /> : null}
                    </div>
                    {lines.length > 0 ? (
                      <address className="mt-2 text-sm not-italic leading-relaxed text-[var(--color-text-primary)]">
                        {lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                    ) : (
                      <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">No address on file.</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
                    <p className={labelClass}>Pieces</p>
                    <div className="mt-2 flex flex-col gap-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--color-text-primary)]">{item.productName}</p>
                            <p className="text-[var(--color-text-secondary)]">
                              {[item.material, item.style, item.length].filter(Boolean).join(" · ")} · Qty{" "}
                              {item.quantity}
                            </p>
                          </div>
                          <p className="font-numeric shrink-0 font-medium text-[var(--color-text-primary)]">
                            {formatMoney(item.lineTotalCents, order.currency)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <ShippingEditForm
                  orderId={order.id}
                  currentStatus={order.shippingStatus}
                  currentTrackingUrl={order.trackingUrl}
                />

                <div className="mt-4">
                  <RefundOrderButton
                    orderId={order.id}
                    alreadyRefunded={Boolean(order.refundedAt)}
                    amountLabel={formatMoney(order.amountTotalCents, order.currency)}
                  />
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
