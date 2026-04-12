import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

export default function LayersWithRow({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section>
      <h3 className="font-heading text-lg font-light tracking-[0.05em] mb-6">Layers With</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
