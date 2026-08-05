import type { Metadata } from "next";
import { AccountNav } from "@/components/layout/AccountNav";
import { OrderCard } from "@/components/account/OrderCard";
import { requireUser } from "@/lib/dal";
import { db } from "@/lib/db";
import { toOrderDto } from "@/lib/orders";

export const metadata: Metadata = { title: "Riwayat Pesanan", description: "Pantau status dan detail pesanan KreasiKita." };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await requireUser();
  const orders = (await db.order.findMany({ where: { userId: session.user.id }, include: { items: true, payment: true }, orderBy: { createdAt: "desc" } })).map(toOrderDto);
  return <><section className="bg-white py-12 sm:py-16"><div className="page-shell"><p className="font-accent text-3xl font-semibold">Jejak karya pilihanmu</p><h1 className="font-display text-5xl font-extrabold text-ink-black sm:text-6xl">Riwayat Pesanan</h1><p className="mt-4 max-w-2xl leading-7">Pantau status pesanan dan lihat kembali detail karya yang pernah kamu pilih.</p></div></section><section className="py-12 sm:py-16"><div className="page-shell grid gap-8 lg:grid-cols-[16rem_1fr]"><AccountNav active="orders" /><div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="font-display text-3xl font-bold text-ink-black">Pesanan Terbaru</h2><span className="text-sm">{orders.length} pesanan</span></div>{orders.length ? orders.map((order) => <OrderCard key={order.id} order={order} />) : <div className="rounded-2xl bg-white p-8 text-center shadow-sm"><h2 className="font-display text-2xl font-bold text-ink-black">Belum ada pesanan.</h2><p className="mt-2">Produk yang kamu checkout akan tampil di sini.</p></div>}</div></div></section></>;
}
