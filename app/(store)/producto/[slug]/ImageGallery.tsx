"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = { id: number; url: string; alt: string | null };

export function ImageGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-eliz-bg-warm flex items-center justify-center text-eliz-muted text-sm">
        Sin imagen
      </div>
    );
  }

  const active = images[Math.min(activeIndex, images.length - 1)];

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-eliz-bg-warm relative overflow-hidden">
        <Image
          src={active.url}
          alt={active.alt ?? productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Ver imagen ${idx + 1}`}
              aria-current={idx === activeIndex}
              className={`aspect-square bg-eliz-bg-warm relative overflow-hidden transition-all duration-300 cursor-pointer border-0 p-0 ${
                idx === activeIndex ? "ring-2 ring-eliz-text ring-offset-2" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
