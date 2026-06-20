import { randomUUID } from "node:crypto";
import type { Stripe } from "stripe";
import { getProductVariants, products } from "@/data/products";
import { getSql } from "@/lib/db";

type ReservationStatus = "pending" | "completed" | "released" | "expired";
export type ShippingStatus = "pending" | "packed" | "shipped" | "delivered";

export interface ReservationLineItem {
  productId: string;
  quantity: number;
  material: string;
  style: string;
  length: string;
  unitPriceCents: number;
  productName: string;
  productSlug: string;
}

export interface ProductAvailability {
  productId: string;
  totalUnits: number;
  reservedUnits: number;
  soldUnits: number;
  availableUnits: number;
  isSoldOut: boolean;
  priceCents: number | null;
  isActive: boolean;
  variants: VariantAvailability[];
}

export interface VariantAvailability {
  productId: string;
  variantKey: string;
  material: string;
  style: string;
  totalUnits: number;
  reservedUnits: number;
  soldUnits: number;
  availableUnits: number;
  isSoldOut: boolean;
  priceCents: number | null;
}

interface InventoryRow {
  product_id: string;
  total_units: number;
  reserved_units: number;
  sold_units: number;
}

interface VariantInventoryRow {
  product_id: string;
  material: string;
  style: string;
  total_units: number;
  reserved_units: number;
  sold_units: number;
  price_cents: number | null;
  updated_at: string;
}

interface ReservationRow {
  id: string;
  status: ReservationStatus;
  line_items_json?: ReservationLineItem[];
}

interface InventorySummaryRow {
  product_id: string;
  total_units: number;
  reserved_units: number;
  sold_units: number;
  updated_at: string;
  price_cents: number | null;
  is_active: boolean | null;
}

interface OrderRow {
  id: string;
  stripe_session_id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_status: ShippingStatus;
  tracking_number: string | null;
  amount_total_cents: number;
  currency: string;
  item_count: number;
  shipping_city: string | null;
  shipping_country: string | null;
  shipping_postal_code: string | null;
  shipping_line1: string | null;
  shipping_line2: string | null;
  created_at: string;
  paid_at: string | null;
  fulfilled_at: string | null;
  refunded_at: string | null;
  refund_amount_cents: number;
}

interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_slug: string;
  product_name: string;
  material: string;
  style: string | null;
  length: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
}

export const LOW_STOCK_THRESHOLD = 2;

export interface DashboardOverview {
  revenueCents: number;
  totalOrders: number;
  unitsSold: number;
  unitsAvailable: number;
  reservedUnits: number;
  pendingShipments: number;
  refundedCents: number;
  revenueSeries: Array<{ date: string; revenueCents: number; orderCount: number }>;
}

export interface DashboardVariant {
  variantKey: string;
  material: string;
  style: string;
  label: string;
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  availableUnits: number;
  isLowStock: boolean;
  priceCents: number;
  updatedAt: string;
}

export interface DashboardProduct {
  productId: string;
  slug: string;
  name: string;
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  availableUnits: number;
  isLowStock: boolean;
  updatedAt: string;
  priceCents: number;
  isActive: boolean;
  variants: DashboardVariant[];
}

export interface DashboardOrder {
  id: string;
  stripeSessionId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingStatus: ShippingStatus;
  trackingNumber: string | null;
  amountTotalCents: number;
  currency: string;
  itemCount: number;
  createdAt: string;
  paidAt: string | null;
  fulfilledAt: string | null;
  refundedAt: string | null;
  refundAmountCents: number;
  shippingAddress: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
  };
  items: Array<{
    id: string;
    productId: string;
    productSlug: string;
    productName: string;
    material: string;
    length: string;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }>;
}

export interface OwnerDashboardData {
  overview: DashboardOverview;
  products: DashboardProduct[];
  orders: DashboardOrder[];
}

export class InventoryError extends Error {
  constructor(message: string, public readonly productId?: string) {
    super(message);
    this.name = "InventoryError";
  }
}

let schemaReady: Promise<void> | null = null;

