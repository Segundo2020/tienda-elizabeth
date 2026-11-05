import Link from "next/link";
import Image from "next/image";

export type ProductCardData = {
  id: number;
  name: string;
  slug: string;
  price: string;
  imageUrl: string | null;
  categoryName?: string | null;
  badge?: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block bg-eliz-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] no-underline"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-eliz-bg-warm">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-eliz-muted text-sm">
            Sin imagen
          </div>
        )}

        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#1a1a1a] text-white text-[9px] font-bold tracking-[0.1em] uppercase px-3 py-1.5">
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-4 md:p-5">
        {product.categoryName && (
          <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-eliz-accent mb-1.5">
            {product.categoryName}
          </div>
        )}
        <h3 className="font-serif text-base md:text-[17px] font-medium leading-snug text-eliz-text mb-2.5">
          {product.name}
        </h3>
        <p className="text-[15px] font-semibold text-eliz-text">
          ${Number(product.price).toLocaleString("es-AR")}
        </p>
      </div>
    </Link>
  );
}
