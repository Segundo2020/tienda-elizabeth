import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { ProductForm } from "../ProductForm";
import { createProduct } from "../actions";

export default async function NuevoProductoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const cats = await db.select().from(categories);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900">Nuevo producto</h1>
        <p className="text-sm text-neutral-500 mt-1">Agregá un producto al catálogo</p>
      </div>

      {params.error && (
        <div className="mb-6 max-w-2xl px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700">
          {params.error}
        </div>
      )}

      <ProductForm action={createProduct} categories={cats} submitLabel="Crear producto" />
    </div>
  );
}
