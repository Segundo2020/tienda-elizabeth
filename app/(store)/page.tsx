export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/app/components/ProductCard";
import { NewsletterForm } from "./NewsletterForm";

const HERO_IMG = "https://images.unsplash.com/photo-1577373482643-5c7ccf8f0ac9?w=1600&q=80&auto=format&fit=crop";
const NOSOTROS_IMG = "https://images.unsplash.com/photo-1577373482643-5c7ccf8f0ac9?w=1200&q=80&auto=format&fit=crop";

const marqueeItems = [
  "Envío gratis en Río Gallegos",
  "Atención personalizada por WhatsApp",
  "Nuevos ingresos todas las semanas",
  "Calidad garantizada",
];

const testimonios = [
  { name: "Mariana L.", city: "Río Gallegos", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", text: "La calidad de las prendas es increíble. El vestido bordado es hermoso y la atención por WhatsApp fue súper rápida. ¡Ya hice mi segundo pedido!" },
  { name: "Carla R.", city: "Puerto Santa Cruz", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", text: "Me encanta que pueda ver todo el catálogo online y coordinar el pago por WhatsApp. El conjunto de tweed es divino, supera las fotos." },
  { name: "Lucía M.", city: "Río Gallegos", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80", text: "Elizabeth tiene un ojo único para elegir prendas. Cada vez que entro al catálogo encuentro algo nuevo que me encanta. Recomendadísimo." },
];

function SectionHeader({ label, title, em, link }: { label: string; title: string; em: string; link?: { href: string; text: string } }) {
  return (
    <div className="flex justify-between items-end flex-wrap gap-4 mb-10 md:mb-14">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-eliz-accent mb-3">{label}</div>
        <h2 className="font-serif text-[32px] md:text-[48px] font-normal leading-[1.1]">
          {title} <em className="italic">{em}</em>
        </h2>
      </div>
      {link && (
        <a href={link.href} className="text-[11px] font-semibold tracking-[0.12em] uppercase text-eliz-text hover:text-eliz-accent transition-colors no-underline">
          {link.text} →
        </a>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [cats, allProducts] = await Promise.all([
    db.query.categories.findMany({
      orderBy: [asc(categories.name)],
    }),
    db.query.products.findMany({
      where: eq(products.active, true),
      with: {
        category: true,
        images: {
          orderBy: (i, { asc }) => [asc(i.position), asc(i.id)],
          limit: 1,
        },
      },
      orderBy: [asc(products.id)],
    }),
  ]);

  // Imagen de cada categoría: primer producto activo (sin queries extra)
  const catsWithImages = cats.map((c) => {
    const p = allProducts.find((x) => x.categoryId === c.id && x.images.length > 0);
    return { id: c.id, name: c.name, slug: c.slug, imageUrl: p?.images[0]?.url ?? null };
  });

  const productCards = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    imageUrl: p.images[0]?.url ?? null,
    categoryName: p.category?.name ?? null,
    badge: null as string | null,
  }));

  const destacados = [...productCards]
    .reverse()
    .slice(0, 4)
    .map((p, i) => ({ ...p, badge: i === 0 ? "Nuevo" : null }));

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden flex items-center h-[85vh] min-h-[600px] max-h-[900px]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d2a26] to-[#1a1a1a]" />
        <div
          className="absolute right-0 top-0 h-full w-full md:w-[55%] bg-cover bg-center opacity-25 md:opacity-100"
          style={{
            backgroundImage: `url('${HERO_IMG}')`,
            maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
          }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 w-full">
          <div className="max-w-[600px]">
            <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9a23f] mb-5 flex items-center gap-3">
              <span className="w-8 h-px bg-[#c9a23f]" />
              Nueva Colección {new Date().getFullYear()}
            </div>
            <h1 className="font-serif text-white text-[42px] md:text-[78px] font-normal leading-[1.05] mb-6">
              Elegancia que se siente,{" "}
              <em className="italic font-medium">estilo que se ve</em>
            </h1>
            <p className="text-white/70 text-base md:text-lg mb-8 max-w-[500px] leading-relaxed">
              Prendas pensadas para la mujer actual. Diseños exclusivos, calidad premium y atención personalizada en cada pedido.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#catalogo" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-eliz-accent text-white text-xs font-semibold tracking-[0.12em] uppercase transition-colors hover:bg-eliz-accent-hover no-underline">
                Ver Catálogo
              </a>
              <a href="#nosotros" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white text-xs font-semibold tracking-[0.12em] uppercase transition-all hover:bg-white hover:text-[#1a1a1a] no-underline">
                Conocenos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#1a1a1a] text-white/40 py-3.5 overflow-hidden whitespace-nowrap text-[11px] font-medium tracking-[0.15em] uppercase" aria-hidden="true">
        <div className="animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((text, i) => (
            <span key={i} className="mx-10">· {text}</span>
          ))}
        </div>
      </div>

      {/* CATEGORÍAS */}
      <section id="categorias" className="max-w-[1400px] mx-auto px-5 md:px-8 py-16 md:py-24">
        <SectionHeader label="Explorá" title="Categorías" em="destacadas" link={{ href: "#catalogo", text: "Ver todas" }} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {catsWithImages.map((c) => (
            <Link key={c.id} href={`/categoria/${c.slug}`} className="group relative aspect-[3/4] overflow-hidden bg-eliz-bg-warm no-underline">
              {c.imageUrl ? (
                <Image src={c.imageUrl} alt={c.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white font-serif text-lg md:text-xl font-medium tracking-wide">
                {c.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      {destacados.length > 0 && (
        <section id="destacados" className="bg-eliz-bg-warm py-16 md:py-24">
          <div className="max-w-[1400px] mx-auto px-5 md:px-8">
            <SectionHeader label="Selección" title="Productos" em="destacados" link={{ href: "#catalogo", text: "Ver catálogo completo" }} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
              {destacados.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NOSOTROS */}
      <section id="nosotros" className="py-16 md:py-24 px-5 md:px-8">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="relative w-full h-[400px] md:h-[500px]">
            <Image src={NOSOTROS_IMG} alt="Prendas de la boutique Elizabeth" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-eliz-accent mb-5">Nuestra historia</div>
            <h2 className="font-serif text-[28px] md:text-[40px] font-normal leading-[1.2] mb-6">
              Moda con <em className="italic">propósito</em> desde Río Gallegos
            </h2>
            <p className="text-eliz-muted text-sm md:text-base leading-relaxed mb-8">
              Elizabeth nació con la idea de acercar la moda de calidad a cada mujer de Santa Cruz. Cada prenda es seleccionada con cuidado, pensando en el día a día, en la comodidad y en ese toque especial que te hace sentir única.
            </p>
            <a href="#catalogo" className="inline-flex items-center gap-2 px-8 py-4 bg-eliz-accent text-white text-xs font-semibold tracking-[0.12em] uppercase transition-colors hover:bg-eliz-accent-hover no-underline">
              Explorar Catálogo
            </a>
            <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-eliz-border">
              <div>
                <div className="font-serif text-3xl md:text-4xl font-medium text-eliz-text mb-1">{productCards.length}</div>
                <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-eliz-muted">Productos</div>
              </div>
              <div>
                <div className="font-serif text-3xl md:text-4xl font-medium text-eliz-text mb-1">{cats.length}</div>
                <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-eliz-muted">Categorías</div>
              </div>
              <div>
                <div className="font-serif text-3xl md:text-4xl font-medium text-eliz-text mb-1">100%</div>
                <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-eliz-muted">Atención personal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" className="bg-eliz-bg-warm">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <SectionHeader label="Catálogo" title="Todo el" em="catálogo" />
          {productCards.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
              {productCards.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-eliz-muted text-center py-16">Todavía no hay productos cargados.</p>
          )}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="bg-[#1a1a1a] text-white py-20 md:py-24 px-5 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-14">
            <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d4c4a8] mb-3">Testimonios</div>
            <h2 className="font-serif text-white text-[32px] md:text-[48px] font-normal leading-[1.1]">
              Lo que dicen <em className="italic">nuestras clientas</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonios.map((t) => (
              <figure key={t.name} className="bg-white/[0.03] border border-white/[0.06] p-8 md:p-10 m-0">
                <div className="text-[#c9a23f] mb-4 text-lg" aria-label="5 estrellas">★★★★★</div>
                <blockquote className="text-white/80 leading-relaxed mb-6 text-sm md:text-base italic m-0">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
                  <Image src={t.avatar} alt="" width={44} height={44} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <div className="text-white text-sm font-semibold">{t.name}</div>
                    <div className="text-white/50 text-xs">{t.city}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 md:py-24 px-5 md:px-8 text-center">
        <div className="max-w-[600px] mx-auto">
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-eliz-accent mb-3">Mantenete al día</div>
          <h2 className="font-serif text-[28px] md:text-[40px] font-normal leading-[1.2] mb-4">
            Recibí las <em className="italic">novedades</em> primero
          </h2>
          <p className="text-eliz-muted mb-8 text-sm md:text-base">
            Suscribite y enterate de los nuevos ingresos, ofertas exclusivas y lanzamientos especiales.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
