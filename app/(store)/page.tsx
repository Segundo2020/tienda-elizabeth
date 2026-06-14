import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { ProductCard } from '@/app/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const productList = await db.query.products.findMany({
    where: eq(products.active, true),
    with: {
      category: true,
      images: {
        orderBy: (img, { asc }) => [asc(img.position), asc(img.id)],
        limit: 1,
      },
    },
    orderBy: [asc(products.id)],
  });

  const allProducts = productList.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    description: p.description,
    categoryName: p.category?.name ?? null,
    imageUrl: p.images[0]?.url ?? null,
  }));

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
