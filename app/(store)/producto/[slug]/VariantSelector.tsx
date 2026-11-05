"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";

type Variant = {
  id: number;
  size: string | null;
  color: string | null;
  stock: number;
};

const MAX_QTY = 20;

export function VariantSelector({
  productId,
  productName,
  productSlug,
  price,
  variants,
}: {
  productId: number;
  productName: string;
  productSlug: string;
  price: number;
  variants: Variant[];
}) {
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter((s): s is string => !!s)));
  const colors = Array.from(new Set(variants.map((v) => v.color).filter((c): c is string => !!c)));

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors.length === 1 ? colors[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const updateQuantity = useCart((s) => s.updateQuantity);

  // Si el producto no tiene talles/colores, la variante tiene null en ese campo
  const selectedVariant = variants.find(
    (v) =>
      (sizes.length === 0 || v.size === selectedSize) &&
      (colors.length === 0 || v.color === selectedColor)
  );

  const inCart = useCart((s) => s.items.find((i) => i.variantId === selectedVariant?.id)?.quantity ?? 0);
  const available = selectedVariant ? selectedVariant.stock - inCart : 0;
  const maxQty = Math.max(0, Math.min(MAX_QTY, available));
  const canAdd = !!selectedVariant && maxQty > 0 && quantity >= 1 && quantity <= maxQty;

  const handleAdd = () => {
    if (!canAdd || !selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productId,
      productName,
      productSlug,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price,
    });
    // addItem suma de a 1: ajustamos a la cantidad elegida
    if (quantity > 1) updateQuantity(selectedVariant.id, inCart + quantity);
    setQuantity(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const optionClass = (selected: boolean, hasStock: boolean) =>
    `min-w-[48px] px-4 py-2.5 text-sm font-medium border transition-all duration-200 ${
      selected
        ? "bg-eliz-text text-eliz-bg border-eliz-text cursor-pointer"
        : hasStock
        ? "bg-eliz-card text-eliz-text border-eliz-border hover:border-eliz-text cursor-pointer"
        : "bg-eliz-bg-warm text-eliz-muted border-eliz-border cursor-not-allowed line-through opacity-50"
    }`;

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <fieldset>
          <legend className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-eliz-muted mb-3">Talle</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const hasStock = variants.some((v) => v.size === size && v.stock > 0);
              return (
                <button key={size} type="button" disabled={!hasStock} aria-pressed={selectedSize === size}
                  onClick={() => { setSelectedSize(size); setQuantity(1); setAdded(false); }}
                  className={optionClass(selectedSize === size, hasStock)}>
                  {size}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {colors.length > 0 && (
        <fieldset>
          <legend className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-eliz-muted mb-3">Color</legend>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const hasStock = variants.some(
                (v) => v.color === color && v.stock > 0 && (sizes.length === 0 || !selectedSize || v.size === selectedSize)
              );
              return (
                <button key={color} type="button" disabled={!hasStock} aria-pressed={selectedColor === color}
                  onClick={() => { setSelectedColor(color); setQuantity(1); setAdded(false); }}
                  className={optionClass(selectedColor === color, hasStock)}>
                  {color}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div>
        <span className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-eliz-muted mb-3">Cantidad</span>
        <div className="flex items-center border border-eliz-border w-fit">
          <button type="button" aria-label="Restar" onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-11 h-11 flex items-center justify-center text-eliz-text hover:bg-eliz-bg-warm transition-colors cursor-pointer border-0 bg-transparent">−</button>
          <span className="w-12 text-center text-sm font-medium" aria-live="polite">{quantity}</span>
          <button type="button" aria-label="Sumar" onClick={() => setQuantity((q) => Math.min(Math.max(1, maxQty), q + 1))}
            className="w-11 h-11 flex items-center justify-center text-eliz-text hover:bg-eliz-bg-warm transition-colors cursor-pointer border-0 bg-transparent">+</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button type="button" onClick={handleAdd} disabled={!canAdd}
          className={`flex-1 py-4 text-[12px] font-semibold tracking-[0.12em] uppercase transition-all duration-300 ${
            added
              ? "bg-eliz-success text-white"
              : canAdd
              ? "bg-eliz-text text-eliz-bg hover:bg-eliz-accent hover:text-white cursor-pointer"
              : "bg-eliz-bg-warm text-eliz-muted cursor-not-allowed"
          }`}>
          {added ? "✓ Agregado al carrito" : !selectedVariant ? "Elegí talle y color" : maxQty === 0 ? "Sin stock" : "Agregar al carrito"}
        </button>

        <Link href="/carrito"
          className="flex-1 py-4 text-center text-[12px] font-semibold tracking-[0.12em] uppercase border border-eliz-text text-eliz-text no-underline transition-all duration-300 hover:bg-eliz-text hover:text-eliz-bg">
          Ver carrito
        </Link>
      </div>

      {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3 && (
        <p className="text-xs text-eliz-accent font-medium">
          ¡Quedan solo {selectedVariant.stock} {selectedVariant.stock === 1 ? "unidad" : "unidades"}!
        </p>
      )}
    </div>
  );
}