export async function ensureInventoryReady() {
  if (!schemaReady) {
    const sql = getSql();

    schemaReady = (async () => {
      await sql`
        create table if not exists inventory_items (
          product_id text primary key,
          total_units integer not null check (total_units >= 0),
          reserved_units integer not null default 0 check (reserved_units >= 0),
          sold_units integer not null default 0 check (sold_units >= 0),
          updated_at timestamptz not null default now()
        )
      `;

      await sql`
        create table if not exists stock_reservations (
          id text primary key,
          stripe_session_id text unique,
          status text not null check (status in ('pending', 'completed', 'released', 'expired')),
          line_items_json jsonb not null default '[]'::jsonb,
          expires_at timestamptz not null,
          created_at timestamptz not null default now(),
          completed_at timestamptz,
          released_at timestamptz
        )
      `;

      await sql`
        create table if not exists stock_reservation_items (
          reservation_id text not null references stock_reservations(id) on delete cascade,
          product_id text not null references inventory_items(product_id) on delete cascade,
          quantity integer not null check (quantity > 0),
          primary key (reservation_id, product_id)
        )
      `;

      // Per-variant stock is the source of truth (material × style). Product-level
      // inventory_items rows remain only as the FK target / override anchor.
      await sql`
        create table if not exists variant_inventory (
          product_id text not null references inventory_items(product_id) on delete cascade,
          material text not null,
          style text not null,
          total_units integer not null check (total_units >= 0),
          reserved_units integer not null default 0 check (reserved_units >= 0),
          sold_units integer not null default 0 check (sold_units >= 0),
          price_cents integer check (price_cents is null or price_cents >= 0),
          updated_at timestamptz not null default now(),
          primary key (product_id, material, style)
        )
      `;

      // Per-variant price (added for existing databases).
      await sql`
        alter table variant_inventory
        add column if not exists price_cents integer
      `;

      // Reservation items become variant-scoped. Add the columns, then widen the PK
      // to include them (safe + idempotent for existing rows, which get '' defaults).
      await sql`
        alter table stock_reservation_items
        add column if not exists material text not null default '',
        add column if not exists style text not null default ''
      `;

      await sql`
        alter table stock_reservation_items
        drop constraint if exists stock_reservation_items_pkey
      `;

      await sql`
        alter table stock_reservation_items
        add primary key (reservation_id, product_id, material, style)
      `;

      await sql`
        alter table stock_reservations
        add column if not exists line_items_json jsonb not null default '[]'::jsonb
      `;

      await sql`
        create table if not exists orders (
          id text primary key,
          stripe_session_id text not null unique,
          reservation_id text references stock_reservations(id) on delete set null,
          customer_name text,
          customer_email text,
          customer_phone text,
          shipping_status text not null default 'pending' check (shipping_status in ('pending', 'packed', 'shipped', 'delivered')),
          tracking_number text,
          amount_total_cents integer not null default 0,
          currency text not null default 'eur',
          item_count integer not null default 0,
          shipping_line1 text,
          shipping_line2 text,
          shipping_city text,
          shipping_postal_code text,
          shipping_country text,
          shipping_json jsonb,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          paid_at timestamptz,
          fulfilled_at timestamptz
        )
      `;

      await sql`
        create table if not exists order_items (
          id text primary key,
          order_id text not null references orders(id) on delete cascade,
          product_id text not null references inventory_items(product_id),
          product_slug text not null,
          product_name text not null,
          material text not null,
          length text not null,
          quantity integer not null check (quantity > 0),
          unit_price_cents integer not null check (unit_price_cents >= 0),
          line_total_cents integer not null check (line_total_cents >= 0)
        )
      `;

      await sql`
        alter table order_items
        add column if not exists style text
      `;

      await sql`
        alter table orders
        add column if not exists refunded_at timestamptz,
        add column if not exists refund_amount_cents integer not null default 0,
        add column if not exists stripe_payment_intent_id text
      `;

      await sql`
        create table if not exists product_overrides (
          product_id text primary key references inventory_items(product_id) on delete cascade,
          price_cents integer check (price_cents is null or price_cents >= 0),
          is_active boolean not null default true,
          display_name text,
          updated_at timestamptz not null default now()
        )
      `;

      for (const product of products) {
        const basePriceCents = Math.round(product.price * 100);

        await sql`
          insert into inventory_items (product_id, total_units)
          values (${product.id}, ${product.inventory.totalUnits})
          on conflict (product_id) do nothing
        `;

        await sql`
          insert into product_overrides (product_id, price_cents, is_active)
          values (${product.id}, ${basePriceCents}, true)
          on conflict (product_id) do nothing
        `;

        // Seed one stock row per variant. Each variant starts at the product's
        // configured units and base price; the owner sets real per-variant
        // counts and prices in the dashboard.
        for (const variant of getProductVariants(product)) {
          await sql`
            insert into variant_inventory (product_id, material, style, total_units, price_cents)
            values (${product.id}, ${variant.material}, ${variant.style}, ${product.inventory.totalUnits}, ${basePriceCents})
            on conflict (product_id, material, style) do nothing
          `;
        }

        // Backfill price for variant rows created before per-variant pricing.
        await sql`
          update variant_inventory set price_cents = ${basePriceCents}
          where product_id = ${product.id} and price_cents is null
        `;
      }
    })();
  }

  await schemaReady;
}

