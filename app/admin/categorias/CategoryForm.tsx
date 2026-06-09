"use client";

import Link from "next/link";

type Category = {
  name: string;
};

export function CategoryForm({
  action,
  initialData,
  submitLabel = "Guardar",
}: {
  action: (formData: FormData) => Promise<void>;
  initialData?: Category;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="name" className="block text-xs uppercase tracking-wider text-neutral-700 mb-2">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={initialData?.name}
          placeholder="Ej: Camperas, Accesorios..."
          className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 text-sm bg-white"
        />
        <p className="mt-2 text-xs text-neutral-500">
          El slug (URL) se genera automáticamente. Ejemplo: &quot;Remeras Deportivas&quot; → /categoria/remeras-deportivas
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-neutral-700 transition-colors"
        >
          {submitLabel}
        </button>
        <Link
          href="/admin/categorias"
          className="px-6 py-3 border border-neutral-300 text-xs uppercase tracking-widest hover:bg-neutral-100 transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
