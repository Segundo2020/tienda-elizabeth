"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseForm(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const priceStr = formData.get("price") as string;
  const categoryIdStr = formData.get("categoryId") as string;
  const active = formData.get("active") === "on";

  if (!name) throw new Error("El nombre es obligatorio");
  const priceNum = Number(priceStr);
  if (isNaN(priceNum) || priceNum < 0) throw new Error("Precio inválido");
  const categoryId = categoryIdStr ? Number(categoryIdStr) : null;

  return {
    name,
    description,
    price: priceNum.toFixed(2),
    categoryId,
    active,
  };
}

function friendlyError(err: unknown): string {
  if (err instanceof Error) {
    if (err.message.includes("duplicate key") && err.message.includes("slug")) {
      return "Ya existe un producto con ese nombre. Probá con otro.";
    }
    return err.message;
  }
  return "Error desconocido";
}

export async function createProduct(formData: FormData) {
  let errorMsg: string | null = null;
  let newId: number | null = null;
  try {
    const data = parseForm(formData);
    const slug = slugify(data.name);
    const [inserted] = await db
      .insert(products)
      .values({ ...data, slug })
      .returning({ id: products.id });
    newId = inserted.id;
  } catch (err) {
    errorMsg = friendlyError(err);
  }

  if (errorMsg) {
    redirect(`/admin/productos/nuevo?error=${encodeURIComponent(errorMsg)}`);
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  redirect(`/admin/productos/${newId}/editar`);
}

export async function updateProduct(id: number, formData: FormData) {
  let errorMsg: string | null = null;
  try {
    const data = parseForm(formData);
    await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id));
  } catch (err) {
    errorMsg = friendlyError(err);
  }

  if (errorMsg) {
    redirect(`/admin/productos/${id}/editar?error=${encodeURIComponent(errorMsg)}`);
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  redirect("/admin/productos");
}

export async function deleteProduct(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) redirect("/admin/productos");

  let errorMsg: string | null = null;
  try {
    await db.delete(products).where(eq(products.id, id));
  } catch (err) {
    errorMsg = friendlyError(err);
  }

  if (errorMsg) {
    redirect(`/admin/productos?error=${encodeURIComponent(errorMsg)}`);
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  redirect("/admin/productos");
}
