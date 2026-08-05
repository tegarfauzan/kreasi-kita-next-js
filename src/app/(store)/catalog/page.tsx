import type { Metadata } from "next";
import Link from "next/link";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { listProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Katalog", description: "Cari dan filter produk kreatif lokal KreasiKita." };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "Semua" } = await searchParams;
  const products = await listProducts();
  return <><section className="relative overflow-hidden bg-white py-14 sm:py-20"><span className="pointer-events-none absolute -right-6 -top-5 font-display text-[13rem] font-extrabold leading-none text-transparent opacity-10 [-webkit-text-stroke:2px_#1c1c1c]" aria-hidden="true">02</span><div className="page-shell relative"><nav className="mb-6 flex gap-2 text-sm" aria-label="Breadcrumb"><Link href="/" className="font-semibold hover:text-ink-black">Beranda</Link><span>/</span><span className="font-bold text-ink-black">Katalog</span></nav><p className="font-accent text-3xl font-semibold">Pilih yang paling “kamu”.</p><h1 className="font-display text-5xl font-extrabold leading-none text-ink-black sm:text-7xl">Katalog Karya</h1><p className="mt-5 max-w-2xl text-lg leading-8">Koleksi benda fungsional dengan detail yang tidak biasa—dikurasi untuk meja, rumah, dan jeda kecilmu.</p></div></section><CatalogClient initialQuery={q} initialCategory={category} products={products} /></>;
}
