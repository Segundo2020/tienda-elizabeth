'use client';

import Link from 'next/link';
import { useCart } from '@/lib/store/cart';
import { useEffect, useState } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCart((state) => state.items);
  const totalPrice = useCart((state) => state.totalPrice());
  const totalItems = useCart((state) => state.totalItems());
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const clearCart = useCart((state) => state.clearCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl md:text-4xl font-light mb-4">
          Tu carrito está vacío
        </h1>
        <p className="text-neutral-600 mb-10">
          ¿Todavía no encontraste lo que buscabas?
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition"
        >
          Ver catálogo
        </Link>
      </main>
    );
  }

  function buildWhatsAppMessage() {
    const lines = [
      'Hola! Quiero hacer el siguiente pedido:',
      '',
      ...items.map(
        (item) =>
          `• ${item.quantity}x ${item.productName}${item.size ? ` - Talle ${item.size}` : ''}${item.color ? ` - ${item.color}` : ''} → $${(item.price * item.quantity).toLocaleString('es-AR')}`
      ),
      '',
      `Total: $${totalPrice.toLocaleString('es-AR')}`,
    ];
    return encodeURIComponent(lines.join('\n'));
  }

  const whatsappUrl = `https://wa.me/5492974145259?text=${buildWhatsAppMessage()}`;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-light mb-2">Tu carrito</h1>
      <p className="text-xs text-neutral-500 uppercase tracking-[0.2em] mb-12">
        {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-6 pb-6 border-b border-neutral-200">
              <div className="w-24 h-24 bg-neutral-100 flex-shrink-0 flex items-center justify-center text-[10px] text-neutral-400 text-center px-2">
                {item.productName.split(' ').slice(0, 2).join(' ')}
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/producto/${item.productSlug}`} className="text-sm font-medium hover:underline">
                  {item.productName}
                </Link>
                <div className="text-[10px] text-neutral-500 uppercase tracking-[0.15em] mt-1">
                  {item.size && <span>Talle {item.size}</span>}
                  {item.size && item.color && <span> · </span>}
                  {item.color && <span>{item.color}</span>}
                </div>

                <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
                  <div className="flex items-center border border-neutral-300">
                    <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-2 hover:bg-neutral-100 transition" aria-label="Restar">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-4 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-2 hover:bg-neutral-100 transition" aria-label="Sumar">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-sm font-medium">
                    ${(item.price * item.quantity).toLocaleString('es-AR')}
                  </div>
                </div>
              </div>

              <button onClick={() => removeItem(item.variantId)} className="text-neutral-400 hover:text-black self-start p-1 transition" aria-label="Eliminar">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button onClick={clearCart} className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] hover:text-black transition">
            Vaciar carrito
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-neutral-50 p-6 sticky top-24">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] mb-6">Resumen</h2>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-neutral-600">Productos ({totalItems})</span>
              <span>${totalPrice.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-sm mb-6 pb-6 border-b border-neutral-200">
              <span className="text-neutral-600">Envío</span>
              <span className="text-neutral-500 text-xs">A coordinar</span>
            </div>
            <div className="flex justify-between text-base font-medium mb-8">
              <span>Total</span>
              <span>${totalPrice.toLocaleString('es-AR')}</span>
            </div>

            
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setTimeout(() => clearCart(), 100)}
              className="block w-full py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition text-center"
            >
              Pedir por WhatsApp
            </a>

            <p className="text-[10px] text-neutral-500 mt-4 text-center leading-relaxed">
              Al enviar el pedido coordinaremos la entrega y el método de pago.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}