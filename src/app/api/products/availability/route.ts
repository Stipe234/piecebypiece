import { NextResponse } from "next/server";
import { getAvailabilityMap, InventoryError } from "@/lib/inventory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productIds = searchParams.getAll("productId");
    const availability = await getAvailabilityMap(productIds);
    return NextResponse.json(
      { availability },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof InventoryError || error instanceof Error
      ? error.message
      : "Unable to load availability";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
