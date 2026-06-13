"use client";

import { useState } from "react";
import Link from "next/link";
import { DeleteCategoryButton } from "./DeleteButton";

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  productCount: number;
};

export function CategoriesTable({ categories }: { categories: CategoryRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      String(c.id).includes(q)
    );
  });

  return (
    <>
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Buscar por nombre, slug o ID..."
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
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Slug</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Productos</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50">
                <td className="px-6 py-4 text-sm text-neutral-600 font-mono">#{c.id}</td>
                <td className="px-6 py-4 text-sm text-neutral-900">{c.name}</td>
                <td className="px-6 py-4 text-sm text-neutral-600 font-mono">{c.slug}</td>
                <td className="px-6 py-4 text-sm text-neutral-600 text-right">{c.productCount}</td>
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

        {filtered.length === 0 && search && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-neutral-500">
              No se encontraron categorías para &quot;{search}&quot;.
            </p>
          </div>
        )}

        {categories.length === 0 && (
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

      {search && filtered.length !== categories.length && (
        <p className="mt-3 text-xs text-neutral-500">
          Mostrando {filtered.length} de {categories.length} categorías
        </p>
      )}
    </>
  );
}
