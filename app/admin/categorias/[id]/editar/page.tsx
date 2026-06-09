import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { CategoryForm } from "../../CategoryForm";
import { updateCategory } from "../../actions";

export default async function EditarCategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const categoryId = Number(id);

  if (isNaN(categoryId)) notFound();

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  });

  if (!category) notFound();

  const updateAction = updateCategory.bind(null, categoryId);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900">Editar categoría</h1>
        <p className="text-sm text-neutral-500 mt-1">{category.name}</p>
      </div>

      {sp.error && (
        <div className="mb-6 max-w-2xl px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700">
          {sp.error}
        </div>
      )}

      <CategoryForm
        action={updateAction}
        initialData={category}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
