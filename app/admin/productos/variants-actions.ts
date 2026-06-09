"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { productVariants } from "@/lib/db/schema";

function parseVariantForm(formData: FormData) {
  const size = (formData.get("size") as string)?.trim() || null;
  const color = (formData.get("color") as string)?.trim() || null;
  const skuRaw = (formData.get("sku") as string)?.trim();
  const sku = skuRaw && skuRaw.length > 0 ? skuRaw : null;
  const stockStr = formData.get("stock") as string;

  if (!size && !color) {
    throw new Error("Definí al menos un talle o color");
  }

  const stockNum = parseInt(stockStr, 10);
  if (isNaN(stockNum) || stockNum < 0) {
    throw new Error("Stock inválido");
  }

  return { size, color, sku, stock: stockNum };
}

function friendlyVariantError(err: unknown): string {
  if (err instanceof Error) {
    if (err.message.includes("duplicate key")) {
      if (err.message.includes("sku")) {
        return "Ese SKU ya está en uso por otra variante.";
      }
      return "Ya existe una variante con ese talle y color para este producto.";
    }
    return err.message;
  }
  return "Error desconocido";
}

export async function createVariant(productId: number, formData: FormData) {
  let errorMsg: string | null = null;
  try {
    const data = parseVariantForm(formData);
    await db.insert(productVariants).values({ productId, ...data });
  } catch (err) {
    errorMsg = friendlyVariantError(err);
  }

  if (errorMsg) {
    redirect(
      `/admin/productos/${productId}/editar?variantError=${encodeURIComponent(errorMsg)}`
    );
  }

  revalidatePath(`/admin/productos/${productId}/editar`);
  revalidatePath("/");
}

export async function updateVariantStock(
  productId: number,
  variantId: number,
  formData: FormData
) {
  let errorMsg: string | null = null;
  try {
    const stockStr = formData.get("stock") as string;
    const stockNum = parseInt(stockStr, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      throw new Error("Stock inválido");
    }

    await db
      .update(productVariants)
      .set({ stock: stockNum })
      .where(eq(productVariants.id, variantId));
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "Error desconocido";
  }

  if (errorMsg) {
    redirect(
      `/admin/productos/${productId}/editar?variantError=${encodeURIComponent(errorMsg)}`
    );
  }

  revalidatePath(`/admin/productos/${productId}/editar`);
  revalidatePath("/");
}

export async function deleteVariant(productId: number, formData: FormData) {
  const variantId = Number(formData.get("variantId"));
  if (!variantId) {
    redirect(`/admin/productos/${productId}/editar`);
  }

  let errorMsg: string | null = null;
  try {
    await db.delete(productVariants).where(eq(productVariants.id, variantId));
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "Error al eliminar";
  }

  if (errorMsg) {
    redirect(
      `/admin/productos/${productId}/editar?variantError=${encodeURIComponent(errorMsg)}`
    );
  }

  revalidatePath(`/admin/productos/${productId}/editar`);
  revalidatePath("/");
}
