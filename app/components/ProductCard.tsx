import Link from 'next/link';
import Image from 'next/image';

type Props = {
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    description: string | null;
    categoryName?: string | null;
    imageUrl?: string | null;
  };
};

export function ProductCard({ product }: Props) {
  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <div className="aspect-square bg-neutral-100 mb-4 overflow-hidden relative">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs px-4 text-center">
            {product.name}
          </div>
        )}
      </div>
      <div>
        {product.categoryName && (
          <div className="text-[10px] text-neutral-500 uppercase tracking-[0.15em] mb-1.5">
            {product.categoryName}
          </div>
        )}
        <h2 className="text-sm text-neutral-900">{product.name}</h2>
        <div className="text-sm text-neutral-700 mt-1">
          ${Number(product.price).toLocaleString('es-AR')}
        </div>
      </div>
    </Link>
  );
}