import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { ProductsTable } from "./ProductsTable";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const productList = await db.query.products.findMany({
    with: {
      category: true,
      variants: true,
    },
    orderBy: [desc(products.createdAt)],
  });

  const rows = productList.map((p) => ({
    id: p.id,
    name: p.name,
    categoryName: p.category?.name ?? null,
    price: p.price,
    totalStock: p.variants.reduce((sum, v) => sum + v.stock, 0),
    active: p.active,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900">Productos</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {productList.length} producto{productList.length === 1 ? "" : "s"} en el catálogo
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-neutral-700 transition-colors"
        >
          Nuevo producto
        </Link>
      </div>

      {params.error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700">
          {params.error}
        </div>
      )}

      <ProductsTable products={rows} />
    </div>
  );
}
