'use client';

import { useState } from 'react';
import { useCart } from '@/lib/store/cart';

type Variant = {
  id: number;
  size: string | null;
  color: string | null;
  stock: number;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
};

export function VariantSelector({
  variants,
  product,
}: {
  variants: Variant[];
  product: Product;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const sizes = Array.from(
    new Set(variants.map((v) => v.size).filter((s): s is string => s !== null))
  );
  const colors = Array.from(
    new Set(variants.map((v) => v.color).filter((c): c is string => c !== null))
  );

  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const availableColorsForSize = selectedSize
    ? new Set(
        variants
          .filter((v) => v.size === selectedSize && v.stock > 0)
          .map((v) => v.color)
      )
    : new Set(colors);

  const canAddToCart = selectedVariant && selectedVariant.stock > 0 && !added;

  function handleAddToCart() {
    if (!selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      size: selectedSize,
      color: selectedColor,
      price: Number(product.price),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-8">
      {sizes.length > 0 && (
        <div>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 mb-3">
            Talle
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[3rem] px-4 py-2.5 border text-sm transition ${
                  selectedSize === size
                    ? 'bg-black text-white border-black'
                    : 'border-neutral-300 hover:border-black text-neutral-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 mb-3">
            Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isAvailable = availableColorsForSize.has(color);
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={!isAvailable}
                  className={`px-4 py-2.5 border text-sm transition ${
                    selectedColor === color
                      ? 'bg-black text-white border-black'
                      : isAvailable
                      ? 'border-neutral-300 hover:border-black text-neutral-900'
                      : 'border-neutral-200 text-neutral-300 cursor-not-allowed line-through'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedVariant && (
        <div className="text-xs text-neutral-500 uppercase tracking-[0.15em]">
          {selectedVariant.stock > 0
            ? `${selectedVariant.stock} disponibles`
            : 'Sin stock'}
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={!canAddToCart}
        className="w-full py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition disabled:bg-neutral-300 disabled:cursor-not-allowed"
      >
        {added
          ? '✓ Agregado'
          : !selectedSize || !selectedColor
          ? 'Elegí talle y color'
          : !selectedVariant || selectedVariant.stock === 0
          ? 'Sin stock'
          : 'Agregar al carrito'}
      </button>
    </div>
  );
}