'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { useEffect, useState } from 'react';

export function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCart((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/carrito"
      className="relative inline-flex items-center p-1"
      aria-label="Carrito"
    >
      <ShoppingBag
        className="w-5 h-5 text-neutral-700 hover:text-black transition"
        strokeWidth={1.5}
      />
      {mounted && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-medium">
          {totalItems}
        </span>
      )}
    </Link>
  );
}