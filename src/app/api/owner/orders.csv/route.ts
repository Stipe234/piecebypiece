import { NextResponse } from "next/server";
import { getAllOrdersForExport } from "@/lib/inventory";
import { isOwnerAuthenticated } from "@/lib/owner-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toRow(values: unknown[]): string {
  return values.map(csvEscape).join(",");
}

export async function GET() {
  if (!(await isOwnerAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orders, items } = await getAllOrdersForExport();

  type Item = (typeof items)[number];
  const itemsByOrder = items.reduce<Record<string, Item[]>>((acc, item) => {
    acc[item.order_id] ??= [];
    acc[item.order_id].push(item);
    return acc;
  }, {});

  const header = [
    "order_id",
    "stripe_session_id",
    "created_at",
    "paid_at",
    "fulfilled_at",
    "refunded_at",
    "shipping_status",
    "tracking_number",
    "customer_name",
    "customer_email",
    "customer_phone",
    "shipping_line1",
    "shipping_line2",
    "shipping_city",
    "shipping_postal_code",
    "shipping_country",
    "currency",
    "amount_total_cents",
    "refund_amount_cents",
    "product_slug",
    "product_name",
    "material",
    "length",
    "quantity",
    "unit_price_cents",
    "line_total_cents",
  ];

  const rows: string[] = [toRow(header)];

  for (const order of orders) {
    const orderItems = itemsByOrder[order.id] ?? [];

    if (orderItems.length === 0) {
      rows.push(
        toRow([
          order.id,
          order.stripe_session_id,
          order.created_at,
          order.paid_at ?? "",
          order.fulfilled_at ?? "",
          order.refunded_at ?? "",
          order.shipping_status,
          order.tracking_number ?? "",
          order.customer_name ?? "",
          order.customer_email ?? "",
          order.customer_phone ?? "",
          order.shipping_line1 ?? "",
          order.shipping_line2 ?? "",
          order.shipping_city ?? "",
          order.shipping_postal_code ?? "",
          order.shipping_country ?? "",
          order.currency,
          order.amount_total_cents,
          order.refund_amount_cents,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ]),
      );
      continue;
    }

    for (const item of orderItems) {
      rows.push(
        toRow([
          order.id,
          order.stripe_session_id,
          order.created_at,
          order.paid_at ?? "",
          order.fulfilled_at ?? "",
          order.refunded_at ?? "",
          order.shipping_status,
          order.tracking_number ?? "",
          order.customer_name ?? "",
          order.customer_email ?? "",
          order.customer_phone ?? "",
          order.shipping_line1 ?? "",
          order.shipping_line2 ?? "",
          order.shipping_city ?? "",
          order.shipping_postal_code ?? "",
          order.shipping_country ?? "",
          order.currency,
          order.amount_total_cents,
          order.refund_amount_cents,
          item.product_slug,
          item.product_name,
          item.material,
          item.length,
          item.quantity,
          item.unit_price_cents,
          item.line_total_cents,
        ]),
      );
    }
  }

  const body = rows.join("\n") + "\n";
  const filename = `pbp-orders-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
