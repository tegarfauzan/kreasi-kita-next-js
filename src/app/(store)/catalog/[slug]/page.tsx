import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { Icon } from "@/components/ui/Icon";
import { formatCurrency } from "@/lib/format";
import { getProductBySlug, listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return product ? { title: product.name, description: product.description } : { title: "Produk tidak ditemukan" };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const products = await listProducts();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  const galleryProducts = [product, ...products.filter((item) => item.id !== product.id).slice(0, 2)];
  return <><section className="bg-white py-10 sm:py-16"><div className="page-shell"><nav className="mb-8 flex flex-wrap gap-2 text-sm" aria-label="Breadcrumb"><Link href="/" className="font-semibold hover:text-ink-black">Beranda</Link><span>/</span><Link href="/catalog" className="font-semibold hover:text-ink-black">Katalog</Link><span>/</span><span className="font-bold text-ink-black">{product.name}</span></nav><div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"><ProductGallery images={galleryProducts.map((item) => ({ src: item.imageUrl, alt: item.imageAlt }))} badge={product.badge} credit={{ name: product.photographer, url: product.photoPage }} /><div className="lg:pt-6"><p className="text-xs font-bold uppercase tracking-[0.18em]">{product.category}</p><h1 className="mt-2 font-display text-5xl font-extrabold leading-none text-ink-black sm:text-6xl">{product.name}</h1><p className="mt-5 inline-block text-3xl font-bold text-ink-black underline decoration-brand-yellow decoration-8 underline-offset-8">{formatCurrency(product.price)}</p><p className="mt-8 text-lg leading-8">{product.description}</p><div className="mt-7 flex flex-wrap items-center gap-3"><span className="rounded-full bg-status-success/10 px-4 py-2 text-sm font-bold text-status-success">Stok tersedia · {product.stock}</span><span className="rounded-full bg-canvas-gray px-4 py-2 text-sm font-bold text-ink-black">Kurasi lokal</span></div><ProductPurchase slug={product.slug} stock={product.stock} /><div className="mt-8 grid gap-3 text-sm sm:grid-cols-2"><p className="flex items-center gap-2"><Icon name="shield" className="h-5 w-5 text-status-success" /> Pembayaran aman</p><p className="flex items-center gap-2"><Icon name="package" className="h-5 w-5 text-brand-yellow" /> Kemasan terlindungi</p></div></div></div></div></section><section className="py-16 sm:py-20"><div className="page-shell"><div className="flex items-end justify-between gap-4"><div><p className="font-accent text-2xl">Mungkin kamu juga suka</p><h2 className="font-display text-4xl font-extrabold text-ink-black">Karya Serupa</h2></div><Link href="/catalog" className="font-bold underline decoration-brand-yellow decoration-4">Katalog →</Link></div><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></div></section></>;
}