export async function releaseExpiredReservations() {
  await ensureInventoryReady();
  const sql = getSql();

  await sql.begin(async (tx) => {
    const expiredReservations = await tx<{ id: string }[]>`
      update stock_reservations
      set status = 'expired', released_at = coalesce(released_at, now())
      where status = 'pending'
        and expires_at <= now()
      returning id
    `;

    if (expiredReservations.length === 0) {
      return;
    }

    const reservationIds = expiredReservations.map(({ id }) => id);

    const reservedItems = await tx<{ product_id: string; quantity: number }[]>`
      select product_id, sum(quantity)::int as quantity
      from stock_reservation_items
      where reservation_id = any(${tx.array(reservationIds)})
      group by product_id
    `;

    for (const item of reservedItems) {
      await tx`
        update inventory_items
        set reserved_units = greatest(reserved_units - ${item.quantity}, 0),
            updated_at = now()
        where product_id = ${item.product_id}
      `;
    }
  });
}

export async function getAvailabilityMap(productIds?: string[]) {
  await ensureInventoryReady();
  await releaseExpiredReservations();
  const sql = getSql();

  const overrideRows = productIds && productIds.length > 0
    ? await sql<{ product_id: string; price_cents: number | null; is_active: boolean | null }[]>`
        select i.product_id, o.price_cents, o.is_active
        from inventory_items i
        left join product_overrides o on o.product_id = i.product_id
        where i.product_id = any(${sql.array(productIds)})
      `
    : await sql<{ product_id: string; price_cents: number | null; is_active: boolean | null }[]>`
        select i.product_id, o.price_cents, o.is_active
        from inventory_items i
        left join product_overrides o on o.product_id = i.product_id
      `;

  const variantRows = productIds && productIds.length > 0
    ? await sql<VariantInventoryRow[]>`
        select product_id, material, style, total_units, reserved_units, sold_units, price_cents, updated_at::text
        from variant_inventory
        where product_id = any(${sql.array(productIds)})
        order by product_id, material, style
      `
    : await sql<VariantInventoryRow[]>`
        select product_id, material, style, total_units, reserved_units, sold_units, price_cents, updated_at::text
        from variant_inventory
        order by product_id, material, style
      `;

  const variantsByProduct = new Map<string, VariantAvailability[]>();
  for (const row of variantRows) {
    const availableUnits = Math.max(row.total_units - row.reserved_units - row.sold_units, 0);
    const list = variantsByProduct.get(row.product_id) ?? [];
    list.push({
      productId: row.product_id,
      variantKey: `${row.material}|${row.style}`,
      material: row.material,
      style: row.style,
      totalUnits: row.total_units,
      reservedUnits: row.reserved_units,
      soldUnits: row.sold_units,
      availableUnits,
      isSoldOut: availableUnits === 0,
      priceCents: row.price_cents,
    });
    variantsByProduct.set(row.product_id, list);
  }

  // variant_inventory is the source of truth; product-level numbers aggregate
  // from the variants so the storefront and dashboard always agree.
  return Object.fromEntries(
    overrideRows.map((row) => {
      const variants = variantsByProduct.get(row.product_id) ?? [];
      const totalUnits = variants.reduce((s, v) => s + v.totalUnits, 0);
      const reservedUnits = variants.reduce((s, v) => s + v.reservedUnits, 0);
      const soldUnits = variants.reduce((s, v) => s + v.soldUnits, 0);
      const availableUnits = variants.reduce((s, v) => s + v.availableUnits, 0);

      return [
        row.product_id,
        {
          productId: row.product_id,
          totalUnits,
          reservedUnits,
          soldUnits,
          availableUnits,
          isSoldOut: availableUnits === 0,
          priceCents: row.price_cents,
          isActive: row.is_active ?? true,
          variants,
        } satisfies ProductAvailability,
      ];
    }),
  ) as Record<string, ProductAvailability>;
}

