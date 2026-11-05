import Link from "next/link";

const WA_URL = "https://wa.me/5492974145259";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white/50">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 pt-16 md:pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          <div>
            <Link
              href="/"
              className="font-serif text-[22px] font-semibold tracking-[0.15em] uppercase text-white no-underline inline-block mb-5"
            >
              Elizabeth
            </Link>
            <p className="text-sm leading-relaxed max-w-[280px] text-white/50">
              Ropa femenina con estilo y calidad. Desde Río Gallegos, Santa Cruz, para toda la región. Atención personalizada y envíos coordinados.
            </p>
          </div>

          <div>
            <h4 className="text-white text-[11px] font-semibold tracking-[0.15em] uppercase mb-6">Tienda</h4>
            <div className="space-y-3">
              <Link href="/#catalogo" className="block text-sm text-white/50 hover:text-white transition-colors no-underline">Catálogo</Link>
              <Link href="/#categorias" className="block text-sm text-white/50 hover:text-white transition-colors no-underline">Categorías</Link>
              <Link href="/#destacados" className="block text-sm text-white/50 hover:text-white transition-colors no-underline">Destacados</Link>
              <Link href="/carrito" className="block text-sm text-white/50 hover:text-white transition-colors no-underline">Carrito</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white text-[11px] font-semibold tracking-[0.15em] uppercase mb-6">Ayuda</h4>
            <div className="space-y-3">
              <span className="block text-sm text-white/50">Cómo comprar</span>
              <span className="block text-sm text-white/50">Envíos</span>
              <span className="block text-sm text-white/50">Talles</span>
              <span className="block text-sm text-white/50">Contacto</span>
            </div>
          </div>

          <div>
            <h4 className="text-white text-[11px] font-semibold tracking-[0.15em] uppercase mb-6">Contacto</h4>
            <div className="space-y-3">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="block text-sm text-white/50 hover:text-white transition-colors no-underline">
                WhatsApp: +54 9 297 414 5259
              </a>
              <span className="block text-sm text-white/50">Río Gallegos, Santa Cruz</span>
              <span className="block text-sm text-white/50">Argentina</span>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Elizabeth. Todos los derechos reservados.</span>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:bg-eliz-accent hover:border-eliz-accent hover:text-white transition-all duration-300 text-xs no-underline"
            aria-label="WhatsApp"
          >
            WA
          </a>
        </div>
      </div>
    </footer>
  );
}
