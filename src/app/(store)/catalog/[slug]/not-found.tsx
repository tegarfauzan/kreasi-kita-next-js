import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function ProductNotFound() {
  return <section className="py-16 sm:py-24"><div className="page-shell"><div className="mx-auto max-w-2xl rounded-[2rem] border-2 border-dashed border-black/20 bg-white px-6 py-14 text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-yellow"><Icon name="package" className="h-10 w-10 text-ink-black" /></div><h1 className="mt-6 font-display text-4xl font-extrabold text-ink-black sm:text-5xl">Produk tidak ditemukan</h1><p className="mx-auto mt-3 max-w-md leading-7">Slug produk tidak valid atau produk tidak tersedia pada katalog demo.</p><Link href="/catalog" className="btn-primary mt-7"><Icon name="chevron" className="h-4 w-4 rotate-180" /> Kembali ke Katalog</Link></div></div></section>;
}
