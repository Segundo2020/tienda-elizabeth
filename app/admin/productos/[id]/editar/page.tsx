import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { ProductForm } from "../../ProductForm";
import { updateProduct } from "../../actions";
import { ImageManager } from "./ImageManager";
import { VariantManager } from "./VariantManager";

export default async function EditarProductoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    imageError?: string;
    variantError?: string;
  }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const productId = Number(id);

  if (isNaN(productId)) notFound();

  const [product, cats] = await Promise.all([
    db.query.products.findFirst({ where: eq(products.id, productId) }),
    db.select().from(categories),
  ]);

  if (!product) notFound();

  const updateAction = updateProduct.bind(null, productId);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900">
          Editar producto
        </h1>
        <p className="text-sm text-neutral-500 mt-1">{product.name}</p>
      </div>

      {sp.error && (
        <div className="mb-6 max-w-2xl px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700">
          {sp.error}
        </div>
      )}

      <ProductForm
        action={updateAction}
        initialData={product}
        categories={cats}
        submitLabel="Guardar cambios"
      />

      <ImageManager productId={productId} error={sp.imageError} />
      <VariantManager productId={productId} error={sp.variantError} />
    </div>
  );
}
