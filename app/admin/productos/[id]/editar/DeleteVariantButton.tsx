"use client";

import { deleteVariant } from "../../variants-actions";

export function DeleteVariantButton({
  productId,
  variantId,
}: {
  productId: number;
  variantId: number;
}) {
  const action = deleteVariant.bind(null, productId);

  return (
    <form action={action}>
      <input type="hidden" name="variantId" value={variantId} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("¿Eliminar esta variante?")) e.preventDefault();
        }}
        className="text-xs uppercase tracking-wider text-red-600 hover:text-red-700"
      >
        Eliminar
      </button>
    </form>
  );
}
