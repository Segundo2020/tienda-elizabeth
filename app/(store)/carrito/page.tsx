"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { useMounted } from "@/lib/hooks/useMounted";
import { createOrder, type CreateOrderState } from "./actions";

const initialState: CreateOrderState = { whatsappUrl: null, error: null };

const inputClass =
  "w-full px-4 py-3.5 border border-eliz-border bg-eliz-card text-sm outline-none transition-all focus:border-eliz-accent";
const labelClass = "block text-[11px] font-semibold tracking-[0.1em] uppercase text-eliz-muted mb-2";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [state, formAction, isPending] = useActionState(createOrder, initialState);

  const mounted = useMounted();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const handledUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (state.whatsappUrl && handledUrlRef.current !== state.whatsappUrl) {
      handledUrlRef.current = state.whatsappUrl;
      window.open(state.whatsappUrl, "_blank");
      setTimeout(() => {
        clearCart();
        setName("");
        setPhone("");
        setNotes("");
      }, 200);
    }
  }, [state.whatsappUrl, clearCart]);

  // Evita mismatch de hidratación: el carrito vive en localStorage
  if (!mounted) {
    return <section className="max-w-[1400px] mx-auto px-5 md:px-8 py-12 md:py-20 min-h-[50vh]" />;
  }

  return (
    <section className="max-w-[1400px] mx-auto px-5 md:px-8 py-12 md:py-20">
      <nav className="flex items-center gap-2 text-xs text-eliz-muted mb-8 md:mb-10" aria-label="Ruta">
        <Link href="/" className="hover:text-eliz-text transition-colors no-underline">Inicio</Link>
        <span>/</span>
        <span className="text-eliz-text font-medium">Carrito</span>
      </nav>

      <h1 className="font-serif text-[32px] md:text-[42px] font-normal mb-10 md:mb-14">
        Tu <em className="text-eliz-accent italic">carrito</em>
      </h1>

      {state.whatsappUrl && (
        <div className="mb-6 p-4 bg-eliz-success/10 border border-eliz-success/30 text-eliz-success text-sm" role="status">
          Pedido enviado. Si no se abrió WhatsApp automáticamente,{" "}
          <a href={state.whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline font-medium">
            hacé click acá
          </a>
          .
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-eliz-muted text-lg mb-6">Tu carrito está vacío.</p>
          <Link href="/#catalogo" className="inline-flex items-center gap-2 px-8 py-3.5 bg-eliz-accent text-white text-xs font-semibold tracking-[0.12em] uppercase no-underline transition-colors hover:bg-eliz-accent-hover">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-16">
          <div className="space-y-6">
            {items.map((item) => {
              const variant = [item.size && `Talle ${item.size}`, item.color].filter(Boolean).join(" · ");
              return (
                <div key={item.variantId} className="flex gap-4 md:gap-6 p-4 md:p-5 bg-eliz-card border border-eliz-border">
                  <div className="flex-1 min-w-0">
                    <Link href={`/producto/${item.productSlug}`} className="font-serif text-base md:text-lg font-medium text-eliz-text no-underline hover:text-eliz-accent transition-colors">
                      {item.productName}
                    </Link>
                    {variant && <p className="text-sm text-eliz-muted mt-1">{variant}</p>}
                    <p className="text-sm font-semibold text-eliz-text mt-2">
                      ${(item.price * item.quantity).toLocaleString("es-AR")}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center border border-eliz-border">
                      <button type="button" aria-label="Restar" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-eliz-text hover:bg-eliz-bg-warm transition-colors cursor-pointer border-0 bg-transparent">−</button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button type="button" aria-label="Sumar" onClick={() => updateQuantity(item.variantId, Math.min(20, item.quantity + 1))}
                        className="w-8 h-8 flex items-center justify-center text-eliz-text hover:bg-eliz-bg-warm transition-colors cursor-pointer border-0 bg-transparent">+</button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.variantId)}
                      className="text-xs text-eliz-muted hover:text-red-600 transition-colors cursor-pointer bg-transparent border-0 underline">
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}

            <button type="button" onClick={clearCart}
              className="text-xs text-eliz-muted hover:text-eliz-text transition-colors cursor-pointer bg-transparent border-0 underline">
              Vaciar carrito
            </button>
          </div>

          <div className="bg-eliz-card border border-eliz-border p-6 md:p-8 h-fit">
            <h2 className="font-serif text-xl font-medium mb-6">Resumen del pedido</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-eliz-border">
              <div className="flex justify-between text-sm">
                <span className="text-eliz-muted">Productos ({totalItems()})</span>
                <span className="font-medium">${totalPrice().toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-eliz-muted">Envío</span>
                <span className="font-medium text-eliz-success">Gratis</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-medium">Total</span>
              <span className="font-serif text-2xl font-semibold">${totalPrice().toLocaleString("es-AR")}</span>
            </div>

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="items" value={JSON.stringify(items)} />

              <div>
                <label htmlFor="customerName" className={labelClass}>Nombre completo *</label>
                <input id="customerName" type="text" name="customerName" value={name} onChange={(e) => setName(e.target.value)}
                  required minLength={2} maxLength={100} autoComplete="name" placeholder="Tu nombre" className={inputClass} />
              </div>

              <div>
                <label htmlFor="customerPhone" className={labelClass}>Teléfono *</label>
                <input id="customerPhone" type="tel" name="customerPhone" value={phone} onChange={(e) => setPhone(e.target.value)}
                  required pattern="[0-9+\s\-]{8,20}" maxLength={20} autoComplete="tel" placeholder="Ej: 2966123456" className={inputClass} />
              </div>

              <div>
                <label htmlFor="notes" className={labelClass}>Notas (opcional)</label>
                <textarea id="notes" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={500}
                  placeholder="Alguna indicación especial..." className={`${inputClass} resize-none`} />
              </div>

              {state.error && <p className="text-sm text-red-600" role="alert">{state.error}</p>}

              <button type="submit" disabled={isPending || items.length === 0}
                className="w-full py-4 bg-eliz-text text-eliz-bg text-[12px] font-semibold tracking-[0.12em] uppercase transition-all duration-300 hover:bg-eliz-accent hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {isPending ? "Procesando..." : "Enviar pedido por WhatsApp"}
              </button>
            </form>

            <p className="text-xs text-eliz-muted text-center mt-4">
              Al enviar, se abrirá WhatsApp con el detalle de tu pedido.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
