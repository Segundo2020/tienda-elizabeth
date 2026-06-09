"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";

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
  if (!name) throw new Error("El nombre es obligatorio");
  return { name };
}

export async function createCategory(formData: FormData) {
  let errorMsg: string | null = null;
  try {
    const data = parseForm(formData);
    const slug = slugify(data.name);

    const existing = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });
    if (existing) {
      throw new Error("Ya existe una categoría con ese nombre.");
    }

    await db.insert(categories).values({ name: data.name, slug });
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "Error desconocido";
  }

  if (errorMsg) {
    redirect(`/admin/categorias/nuevo?error=${encodeURIComponent(errorMsg)}`);
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/productos");
  revalidatePath("/");
  redirect("/admin/categorias");
}

export async function updateCategory(id: number, formData: FormData) {
  let errorMsg: string | null = null;
  try {
    const data = parseForm(formData);
    await db.update(categories).set({ name: data.name }).where(eq(categories.id, id));
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "Error desconocido";
  }

  if (errorMsg) {
    redirect(`/admin/categorias/${id}/editar?error=${encodeURIComponent(errorMsg)}`);
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/productos");
  revalidatePath("/");
  redirect("/admin/categorias");
}

export async function deleteCategory(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) redirect("/admin/categorias");

  let errorMsg: string | null = null;
  try {
    const usingProduct = await db.query.products.findFirst({
      where: eq(products.categoryId, id),
    });
    if (usingProduct) {
      throw new Error(
        "No se puede eliminar: hay productos asignados. Cambialos primero a otra categoría o sin categoría."
      );
    }

    await db.delete(categories).where(eq(categories.id, id));
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "Error al eliminar";
  }

  if (errorMsg) {
    redirect(`/admin/categorias?error=${encodeURIComponent(errorMsg)}`);
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/productos");
  revalidatePath("/");
  redirect("/admin/categorias");
}
