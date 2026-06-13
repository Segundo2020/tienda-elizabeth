"use client";

import { useState } from "react";
import Link from "next/link";
import { DeleteButton } from "./DeleteButton";

type ProductRow = {
  id: number;
  name: string;
  categoryName: string | null;
  price: string;
  totalStock: number;
  active: boolean | null;
};

export function ProductsTable({
  products,
}: {
  products: ProductRow[];
}) {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      String(p.id).includes(q) ||
      (p.categoryName?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <>
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Buscar por nombre, ID o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-300 text-sm bg-white focus:outline-none focus:border-neutral-900"
        />
      </div>

      <div className="bg-white border border-neutral-200">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">ID</th>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Nombre</th>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Categoría</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Precio</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Stock</th>
              <th className="text-center text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Estado</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50">
                <td className="px-6 py-4 text-sm text-neutral-600 font-mono">#{p.id}</td>
                <td className="px-6 py-4 text-sm text-neutral-900">{p.name}</td>
                <td className="px-6 py-4 text-sm text-neutral-600">{p.categoryName || "—"}</td>
                <td className="px-6 py-4 text-sm text-neutral-900 text-right">
                  ${Number(p.price).toLocaleString("es-AR")}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600 text-right">{p.totalStock}</td>
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
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && search && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-neutral-500">
              No se encontraron productos para &quot;{search}&quot;.
            </p>
          </div>
        )}

        {products.length === 0 && (
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

      {search && filtered.length !== products.length && (
        <p className="mt-3 text-xs text-neutral-500">
          Mostrando {filtered.length} de {products.length} productos
        </p>
      )}
    </>
  );
}
