import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { getSession } from "@/lib/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Kembali dari Pembayaran",
  description: "Memeriksa pesanan setelah kembali dari halaman pembayaran Midtrans.",
};

export default async function PaymentFinishPage({ searchParams }: { searchParams: Promise<{ order_id?: string | string[] }> }) {
  const { order_id: orderIdParam } = await searchParams;
  const orderId = typeof orderIdParam === "string" ? orderIdParam : undefined;
  const session = await getSession();

  if (!session) {
    const callbackURL = orderId ? `/payment/finish?order_id=${encodeURIComponent(orderId)}` : "/payment/finish";
    redirect(`/login?${new URLSearchParams({ callbackURL }).toString()}`);
  }

  const order = orderId
    ? await db.order.findFirst({ where: { id: orderId, userId: session.user.id }, select: { id: true } })
    : null;

  if (order) redirect(`/orders/${encodeURIComponent(order.id)}`);

  return <section className="bg-white py-14 sm:py-20"><div className="page-shell"><div className="mx-auto max-w-2xl rounded-3xl border border-black/10 bg-canvas-gray px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-yellow text-ink-black" aria-hidden="true"><Icon name="orders" className="h-7 w-7" /></span><h1 className="mt-6 font-display text-4xl font-extrabold text-ink-black">Pesanan tidak ditemukan</h1><p className="mx-auto mt-3 max-w-lg leading-7">Kami tidak menggunakan status dari alamat redirect sebagai bukti pembayaran. Buka riwayat pesanan untuk melihat status terbaru yang telah diverifikasi server.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/orders" className="btn-primary">Lihat Pesanan <Icon name="arrow" /></Link><Link href="/catalog" className="btn-secondary">Kembali ke Katalog</Link></div></div></div></section>;
}
