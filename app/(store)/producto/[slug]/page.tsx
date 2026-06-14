import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { VariantSelector } from './VariantSelector';
import { ImageGallery } from './ImageGallery';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      category: true,
      variants: true,
      images: {
        orderBy: (img, { asc }) => [asc(img.position), asc(img.id)],
      },
    },
  });

  if (!product || !product.active) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <nav className="text-xs text-neutral-500 mb-12 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-black transition">Inicio</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/categoria/${product.category.slug}`}
              className="hover:text-black transition"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-neutral-700">{product.name}</span>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        <ImageGallery images={product.images} productName={product.name} />
        <div>
          {product.category && (
            <div className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-3">
              {product.category.name}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-light mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-light mb-8">
            ${Number(product.price).toLocaleString('es-AR')}
          </p>
          {product.description && (
            <p className="text-neutral-600 mb-10 leading-relaxed text-sm">
              {product.description}
            </p>
          )}
          <VariantSelector
            variants={product.variants}
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
            }}
          />
        </div>
      </div>
    </main>
  );
}
