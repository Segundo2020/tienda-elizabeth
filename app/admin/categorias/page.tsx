import Link from "next/link";
import { asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { DeleteCategoryButton } from "./DeleteButton";

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

      <div className="bg-white border border-neutral-200">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Nombre</th>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Slug</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Productos</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50">
                <td className="px-6 py-4 text-sm text-neutral-900">{c.name}</td>
                <td className="px-6 py-4 text-sm text-neutral-600 font-mono">{c.slug}</td>
                <td className="px-6 py-4 text-sm text-neutral-600 text-right">{countMap.get(c.id) || 0}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/categorias/${c.id}/editar`}
                      className="text-xs uppercase tracking-wider text-neutral-700 hover:text-neutral-900"
                    >
                      Editar
                    </Link>
                    <DeleteCategoryButton id={c.id} name={c.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cats.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-neutral-500">No hay categorías todavía.</p>
            <Link
              href="/admin/categorias/nuevo"
              className="inline-block mt-4 text-xs uppercase tracking-widest text-neutral-900 underline"
            >
              Crear la primera
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
