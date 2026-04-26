import { getCatalogOverrides } from "@/lib/inventory";
import { products, type Product } from "@/data/products";

function applyOverride(product: Product, priceCents: number | null): Product {
  if (priceCents === null) return product;
  return { ...product, price: priceCents / 100 };
}

export async function getPublicProducts(): Promise<Product[]> {
  const overrides = await getCatalogOverrides();

  return products
    .filter((product) => overrides[product.id]?.isActive !== false)
    .map((product) => {
      const override = overrides[product.id];
      return applyOverride(product, override?.priceCents ?? null);
    });
}

export async function getPublicProduct(slug: string): Promise<Product | null> {
  const overrides = await getCatalogOverrides();
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;

  const override = overrides[product.id];
  if (override && !override.isActive) return null;

  return applyOverride(product, override?.priceCents ?? null);
}

export async function getAuthoritativePriceCents(productId: string): Promise<number | null> {
  const overrides = await getCatalogOverrides();
  const override = overrides[productId];
  const base = products.find((p) => p.id === productId);
  if (!base) return null;

  if (override && !override.isActive) return null;
  return override?.priceCents ?? Math.round(base.price * 100);
}
