"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "../ui/Icon";

export function ProductPurchase({ slug, stock }: { slug: string; stock: number }) {
  const [quantity, setQuantity] = useState(1);
  const update = (delta: number) => setQuantity((value) => Math.min(stock, Math.max(1, value + delta)));
  return <><div className="mt-9 border-y border-black/15 py-6"><label className="form-label" htmlFor="quantity">Jumlah</label><div className="flex items-center gap-4"><div className="inline-flex items-center rounded-full border-2 border-ink-black"><button type="button" className="grid h-12 w-12 place-items-center text-xl font-bold" onClick={() => update(-1)} aria-label="Kurangi jumlah">−</button><input id="quantity" className="h-12 w-14 border-x-2 border-ink-black bg-transparent text-center font-bold text-ink-black outline-none" type="number" min="1" max={stock} value={quantity} readOnly /><button type="button" className="grid h-12 w-12 place-items-center text-xl font-bold" onClick={() => update(1)} aria-label="Tambah jumlah">+</button></div><p className="text-sm">Maksimal {stock} item</p></div></div><Link href={`/checkout?slug=${encodeURIComponent(slug)}&qty=${quantity}`} className="btn-primary mt-7 w-full sm:w-auto">Beli Sekarang <Icon name="arrow" /></Link></>;
}
