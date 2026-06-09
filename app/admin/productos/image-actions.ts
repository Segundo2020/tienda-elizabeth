"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { productImages } from "@/lib/db/schema";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "Productos";

export async function uploadProductImage(productId: number, formData: FormData) {
  const file = formData.get("file") as File;

  let errorMsg: string | null = null;
  if (!file || file.size === 0) {
    errorMsg = "Seleccioná un archivo";
  } else if (!file.type.startsWith("image/")) {
    errorMsg = "Solo se permiten imágenes";
  } else if (file.size > 10 * 1024 * 1024) {
    errorMsg = "La imagen no puede superar los 10MB";
  }

  if (!errorMsg) {
    try {
      const supabase = createAdminClient();
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${productId}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(filename);

      const [maxPos] = await db
        .select({ value: max(productImages.position) })
        .from(productImages)
        .where(eq(productImages.productId, productId));
      const nextPosition = (maxPos?.value ?? -1) + 1;

      await db.insert(productImages).values({
        productId,
        url: publicUrl,
        position: nextPosition,
      });
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : "Error al subir la imagen";
    }
  }

  if (errorMsg) {
    redirect(
      `/admin/productos/${productId}/editar?imageError=${encodeURIComponent(errorMsg)}`
    );
  }

  revalidatePath(`/admin/productos/${productId}/editar`);
  revalidatePath("/");
}

export async function deleteProductImage(productId: number, formData: FormData) {
  const imageId = Number(formData.get("imageId"));
  if (!imageId) {
    redirect(`/admin/productos/${productId}/editar`);
  }

  let errorMsg: string | null = null;
  try {
    const [image] = await db
      .select()
      .from(productImages)
      .where(eq(productImages.id, imageId));

    if (image) {
      const urlParts = image.url.split("/");
      const filename = decodeURIComponent(urlParts[urlParts.length - 1]);

      const supabase = createAdminClient();
      await supabase.storage.from(BUCKET).remove([filename]);

      await db.delete(productImages).where(eq(productImages.id, imageId));
    }
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "Error al eliminar";
  }

  if (errorMsg) {
    redirect(
      `/admin/productos/${productId}/editar?imageError=${encodeURIComponent(errorMsg)}`
    );
  }

  revalidatePath(`/admin/productos/${productId}/editar`);
  revalidatePath("/");
}
