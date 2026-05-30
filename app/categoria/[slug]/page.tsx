import { db } from '@/lib/db';
import { products, categories, productImages } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/app/components/ProductCard';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  if (!category) {
    notFound();
  }

  const categoryProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      description: products.description,
      imageUrl: sql<string | null>`(
        SELECT url FROM ${productImages}
        WHERE ${productImages.productId} = ${products.id}
        ORDER BY ${productImages.position} ASC
        LIMIT 1
      )`,
    })
    .from(products)
    .where(
  and(eq(products.categoryId, category.id), eq(products.active, true))
)
.orderBy(products.id);

  return (
    <>
      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-3">
            {category.name}
          </h1>
          <p className="text-xs text-neutral-500 uppercase tracking-[0.2em]">
            {categoryProducts.length}{' '}
            {categoryProducts.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {categoryProducts.length === 0 ? (
          <div className="text-neutral-500 py-12 text-center text-sm">
            No hay productos en esta categoría todavía.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {categoryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}