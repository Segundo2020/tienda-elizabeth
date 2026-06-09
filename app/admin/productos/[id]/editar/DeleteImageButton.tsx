"use client";

import { deleteProductImage } from "../../image-actions";

export function DeleteImageButton({
  productId,
  imageId,
}: {
  productId: number;
  imageId: number;
}) {
  const action = deleteProductImage.bind(null, productId);

  return (
    <form action={action}>
      <input type="hidden" name="imageId" value={imageId} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("¿Eliminar esta imagen?")) e.preventDefault();
        }}
        className="text-xs uppercase tracking-wider text-red-600 hover:text-red-700"
      >
        Eliminar
      </button>
    </form>
  );
}
