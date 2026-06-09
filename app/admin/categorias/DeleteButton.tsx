"use client";

import { deleteCategory } from "./actions";

export function DeleteCategoryButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  return (
    <form action={deleteCategory}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`¿Eliminar la categoría "${name}"?`)) e.preventDefault();
        }}
        className="text-red-600 hover:text-red-700 text-xs uppercase tracking-wider"
      >
        Eliminar
      </button>
    </form>
  );
}
