"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/store/cart";
import { useMounted } from "@/lib/hooks/useMounted";

const navLinks = [
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#categorias", label: "Categorías" },
  { href: "/#destacados", label: "Destacados" },
  { href: "/#nosotros", label: "Nosotros" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useMounted();
  const totalItems = useCart((s) => s.totalItems());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-eliz-text text-eliz-bg text-center py-2.5 px-4 text-[11px] font-medium tracking-[0.08em] uppercase">
        Envío gratis en Río Gallegos · Pedidos por WhatsApp · Atención personalizada
      </div>

      <header
        className={`sticky top-0 z-50 bg-eliz-bg/90 backdrop-blur-[16px] border-b border-eliz-border transition-shadow duration-300 ${
          scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.06)]" : ""
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 flex items-center justify-between h-[64px] md:h-[72px]">
          <Link
            href="/"
            className="font-serif text-[22px] md:text-[26px] font-semibold tracking-[0.15em] uppercase text-eliz-text no-underline"
          >
            Elizabeth
          </Link>

          <nav className="hidden md:flex gap-9 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[13px] font-medium tracking-[0.04em] uppercase text-eliz-muted hover:text-eliz-text transition-colors duration-300 py-1 group no-underline"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-eliz-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-5">
            <button
              className="md:hidden p-2 text-eliz-text"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
              aria-expanded={mobileOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>
                ) : (
                  <><path d="M4 12h16" /><path d="M4 6h16" /><path d="M4 18h16" /></>
                )}
              </svg>
            </button>

            <Link
              href="/carrito"
              className="relative p-2 text-eliz-text hover:text-eliz-accent transition-colors duration-300"
              aria-label="Carrito"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {mounted && totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-eliz-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-eliz-border bg-eliz-bg px-5 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium tracking-[0.04em] uppercase text-eliz-muted hover:text-eliz-text transition-colors no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
