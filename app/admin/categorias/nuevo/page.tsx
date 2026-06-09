import { CategoryForm } from "../CategoryForm";
import { createCategory } from "../actions";

export default async function NuevaCategoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900">Nueva categoría</h1>
        <p className="text-sm text-neutral-500 mt-1">Organizá tus productos por categoría</p>
      </div>

      {params.error && (
        <div className="mb-6 max-w-2xl px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700">
          {params.error}
        </div>
      )}

      <CategoryForm action={createCategory} submitLabel="Crear categoría" />
    </div>
  );
}