export async function createReservation(items: ReservationLineItem[], sessionExpiresAt: Date) {
  await ensureInventoryReady();
  await releaseExpiredReservations();
  const sql = getSql();

  const normalizedItems = Object.values(
    items.reduce<Record<string, { productId: string; quantity: number }>>((acc, item) => {
      const existing = acc[item.productId];
      acc[item.productId] = existing
        ? { ...existing, quantity: existing.quantity + item.quantity }
        : { productId: item.productId, quantity: item.quantity };
      return acc;
    }, {}),
  );

  const reservationId = randomUUID();

  await sql.begin(async (tx) => {
    await tx`
      insert into stock_reservations (id, status, line_items_json, expires_at)
      values (${reservationId}, 'pending', ${JSON.stringify(items)}::jsonb, ${sessionExpiresAt.toISOString()})
    `;

    for (const item of normalizedItems) {
      const updatedRows = await tx<InventoryRow[]>`
        update inventory_items
        set reserved_units = reserved_units + ${item.quantity},
            updated_at = now()
        where product_id = ${item.productId}
          and (total_units - sold_units - reserved_units) >= ${item.quantity}
        returning product_id, total_units, reserved_units, sold_units
      `;

      if (updatedRows.length === 0) {
        throw new InventoryError("This piece just sold out.", item.productId);
      }

      await tx`
        insert into stock_reservation_items (reservation_id, product_id, quantity)
        values (${reservationId}, ${item.productId}, ${item.quantity})
      `;
    }
  });

  return reservationId;
}

export async function attachReservationSession(reservationId: string, sessionId: string) {
  await ensureInventoryReady();
  const sql = getSql();

  await sql`
    update stock_reservations
    set stripe_session_id = ${sessionId}
    where id = ${reservationId}
  `;
}

export async function releaseReservationById(reservationId: string) {
  await ensureInventoryReady();
  const sql = getSql();

  await sql.begin(async (tx) => {
    const reservations = await tx<ReservationRow[]>`
      select id, status
      from stock_reservations
      where id = ${reservationId}
      for update
    `;

    const reservation = reservations[0];

    if (!reservation || reservation.status !== "pending") {
      return;
    }

    const items = await tx<{ product_id: string; quantity: number }[]>`
      select product_id, quantity
      from stock_reservation_items
      where reservation_id = ${reservationId}
    `;

    for (const item of items) {
      await tx`
        update inventory_items
        set reserved_units = greatest(reserved_units - ${item.quantity}, 0),
            updated_at = now()
        where product_id = ${item.product_id}
      `;
    }

    await tx`
      update stock_reservations
      set status = 'released', released_at = now()
      where id = ${reservationId}
    `;
  });
}

export async function releaseReservationBySession(sessionId: string) {
  await ensureInventoryReady();
  const sql = getSql();

  const rows = await sql<{ id: string }[]>`
    select id
    from stock_reservations
    where stripe_session_id = ${sessionId}
    limit 1
  `;

  const reservationId = rows[0]?.id;

  if (!reservationId) {
    return;
  }

  await releaseReservationById(reservationId);
}

export async function completeReservationFromSession(session: Stripe.Checkout.Session) {
  await ensureInventoryReady();
  await releaseExpiredReservations();
  const sql = getSql();

  const reservationId = session.metadata?.reservationId;

  if (!reservationId) {
    throw new InventoryError("Checkout session is missing reservation metadata.");
  }

  await sql.begin(async (tx) => {
    const reservations = await tx<ReservationRow[]>`
      select id, status, line_items_json
      from stock_reservations
      where id = ${reservationId}
      for update
    `;

    const reservation = reservations[0];

    if (!reservation) {
      throw new InventoryError("Reservation not found.", reservationId);
    }

    if (reservation.status === "completed") {
      return;
    }

    if (reservation.status !== "pending") {
      throw new InventoryError("Reservation is no longer active.", reservationId);
    }

    const items = await tx<{ product_id: string; quantity: number }[]>`
      select product_id, quantity
      from stock_reservation_items
      where reservation_id = ${reservationId}
    `;

    for (const item of items) {
      await tx`
        update inventory_items
        set reserved_units = greatest(reserved_units - ${item.quantity}, 0),
            sold_units = sold_units + ${item.quantity},
            updated_at = now()
        where product_id = ${item.product_id}
      `;
    }

    await tx`
      update stock_reservations
      set status = 'completed',
          stripe_session_id = coalesce(stripe_session_id, ${session.id}),
          completed_at = now()
      where id = ${reservationId}
    `;

    const existingOrders = await tx<{ id: string }[]>`
      select id
      from orders
      where stripe_session_id = ${session.id}
      limit 1
    `;

    if (existingOrders.length > 0) {
      return;
    }

    const lineItems = (reservations[0].line_items_json ?? []) as ReservationLineItem[];
    const orderId = randomUUID();
    const shipping = session.customer_details?.address;
    const customerName = session.customer_details?.name ?? null;
    const customerEmail = session.customer_details?.email ?? null;
    const customerPhone = session.customer_details?.phone ?? null;
    const amountTotalCents = session.amount_total ?? 0;
    const currency = session.currency ?? "eur";
    const itemCount = lineItems.reduce((sum, item) => sum + item.quantity, 0);

    const paymentIntentId = typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

    await tx`
      insert into orders (
        id,
        stripe_session_id,
        stripe_payment_intent_id,
        reservation_id,
        customer_name,
        customer_email,
        customer_phone,
        amount_total_cents,
        currency,
        item_count,
        shipping_line1,
        shipping_line2,
        shipping_city,
        shipping_postal_code,
        shipping_country,
        shipping_json,
        paid_at,
        updated_at
      )
      values (
        ${orderId},
        ${session.id},
        ${paymentIntentId},
        ${reservationId},
        ${customerName},
        ${customerEmail},
        ${customerPhone},
        ${amountTotalCents},
        ${currency},
        ${itemCount},
        ${shipping?.line1 ?? null},
        ${shipping?.line2 ?? null},
        ${shipping?.city ?? null},
        ${shipping?.postal_code ?? null},
        ${shipping?.country ?? null},
        ${JSON.stringify(session.customer_details ?? null)}::jsonb,
        now(),
        now()
      )
    `;

    for (const item of lineItems) {
      await tx`
        insert into order_items (
          id,
          order_id,
          product_id,
          product_slug,
          product_name,
          material,
          length,
          quantity,
          unit_price_cents,
          line_total_cents
        )
        values (
          ${randomUUID()},
          ${orderId},
          ${item.productId},
          ${item.productSlug},
          ${item.productName},
          ${item.material},
          ${item.length},
          ${item.quantity},
          ${item.unitPriceCents},
          ${item.unitPriceCents * item.quantity}
        )
      `;
    }
  });
}

