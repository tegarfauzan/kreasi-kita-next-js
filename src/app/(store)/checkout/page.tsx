import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Icon } from "@/components/ui/Icon";
import { normalizeCheckoutQuantity } from "@/lib/checkout";
import { getProductBySlug } from "@/lib/products";
import { requireUser } from "@/lib/dal";

export const metadata: Metadata = { title: "Checkout", description: "Periksa informasi pengiriman dan ringkasan pesanan KreasiKita." };

function CheckoutIntro() {
  return <section className="bg-white py-10 sm:py-14"><div className="page-shell"><nav className="mb-5 flex gap-2 text-sm" aria-label="Breadcrumb"><Link href="/" className="font-semibold">Beranda</Link><span>/</span><span className="font-bold text-ink-black">Checkout</span></nav><h1 className="font-display text-4xl font-extrabold text-ink-black sm:text-5xl">Checkout</h1><p className="mt-3 max-w-2xl leading-7">Periksa detail pengiriman dan pesanan sebelum diarahkan ke halaman pembayaran Midtrans.</p></div></section>;
}

function CheckoutNotice({ title, description, actionLabel = "Pilih Produk" }: { title: string; description: string; actionLabel?: string }) {
  return <section className="py-12 sm:py-16"><div className="page-shell"><div className="mx-auto max-w-2xl rounded-3xl border border-black/10 bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-yellow text-ink-black" aria-hidden="true"><Icon name="cart" className="h-7 w-7" /></span><h2 className="mt-6 font-display text-3xl font-extrabold text-ink-black sm:text-4xl">{title}</h2><p className="mx-auto mt-3 max-w-lg leading-7">{description}</p><Link href="/catalog" className="btn-primary mt-7">{actionLabel}<Icon name="arrow" /></Link></div></div></section>;
}

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ slug?: string; qty?: string }> }) {
  const { slug, qty } = await searchParams;
  const session = await requireUser();
  if (!slug) return <><CheckoutIntro /><CheckoutNotice title="Belum ada produk untuk di-checkout" description="Pilih karya yang kamu suka dari katalog, lalu tekan tombol Beli Sekarang untuk melanjutkan." /></>;

  const selected = await getProductBySlug(slug);
  if (!selected) return <><CheckoutIntro /><CheckoutNotice title="Produk tidak tersedia" description="Produk yang kamu pilih mungkin sudah tidak aktif atau alamatnya tidak lagi berlaku." actionLabel="Lihat Katalog" /></>;
  if (selected.stock <= 0) return <><CheckoutIntro /><CheckoutNotice title="Stok produk sedang habis" description={`${selected.name} belum dapat dipesan saat ini. Silakan pilih karya lain dari katalog.`} actionLabel="Pilih Produk Lain" /></>;

  const quantity = normalizeCheckoutQuantity(qty, selected.stock);
  return <><CheckoutIntro /><section className="py-12 sm:py-16"><CheckoutForm items={[{ product: selected, initialQuantity: quantity }]} user={{ name: session.user.name, email: session.user.email, phone: session.user.phone ?? "", address: session.user.address ?? "", city: session.user.city ?? "", postalCode: session.user.postalCode ?? "" }} /></section></>;
}
