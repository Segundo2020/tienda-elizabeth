"use client";

import Link from "next/link";

type Category = {
  id: number;
  name: string;
};

type Product = {
  name: string;
  description: string | null;
  price: string;
  categoryId: number | null;
  active: boolean | null;
};

export function ProductForm({
  action,
  initialData,
  categories,
  submitLabel = "Guardar",
}: {
  action: (formData: FormData) => Promise<void>;
  initialData?: Product;
  categories: Category[];
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
          className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 text-sm bg-white"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-xs uppercase tracking-wider text-neutral-700 mb-2">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialData?.description || ""}
          className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 text-sm bg-white resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-xs uppercase tracking-wider text-neutral-700 mb-2">
            Precio (ARS)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={initialData?.price}
            className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 text-sm bg-white"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-xs uppercase tracking-wider text-neutral-700 mb-2">
            Categoría
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={initialData?.categoryId?.toString() || ""}
            className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 text-sm bg-white"
          >
            <option value="">— Sin categoría —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={initialData?.active ?? true}
          className="w-4 h-4"
        />
        <label htmlFor="active" className="text-sm text-neutral-700">
          Activo (visible en la tienda)
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-neutral-700 transition-colors"
        >
          {submitLabel}
        </button>
        <Link
          href="/admin/productos"
          className="px-6 py-3 border border-neutral-300 text-xs uppercase tracking-widest hover:bg-neutral-100 transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