export async function getOwnerDashboardData(): Promise<OwnerDashboardData> {
  await ensureInventoryReady();
  await releaseExpiredReservations();
  const sql = getSql();

  const [inventoryRows, orderRows, overviewRows, seriesRows] = await Promise.all([
    sql<InventorySummaryRow[]>`
      select
        i.product_id,
        i.total_units,
        i.reserved_units,
        i.sold_units,
        i.updated_at::text,
        o.price_cents,
        o.is_active
      from inventory_items i
      left join product_overrides o on o.product_id = i.product_id
      order by i.updated_at desc
    `,
    sql<OrderRow[]>`
      select
        id,
        stripe_session_id,
        customer_name,
        customer_email,
        customer_phone,
        shipping_status,
        tracking_number,
        amount_total_cents,
        currency,
        item_count,
        shipping_city,
        shipping_country,
        shipping_postal_code,
        shipping_line1,
        shipping_line2,
        created_at::text,
        paid_at::text,
        fulfilled_at::text,
        refunded_at::text,
        refund_amount_cents
      from orders
      order by created_at desc
      limit 50
    `,
    sql<{
      revenue_cents: number | null;
      total_orders: number;
      units_sold: number | null;
      units_available: number | null;
      reserved_units: number | null;
      pending_shipments: number;
      refunded_cents: number | null;
    }[]>`
      select
        coalesce((select sum(amount_total_cents - refund_amount_cents) from orders), 0) as revenue_cents,
        (select count(*)::int from orders) as total_orders,
        coalesce((select sum(sold_units) from inventory_items), 0) as units_sold,
        coalesce((select sum(greatest(total_units - reserved_units - sold_units, 0)) from inventory_items), 0) as units_available,
        coalesce((select sum(reserved_units) from inventory_items), 0) as reserved_units,
        (select count(*)::int from orders where shipping_status in ('pending', 'packed') and refunded_at is null) as pending_shipments,
        coalesce((select sum(refund_amount_cents) from orders), 0) as refunded_cents
    `,
    sql<{ day: string; revenue_cents: number; order_count: number }[]>`
      with days as (
        select generate_series(
          (current_date - interval '29 days')::date,
          current_date,
          interval '1 day'
        )::date as day
      )
      select
        to_char(days.day, 'YYYY-MM-DD') as day,
        coalesce(sum(orders.amount_total_cents - orders.refund_amount_cents), 0)::int as revenue_cents,
        count(orders.id)::int as order_count
      from days
      left join orders on orders.created_at::date = days.day
      group by days.day
      order by days.day asc
    `,
  ]);

  const orderIds = orderRows.map((row) => row.id);
  const orderItemRows = orderIds.length === 0
    ? []
    : await sql<OrderItemRow[]>`
        select
          id,
          order_id,
          product_id,
          product_slug,
          product_name,
          material,
          length,
          quantity,
          unit_price_cents,
          line_total_cents
        from order_items
        where order_id = any(${sql.array(orderIds)})
      `;

  const variantRows = await sql<{
    product_id: string;
    material: string;
    style: string;
    total_units: number;
    reserved_units: number;
    sold_units: number;
    price_cents: number | null;
    updated_at: string;
  }[]>`
    select product_id, material, style, total_units, reserved_units, sold_units, price_cents, updated_at::text
    from variant_inventory
    order by product_id, material, style
  `;

  const variantRowByKey = new Map<string, (typeof variantRows)[number]>();
  for (const row of variantRows) {
    variantRowByKey.set(`${row.product_id}|${row.material}|${row.style}`, row);
  }

  const overridesByProduct = new Map(
    inventoryRows.map((row) => [row.product_id, { priceCents: row.price_cents, isActive: row.is_active }]),
  );

  // Catalog-driven: only real products and their exact material × style
  // variants. variant_inventory is the source of truth for counts; stray rows
  // from earlier seeds are ignored, so no phantom products appear.
  const dashboardProducts: DashboardProduct[] = products.map((product) => {
    const variants: DashboardVariant[] = getProductVariants(product).map((v) => {
      const row = variantRowByKey.get(`${product.id}|${v.material}|${v.style}`);
      const totalUnits = row?.total_units ?? 0;
      const reservedUnits = row?.reserved_units ?? 0;
      const soldUnits = row?.sold_units ?? 0;
      const availableUnits = Math.max(totalUnits - reservedUnits - soldUnits, 0);
      return {
        variantKey: v.key,
        material: v.material,
        style: v.style,
        label: v.label,
        totalUnits,
        soldUnits,
        reservedUnits,
        availableUnits,
        isLowStock: availableUnits > 0 && availableUnits <= LOW_STOCK_THRESHOLD,
        priceCents: row?.price_cents ?? Math.round(product.price * 100),
        updatedAt: row?.updated_at ?? "",
      };
    });

    const totalUnits = variants.reduce((s, v) => s + v.totalUnits, 0);
    const soldUnits = variants.reduce((s, v) => s + v.soldUnits, 0);
    const reservedUnits = variants.reduce((s, v) => s + v.reservedUnits, 0);
    const availableUnits = variants.reduce((s, v) => s + v.availableUnits, 0);
    const updatedAt = variants.reduce((latest, v) => (v.updatedAt > latest ? v.updatedAt : latest), "");
    const override = overridesByProduct.get(product.id);

    return {
      productId: product.id,
      slug: product.slug,
      name: product.content.en.name,
      totalUnits,
      soldUnits,
      reservedUnits,
      availableUnits,
      isLowStock: availableUnits > 0 && availableUnits <= LOW_STOCK_THRESHOLD,
      updatedAt: updatedAt || new Date().toISOString(),
      priceCents: override?.priceCents ?? Math.round(product.price * 100),
      isActive: override?.isActive ?? true,
      variants,
    };
  });

  const inventoryTotals = dashboardProducts.reduce(
    (acc, p) => {
      acc.sold += p.soldUnits;
      acc.available += p.availableUnits;
      acc.reserved += p.reservedUnits;
      return acc;
    },
    { sold: 0, available: 0, reserved: 0 },
  );

  const overview = overviewRows[0];
  const orderItemsByOrder = orderItemRows.reduce<Record<string, DashboardOrder["items"]>>((acc, item) => {
    acc[item.order_id] ??= [];
    acc[item.order_id].push({
      id: item.id,
      productId: item.product_id,
      productSlug: item.product_slug,
      productName: item.product_name,
      material: item.material,
      length: item.length,
      quantity: item.quantity,
      unitPriceCents: item.unit_price_cents,
      lineTotalCents: item.line_total_cents,
    });
    return acc;
  }, {});

  return {
    overview: {
      revenueCents: overview?.revenue_cents ?? 0,
      totalOrders: overview?.total_orders ?? 0,
      unitsSold: inventoryTotals.sold,
      unitsAvailable: inventoryTotals.available,
      reservedUnits: inventoryTotals.reserved,
      pendingShipments: overview?.pending_shipments ?? 0,
      refundedCents: overview?.refunded_cents ?? 0,
      revenueSeries: seriesRows.map((row) => ({
        date: row.day,
        revenueCents: row.revenue_cents,
        orderCount: row.order_count,
      })),
    },
    products: dashboardProducts,
    orders: orderRows.map((row) => ({
      id: row.id,
      stripeSessionId: row.stripe_session_id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      shippingStatus: row.shipping_status,
      trackingNumber: row.tracking_number,
      amountTotalCents: row.amount_total_cents,
      currency: row.currency,
      itemCount: row.item_count,
      createdAt: row.created_at,
      paidAt: row.paid_at,
      fulfilledAt: row.fulfilled_at,
      refundedAt: row.refunded_at,
      refundAmountCents: row.refund_amount_cents,
      shippingAddress: {
        line1: row.shipping_line1,
        line2: row.shipping_line2,
        city: row.shipping_city,
        postalCode: row.shipping_postal_code,
        country: row.shipping_country,
      },
      items: orderItemsByOrder[row.id] ?? [],
    })),
  };
}

