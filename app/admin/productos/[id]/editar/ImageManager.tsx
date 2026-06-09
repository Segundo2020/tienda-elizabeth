import Image from "next/image";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { productImages } from "@/lib/db/schema";
import { uploadProductImage } from "../../image-actions";
import { DeleteImageButton } from "./DeleteImageButton";

export async function ImageManager({
  productId,
  error,
}: {
  productId: number;
  error?: string;
}) {
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.position));

  const uploadAction = uploadProductImage.bind(null, productId);

  return (
    <div className="mt-12 max-w-2xl">
      <h2 className="text-lg font-light tracking-tight text-neutral-900 mb-1">
        Imágenes
      </h2>
      <p className="text-sm text-neutral-500 mb-6">
        {images.length} imagen{images.length === 1 ? "" : "es"}
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {images.map((img) => (
            <div key={img.id} className="border border-neutral-200">
              <div className="aspect-square relative bg-neutral-100">
                <Image
                  src={img.url}
                  alt={img.alt || ""}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="p-2 flex justify-end">
                <DeleteImageButton productId={productId} imageId={img.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      <form action={uploadAction} className="border border-dashed border-neutral-300 p-6 text-center">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-neutral-700 mb-3 block">
            Agregar imagen
          </span>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="block mx-auto text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:border file:border-neutral-300 file:bg-white file:text-xs file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-neutral-50"
          />
        </label>
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-neutral-700 transition-colors"
        >
          Subir
        </button>
        <p className="mt-3 text-xs text-neutral-500">
          Máximo 10MB. JPG, PNG o WebP.
        </p>
      </form>
    </div>
  );
}
