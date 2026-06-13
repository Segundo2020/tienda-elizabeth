import Link from "next/link";
import { asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { CategoriesTable } from "./CategoriesTable";

export default async function CategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  const cats = await db.select().from(categories).orderBy(asc(categories.name));

  const counts = await db
    .select({
      categoryId: products.categoryId,
      total: count(),
    })
    .from(products)
    .groupBy(products.categoryId);

  const countMap = new Map(counts.map((c) => [c.categoryId, Number(c.total)]));

  const rows = cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productCount: countMap.get(c.id) ?? 0,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900">Categorías</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {cats.length} categoría{cats.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/categorias/nuevo"
          className="px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-neutral-700 transition-colors"
        >
          Nueva categoría
        </Link>
      </div>

      {params.error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700">
          {params.error}
        </div>
      )}

      <CategoriesTable categories={rows} />
    </div>
  );
}
