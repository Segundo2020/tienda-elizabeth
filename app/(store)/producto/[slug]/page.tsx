export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ImageGallery } from "./ImageGallery";
import { VariantSelector } from "./VariantSelector";

export default async function ProductDetailPage({
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

  const galleryImages = product.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt }));
  const variants = product.variants.map((v) => ({ id: v.id, size: v.size, color: v.color, stock: v.stock }));

  return (
    <section className="max-w-[1400px] mx-auto px-5 md:px-8 py-8 md:py-16">
      <nav className="flex items-center gap-2 text-xs text-eliz-muted mb-8 md:mb-12" aria-label="Ruta">
        <Link href="/" className="hover:text-eliz-text transition-colors no-underline">Inicio</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/categoria/${product.category.slug}`} className="hover:text-eliz-text transition-colors no-underline">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-eliz-text font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <ImageGallery images={galleryImages} productName={product.name} />

        <div className="md:pt-4">
          {product.category && (
            <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-eliz-accent mb-3">
              {product.category.name}
            </div>
          )}

          <h1 className="font-serif text-[28px] md:text-[36px] font-medium leading-[1.2] text-eliz-text mb-4">
            {product.name}
          </h1>

          <p className="text-[22px] md:text-[26px] font-semibold text-eliz-text mb-8">
            ${Number(product.price).toLocaleString("es-AR")}
          </p>

          {product.description && (
            <div className="text-eliz-muted leading-relaxed mb-8 text-sm md:text-base whitespace-pre-line">
              {product.description}
            </div>
          )}

          <VariantSelector
            productId={product.id}
            productName={product.name}
            productSlug={product.slug}
            price={Number(product.price)}
            variants={variants}
          />

          <ul className="mt-10 pt-8 border-t border-eliz-border space-y-3 text-sm text-eliz-muted list-none p-0">
            <li>Envío gratis en Río Gallegos</li>
            <li>Pedido por WhatsApp con atención personalizada</li>
            <li>Calidad garantizada en cada prenda</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
