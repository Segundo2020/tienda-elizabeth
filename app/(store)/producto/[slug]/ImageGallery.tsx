"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = {
  id: number;
  url: string;
  alt: string | null;
};

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
      <div className="aspect-square bg-neutral-100 flex items-center justify-center text-neutral-300 text-sm">
        Sin imagen
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-neutral-100 relative overflow-hidden">
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
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`aspect-square bg-neutral-100 relative overflow-hidden transition ${
                idx === activeIndex
                  ? "ring-2 ring-neutral-900 ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Ver imagen ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? productName}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
