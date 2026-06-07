"use client";

import { deleteProduct } from "./actions";

export function DeleteButton({ id }: { id: number }) {
  return (
    <form action={deleteProduct}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) {
            e.preventDefault();
          }
        }}
        className="text-red-600 hover:text-red-700 text-xs uppercase tracking-wider"
      >
        Eliminar
      </button>
    </form>
  );
}
