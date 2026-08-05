import type { OrderStatus } from "@/types";
import { Icon } from "../ui/Icon";

const steps = [
  { label: "Pesanan dibuat", description: "Pesanan berhasil masuk ke sistem." },
  { label: "Pembayaran diterima", description: "Pembayaran telah dikonfirmasi." },
  { label: "Sedang dikemas", description: "Kreator sedang menyiapkan pesananmu." },
  { label: "Dalam pengiriman", description: "Paket sedang menuju alamat tujuan." },
  { label: "Pesanan selesai", description: "Paket telah diterima dengan baik." }
];

const progressByStatus: Record<OrderStatus, number> = { PENDING: 0, PAID: 1, PROCESSING: 2, SHIPPED: 3, COMPLETED: 4, FAILED: 0, EXPIRED: 0, CANCELLED: 0 };

export function TrackingTimeline({ status }: { status: OrderStatus }) {
  if (["FAILED", "EXPIRED", "CANCELLED"].includes(status)) return <div className="mt-6 rounded-2xl border border-status-error/25 bg-status-error/5 p-5"><div className="flex gap-3 text-status-error"><Icon name="close" className="h-6 w-6 shrink-0" /><div><h3 className="font-bold">Pesanan tidak dapat diproses</h3><p className="mt-1 text-sm leading-6 text-body-gray">Pembayaran gagal atau telah melewati batas waktu. Silakan lakukan pemesanan ulang.</p></div></div></div>;
  const current = progressByStatus[status];
  return <ol className="mt-7 grid gap-0 sm:grid-cols-5" aria-label="Progres pesanan">{steps.map((step, index) => { const completed = index < current; const active = index === current; return <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0 sm:block sm:pb-0 sm:text-center">{index < steps.length - 1 && <div className={`absolute left-5 top-10 h-[calc(100%-2.5rem)] w-0.5 ${index < current ? "bg-brand-yellow" : "bg-black/10"} sm:left-1/2 sm:top-5 sm:h-0.5 sm:w-full`} aria-hidden="true" />}<span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 font-bold sm:mx-auto ${completed || active ? "border-brand-yellow bg-brand-yellow text-ink-black" : "border-black/15 bg-white text-body-gray"}`}>{completed ? <Icon name="check" className="h-5 w-5" /> : index + 1}</span><div className="pt-1 sm:mt-3 sm:pt-0"><h3 className={`text-sm font-bold ${active ? "text-ink-black" : ""}`}>{step.label}</h3><p className="mt-1 text-xs leading-5 text-body-gray">{step.description}</p></div></li>; })}</ol>;
}