/** Set the stock total for one material × style variant (source of truth). */
/** Set the stock total and price for one material × style variant. */
export async function updateVariant(
  productId: string,
  material: string,
  style: string,
  totalUnits: number,
  priceCents: number,
) {
  await ensureInventoryReady();
  const sql = getSql();

  if (!Number.isInteger(totalUnits) || totalUnits < 0) {
    throw new InventoryError("Total inventory must be a non-negative whole number.", productId);
  }
  if (!Number.isInteger(priceCents) || priceCents < 0) {
    throw new InventoryError("Enter a valid price.", productId);
  }

  // Upsert: create the variant row if missing, otherwise update — but never
  // drop the stock total below what's already sold + reserved.
  const rows = await sql<{ product_id: string }[]>`
    insert into variant_inventory (product_id, material, style, total_units, price_cents)
    values (${productId}, ${material}, ${style}, ${totalUnits}, ${priceCents})
    on conflict (product_id, material, style) do update
      set total_units = ${totalUnits}, price_cents = ${priceCents}, updated_at = now()
      where ${totalUnits} >= variant_inventory.sold_units + variant_inventory.reserved_units
    returning product_id
  `;

  if (rows.length === 0) {
    throw new InventoryError(
      "New stock total cannot be lower than sold plus reserved units.",
      productId,
    );
  }
}

