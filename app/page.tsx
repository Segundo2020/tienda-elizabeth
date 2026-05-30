import { db } from '@/lib/db';
import { products, categories, productImages } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { ProductCard } from '@/app/components/ProductCard';

export default async function Home() {
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      description: products.description,
      categoryName: categories.name,
      imageUrl: sql<string | null>`(
        SELECT url FROM ${productImages}
        WHERE ${productImages.productId} = ${products.id}
        ORDER BY ${productImages.position} ASC
        LIMIT 1
      )`,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.active, true))
.orderBy(products.id);

  return (
    <>
      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6">
            Catálogo
          </h1>
          <p className="text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Una selección curada de prendas pensadas para el día a día.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {allProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </>
  );
}