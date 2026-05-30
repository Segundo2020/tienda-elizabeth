import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-lg font-medium tracking-[0.2em] mb-3">ELIZABETH</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Ropa para toda la familia.<br />
              Catálogo curado.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 mb-4">Catálogo</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-neutral-700 hover:text-black transition">Todos los productos</Link></li>
              <li><Link href="/categoria/remeras" className="text-sm text-neutral-700 hover:text-black transition">Remeras</Link></li>
              <li><Link href="/categoria/buzos" className="text-sm text-neutral-700 hover:text-black transition">Buzos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 mb-4">Contacto</h4>
            <a href="https://wa.me/5492966000000" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-700 hover:text-black transition block">WhatsApp</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-700 hover:text-black transition block mt-2">Instagram</a>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-6 text-xs text-neutral-500">
          © 2026 Elizabeth. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}