export async function updateInventoryTotal(productId: string, totalUnits: number) {
  await ensureInventoryReady();
  const sql = getSql();

  if (!Number.isInteger(totalUnits) || totalUnits < 0) {
    throw new InventoryError("Total inventory must be a non-negative whole number.", productId);
  }

  const rows = await sql<InventoryRow[]>`
    update inventory_items
    set total_units = ${totalUnits},
        updated_at = now()
    where product_id = ${productId}
      and ${totalUnits} >= sold_units + reserved_units
    returning product_id, total_units, reserved_units, sold_units
  `;

  if (rows.length === 0) {
    throw new InventoryError("New stock total cannot be lower than sold plus reserved units.", productId);
  }
}

export interface OrderRefundDetails {
  orderId: string;
  stripePaymentIntentId: string | null;
  stripeSessionId: string;
  amountTotalCents: number;
  refundAmountCents: number;
  currency: string;
  items: Array<{ productId: string; quantity: number }>;
}

export async function getOrderForRefund(orderId: string): Promise<OrderRefundDetails | null> {
  await ensureInventoryReady();
  const sql = getSql();

  const rows = await sql<{
    id: string;
    stripe_payment_intent_id: string | null;
    stripe_session_id: string;
    amount_total_cents: number;
    refund_amount_cents: number;
    currency: string;
  }[]>`
    select id, stripe_payment_intent_id, stripe_session_id, amount_total_cents, refund_amount_cents, currency
    from orders
    where id = ${orderId}
    limit 1
  `;

  const order = rows[0];
  if (!order) return null;

  const items = await sql<{ product_id: string; quantity: number }[]>`
    select product_id, quantity
    from order_items
    where order_id = ${orderId}
  `;

  return {
    orderId: order.id,
    stripePaymentIntentId: order.stripe_payment_intent_id,
    stripeSessionId: order.stripe_session_id,
    amountTotalCents: order.amount_total_cents,
    refundAmountCents: order.refund_amount_cents,
    currency: order.currency,
    items: items.map((row) => ({ productId: row.product_id, quantity: row.quantity })),
  };
}

