import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { productVariants } from "@/lib/db/schema";
import { createVariant, updateVariantStock } from "../../variants-actions";
import { DeleteVariantButton } from "./DeleteVariantButton";

export async function VariantManager({
  productId,
  error,
}: {
  productId: number;
  error?: string;
}) {
  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId))
    .orderBy(asc(productVariants.id));

  const createAction = createVariant.bind(null, productId);
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div className="mt-12 max-w-3xl">
      <h2 className="text-lg font-light tracking-tight text-neutral-900 mb-1">
        Variantes
      </h2>
      <p className="text-sm text-neutral-500 mb-6">
        {variants.length} variante{variants.length === 1 ? "" : "s"} · Stock total: {totalStock}
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {variants.length > 0 && (
        <div className="bg-white border border-neutral-200 mb-8">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-4 py-3">Talle</th>
                <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-4 py-3">Color</th>
                <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-4 py-3">SKU</th>
                <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-4 py-3">Stock</th>
                <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => {
                const updateAction = updateVariantStock.bind(null, productId, v.id);
                return (
                  <tr key={v.id} className="border-b border-neutral-100 last:border-b-0">
                    <td className="px-4 py-3 text-sm text-neutral-900">{v.size || "—"}</td>
                    <td className="px-4 py-3 text-sm text-neutral-900">{v.color || "—"}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{v.sku || "—"}</td>
                    <td className="px-4 py-3">
                      <form action={updateAction} className="flex items-center gap-2">
                        <input
                          type="number"
                          name="stock"
                          min="0"
                          defaultValue={v.stock}
                          className="w-20 px-2 py-1 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                        />
                        <button
                          type="submit"
                          className="text-xs uppercase tracking-wider text-neutral-700 hover:text-neutral-900"
                        >
                          Guardar
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DeleteVariantButton productId={productId} variantId={v.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <form action={createAction} className="border border-dashed border-neutral-300 p-6">
        <h3 className="text-xs uppercase tracking-wider text-neutral-700 mb-4">
          Agregar variante
        </h3>
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div>
            <label htmlFor="size" className="block text-xs text-neutral-600 mb-1">Talle</label>
            <input
              id="size"
              name="size"
              type="text"
              placeholder="S, M, L..."
              className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
            />
          </div>
          <div>
            <label htmlFor="color" className="block text-xs text-neutral-600 mb-1">Color</label>
            <input
              id="color"
              name="color"
              type="text"
              placeholder="Negro, Blanco..."
              className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
            />
          </div>
          <div>
            <label htmlFor="sku" className="block text-xs text-neutral-600 mb-1">SKU (opcional)</label>
            <input
              id="sku"
              name="sku"
              type="text"
              placeholder="REM-NEG-M"
              className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-xs text-neutral-600 mb-1">Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              defaultValue="0"
              required
              className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-neutral-700 transition-colors"
        >
          Agregar
        </button>
        <p className="mt-3 text-xs text-neutral-500">
          Definí al menos talle o color. El combo talle + color debe ser único por producto.
        </p>
      </form>
    </div>
  );
}
