import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { DeleteButton } from "./DeleteButton";

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

      <div className="bg-white border border-neutral-200">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Nombre</th>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Categoría</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Precio</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Stock</th>
              <th className="text-center text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Estado</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((p) => {
              const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={p.id} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50">
                  <td className="px-6 py-4 text-sm text-neutral-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{p.category?.name || "—"}</td>
                  <td className="px-6 py-4 text-sm text-neutral-900 text-right">
                    ${Number(p.price).toLocaleString("es-AR")}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 text-right">{totalStock}</td>
                  <td className="px-6 py-4 text-center">
                    {p.active ? (
                      <span className="text-xs text-green-600">● Activo</span>
                    ) : (
                      <span className="text-xs text-neutral-400">● Inactivo</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/productos/${p.id}/editar`}
                        className="text-xs uppercase tracking-wider text-neutral-700 hover:text-neutral-900"
                      >
                        Editar
                      </Link>
                      <DeleteButton id={p.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {productList.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-neutral-500">No hay productos todavía.</p>
            <Link
              href="/admin/productos/nuevo"
              className="inline-block mt-4 text-xs uppercase tracking-widest text-neutral-900 underline"
            >
              Crear el primero
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
