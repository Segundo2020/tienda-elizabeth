import { db } from '@/lib/db';
import { categories, products } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/app/components/ProductCard';

export const dynamic = 'force-dynamic';

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

  const productList = await db.query.products.findMany({
    where: and(eq(products.categoryId, category.id), eq(products.active, true)),
    with: {
      images: {
        orderBy: (img, { asc }) => [asc(img.position), asc(img.id)],
        limit: 1,
      },
    },
    orderBy: [asc(products.id)],
  });

  const categoryProducts = productList.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    description: p.description,
    imageUrl: p.images[0]?.url ?? null,
  }));

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
