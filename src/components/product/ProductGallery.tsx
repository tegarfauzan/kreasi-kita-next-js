"use client";

import Image from "next/image";
import { useState } from "react";

interface GalleryImage { src: string; alt: string }

export function ProductGallery({ images, badge, credit }: { images: GalleryImage[]; badge?: string; credit: { name: string; url: string } }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0]!;
  return <div><div className="relative aspect-square overflow-hidden rounded-[2rem] bg-canvas-gray"><Image src={activeImage.src} alt={activeImage.alt} fill sizes="(min-width:1024px) 50vw, 100vw" quality={80} preload className="object-cover" />{badge && <span className="absolute left-5 top-5 rounded-full bg-brand-yellow px-4 py-2 text-sm font-bold text-ink-black">{badge}</span>}</div><div className="mt-4 grid grid-cols-3 gap-3">{images.map((image, index) => <button key={`${image.src}-${index}`} type="button" className={`relative aspect-square overflow-hidden rounded-xl border-2 ${activeIndex === index ? "border-brand-yellow" : "border-transparent"}`} onClick={() => setActiveIndex(index)} aria-label={`Tampilkan gambar ${index + 1}`} aria-pressed={activeIndex === index}><Image src={image.src} alt="" fill sizes="(min-width:1024px) 16vw, 33vw" quality={80} className="object-cover" /></button>)}</div><p className="mt-3 text-xs">Foto: <a href={credit.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{credit.name} / Unsplash</a></p></div>;
}
