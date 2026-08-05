"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "../product/ProductCard";
import { Icon } from "../ui/Icon";
import type { Product, ProductCategory } from "@/types";

const categories: Array<"Semua" | ProductCategory> = ["Semua", "Alat Tulis", "Dekorasi", "Perawatan"];

export function CatalogClient({ initialQuery, initialCategory, products }: { initialQuery: string; initialCategory: string; products: Product[] }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<"Semua" | ProductCategory>(categories.includes(initialCategory as "Semua" | ProductCategory) ? initialCategory as "Semua" | ProductCategory : "Semua");
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLocaleLowerCase("id-ID").trim();
    return products.filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.keywords.join(" ")}`.toLocaleLowerCase("id-ID");
      return (!normalizedQuery || haystack.includes(normalizedQuery)) && (category === "Semua" || product.category === category);
    });
  }, [category, query]);
  const reset = () => { setQuery(""); setCategory("Semua"); };
  const filtered = query.trim() !== "" || category !== "Semua";

  return <><section className="border-y border-black/10 py-8" aria-label="Pencarian dan filter produk"><div className="page-shell"><label htmlFor="catalog-search" className="form-label">Cari produk</label><div className="relative"><input id="catalog-search" type="search" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Coba cari notebook, lilin, atau dekorasi..." className="form-input pl-12 pr-12" /><Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-black" />{query && <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1" onClick={() => setQuery("")} aria-label="Hapus pencarian"><Icon name="close" /></button>}</div><p className="form-label mb-3 mt-6">Filter kategori</p><div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter berdasarkan kategori">{categories.map((item) => <button key={item} type="button" className={`filter-chip ${category === item ? "filter-chip-active" : ""}`} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div></div></section><section className="py-14 sm:py-20"><div className="page-shell"><div className="flex items-end justify-between gap-4 border-b border-black/15 pb-5"><div><h2 className="font-display text-3xl font-extrabold text-ink-black">{category === "Semua" ? "Semua Produk" : category}</h2><p className="mt-1 text-sm" aria-live="polite">{filteredProducts.length} produk ditemukan</p></div>{filtered && <button type="button" className="btn-secondary px-4 py-2 text-sm" onClick={reset}>Reset</button>}</div>{filteredProducts.length > 0 ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="mt-8 rounded-[2rem] border-2 border-dashed border-black/20 bg-white px-6 py-14 text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-yellow"><Icon name="search" className="h-10 w-10 text-ink-black" /></div><h3 className="mt-5 font-display text-3xl font-bold text-ink-black">Belum ketemu karyanya.</h3><p className="mx-auto mt-2 max-w-md leading-7">Coba kata kunci yang lebih sederhana atau kembali lihat semua kategori.</p><button type="button" className="btn-primary mt-6" onClick={reset}>Tampilkan semua produk</button></div>}</div></section></>;
}
