import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard Admin", description: "Ringkasan operasional toko KreasiKita." };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const [productCount, orderCount, categoryCount, revenue, lowStock, recentOrders] = await Promise.all([
    db.product.count({ where: { isActive: true } }), db.order.count({ where: { archivedAt: null } }), db.category.count({ where: { isActive: true } }),
    db.order.aggregate({ where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED"] }, createdAt: { gte: monthStart } }, _sum: { totalAmount: true } }),
    db.product.findMany({ where: { isActive: true }, include: { category: true, images: { orderBy: { sortOrder: "asc" }, take: 1 } }, orderBy: { stock: "asc" }, take: 3 }),
    db.order.findMany({ where: { archivedAt: null }, include: { items: true }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const cards = [["package", "Total Produk", String(productCount)], ["orders", "Total Pesanan", String(orderCount)], ["tag", "Kategori", String(categoryCount)], ["store", "Penjualan Bulan Ini", formatCurrency(Number(revenue._sum.totalAmount ?? 0))]] as const;
  return <><section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan toko">{cards.map(([icon, label, value], index) => <article key={label} className="admin-card"><span className={`grid h-11 w-11 place-items-center rounded-xl ${index === 1 ? "bg-ink-black text-brand-yellow" : "bg-brand-yellow text-ink-black"}`}><Icon name={icon} /></span><p className="mt-5 text-sm">{label}</p><strong className="font-display text-3xl text-ink-black">{value}</strong></article>)}</section><section className="mt-8 grid gap-6 xl:grid-cols-2"><article className="rounded-2xl bg-white p-6 shadow-sm"><div className="flex justify-between"><h2 className="font-display text-2xl font-bold text-ink-black">Stok Menipis</h2><Link href="/admin/products" className="text-sm font-bold underline decoration-brand-yellow decoration-4">Lihat Produk</Link></div><ul className="mt-4">{lowStock.map((product) => <li key={product.id} className="flex items-center justify-between border-b border-black/8 py-4 last:border-0"><div className="flex items-center gap-3">{product.images[0] && <Image src={product.images[0].url} alt={product.images[0].alt} width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />}<div><p className="font-bold text-ink-black">{product.name}</p><p className="text-xs">{product.category.name}</p></div></div><strong className="text-sm text-status-error">{product.stock - product.reservedStock} tersedia</strong></li>)}</ul></article><article className="rounded-2xl bg-white p-6 shadow-sm"><div className="flex justify-between"><h2 className="font-display text-2xl font-bold text-ink-black">Pesanan Masuk</h2><Link href="/admin/orders" className="text-sm font-bold underline decoration-brand-yellow decoration-4">Lihat Pesanan</Link></div><ul className="mt-4">{recentOrders.map((order) => <li key={order.id} className="flex items-center justify-between border-b border-black/8 py-4 last:border-0"><div><p className="font-bold text-ink-black">{order.id}</p><p className="text-xs">{formatDate(order.createdAt.toISOString())} · {order.items[0]?.productName ?? "Pesanan"}</p></div><StatusBadge status={order.status} /></li>)}</ul></article></section><section className="mt-8 rounded-2xl bg-ink-black p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-yellow">Akses Cepat</p><h2 className="mt-1 font-display text-3xl font-bold">Kelola toko dari satu workspace.</h2><div className="mt-5 flex flex-wrap gap-3"><Link href="/admin/products" className="btn-primary px-5 py-2.5 text-sm">Kelola Produk</Link><Link href="/admin/orders" className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold">Cek Pesanan</Link></div></section></>;
}
