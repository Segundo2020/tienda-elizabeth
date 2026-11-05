export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { and, eq, asc } from "drizzle-orm";
import { ProductCard } from "@/app/components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  const rows = await db.query.products.findMany({
    where: and(eq(products.categoryId, category.id), eq(products.active, true)),
    with: {
      images: {
        orderBy: (img, { asc }) => [asc(img.position), asc(img.id)],
        limit: 1,
      },
    },
    orderBy: [asc(products.id)],
  });

  const productCards = rows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    imageUrl: p.images[0]?.url ?? null,
    categoryName: category.name,
  }));

  return (
    <section className="max-w-[1400px] mx-auto px-5 md:px-8 py-12 md:py-20">
      <nav className="flex items-center gap-2 text-xs text-eliz-muted mb-8 md:mb-10" aria-label="Ruta">
        <Link href="/" className="hover:text-eliz-text transition-colors no-underline">Inicio</Link>
        <span>/</span>
        <span className="text-eliz-text font-medium">{category.name}</span>
      </nav>

      <div className="mb-10 md:mb-14">
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-eliz-accent mb-3">Categoría</div>
        <h1 className="font-serif text-[32px] md:text-[48px] font-normal leading-[1.1] mb-3">{category.name}</h1>
        <p className="text-eliz-muted text-sm">
          {productCards.length} {productCards.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      {productCards.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
          {productCards.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-eliz-muted text-lg mb-6">Todavía no hay productos en esta categoría.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-eliz-accent text-white text-xs font-semibold tracking-[0.12em] uppercase no-underline transition-colors hover:bg-eliz-accent-hover">
            Volver al inicio
          </Link>
        </div>
      )}
    </section>
  );
}