export async function markOrderRefunded(orderId: string, refundedCents: number) {
  await ensureInventoryReady();
  const sql = getSql();

  await sql.begin(async (tx) => {
    const rows = await tx<{
      amount_total_cents: number;
      refund_amount_cents: number;
      refunded_at: string | null;
    }[]>`
      select amount_total_cents, refund_amount_cents, refunded_at
      from orders
      where id = ${orderId}
      for update
    `;

    const order = rows[0];
    if (!order) return;

    const fullyRefunded = refundedCents >= order.amount_total_cents;
    const shouldRestock = fullyRefunded && order.refunded_at === null;

    await tx`
      update orders
      set refund_amount_cents = ${refundedCents},
          refunded_at = case
            when ${refundedCents} >= amount_total_cents then coalesce(refunded_at, now())
            else refunded_at
          end,
          updated_at = now()
      where id = ${orderId}
    `;

    if (!shouldRestock) return;

    const items = await tx<{ product_id: string; quantity: number }[]>`
      select product_id, sum(quantity)::int as quantity
      from order_items
      where order_id = ${orderId}
      group by product_id
    `;

    for (const item of items) {
      await tx`
        update inventory_items
        set sold_units = greatest(sold_units - ${item.quantity}, 0),
            updated_at = now()
        where product_id = ${item.product_id}
      `;
    }
  });
}

export async function markOrderRefundedByPaymentIntent(
  paymentIntentId: string,
  refundedCents: number,
) {
  await ensureInventoryReady();
  const sql = getSql();

  const rows = await sql<{ id: string }[]>`
    select id
    from orders
    where stripe_payment_intent_id = ${paymentIntentId}
    limit 1
  `;

  const orderId = rows[0]?.id;
  if (!orderId) return;

  await markOrderRefunded(orderId, refundedCents);
}

export async function updateProductOverride(
  productId: string,
  priceCents: number,
  isActive: boolean,
) {
  await ensureInventoryReady();
  const sql = getSql();

  if (!Number.isInteger(priceCents) || priceCents < 0) {
    throw new InventoryError("Price must be a non-negative whole number of cents.", productId);
  }

  await sql`
    insert into product_overrides (product_id, price_cents, is_active, updated_at)
    values (${productId}, ${priceCents}, ${isActive}, now())
    on conflict (product_id)
    do update set price_cents = excluded.price_cents,
                  is_active = excluded.is_active,
                  updated_at = now()
  `;
}

/** Toggle whether a product shows on the storefront (price is per-variant). */
export async function updateProductActive(productId: string, isActive: boolean) {
  await ensureInventoryReady();
  const sql = getSql();

  await sql`
    insert into product_overrides (product_id, is_active, updated_at)
    values (${productId}, ${isActive}, now())
    on conflict (product_id)
    do update set is_active = excluded.is_active, updated_at = now()
  `;
}

export interface CatalogEntry {
  productId: string;
  priceCents: number;
  isActive: boolean;
}

export async function getCatalogOverrides(): Promise<Record<string, CatalogEntry>> {
  await ensureInventoryReady();
  const sql = getSql();

  const rows = await sql<{ product_id: string; price_cents: number | null; is_active: boolean }[]>`
    select product_id, price_cents, is_active
    from product_overrides
  `;

  return Object.fromEntries(
    rows.map((row) => [
      row.product_id,
      {
        productId: row.product_id,
        priceCents: row.price_cents ?? 0,
        isActive: row.is_active,
      },
    ]),
  );
}

export async function getAllOrdersForExport() {
  await ensureInventoryReady();
  const sql = getSql();

  const orderRows = await sql<OrderRow[]>`
    select
      id, stripe_session_id, customer_name, customer_email, customer_phone,
      shipping_status, tracking_number, amount_total_cents, currency, item_count,
      shipping_city, shipping_country, shipping_postal_code, shipping_line1, shipping_line2,
      created_at::text, paid_at::text, fulfilled_at::text, refunded_at::text, refund_amount_cents
    from orders
    order by created_at desc
  `;

  const itemRows = await sql<OrderItemRow[]>`
    select id, order_id, product_id, product_slug, product_name, material, length,
           quantity, unit_price_cents, line_total_cents
    from order_items
  `;

  return { orders: orderRows, items: itemRows };
}

export async function updateOrderShipping(
  orderId: string,
  shippingStatus: ShippingStatus,
  trackingNumber: string | null,
) {
  await ensureInventoryReady();
  const sql = getSql();

  if (!["pending", "packed", "shipped", "delivered"].includes(shippingStatus)) {
    throw new InventoryError("Invalid shipping status.");
  }

  await sql`
    update orders
    set shipping_status = ${shippingStatus},
        tracking_number = ${trackingNumber?.trim() || null},
        fulfilled_at = case
          when ${shippingStatus} in ('shipped', 'delivered') then coalesce(fulfilled_at, now())
          else fulfilled_at
        end,
        updated_at = now()
    where id = ${orderId}
  `;
}
