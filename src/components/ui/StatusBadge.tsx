import type { OrderStatus } from "@/types";

const statusClasses: Record<OrderStatus, string> = {
  PENDING: "bg-status-pending text-ink-black",
  PAID: "bg-brand-yellow text-ink-black",
  PROCESSING: "bg-status-info text-white",
  SHIPPED: "bg-status-info text-white",
  COMPLETED: "bg-status-success text-white",
  FAILED: "bg-status-error text-white",
  EXPIRED: "bg-body-gray text-white",
  CANCELLED: "bg-status-error text-white"
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  PROCESSING: "Sedang Diproses",
  SHIPPED: "Sedang Dikirim",
  COMPLETED: "Selesai",
  FAILED: "Gagal",
  EXPIRED: "Kedaluwarsa",
  CANCELLED: "Dibatalkan"
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClasses[status]}`}>{statusLabels[status]}</span>;
}
