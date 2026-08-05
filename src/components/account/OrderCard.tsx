import Image from "next/image";
import Link from "next/link";
import type { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { Icon } from "../ui/Icon";
import { StatusBadge } from "../ui/StatusBadge";

export function OrderCard({ order }: { order: Order }) {
  const total = order.totalAmount ?? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <article className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em]">{formatDate(order.date)}</p><h2 className="mt-1 font-display text-2xl font-bold text-ink-black">{order.id}</h2></div><StatusBadge status={order.status} /></div><div className="mt-5 space-y-4">{order.items.map((item) => <div key={item.productId} className="flex items-center gap-4">{item.productImageUrl ? <Image src={item.productImageUrl} alt={item.productName ?? "Produk KreasiKita"} width={72} height={72} quality={80} className="h-16 w-16 rounded-xl object-cover" /> : <span className="h-16 w-16 rounded-xl bg-canvas-gray" />}<div className="min-w-0 flex-1"><h3 className="font-bold text-ink-black">{item.productName ?? "Produk KreasiKita"}</h3><p className="text-sm">{item.quantity} × {formatCurrency(item.price)}</p></div><strong className="text-sm text-ink-black">{formatCurrency(item.price * item.quantity)}</strong></div>)}</div><div className="mt-5 flex flex-col gap-4 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p>Total <strong className="ml-2 text-lg text-ink-black">{formatCurrency(total)}</strong></p><Link href={`/orders/${encodeURIComponent(order.id)}`} className="btn-secondary px-4 py-2 text-sm" aria-label={`Lihat detail pesanan ${order.id}`}>Lihat Detail <Icon name="chevron" className="h-4 w-4" /></Link></div></article>;
}
