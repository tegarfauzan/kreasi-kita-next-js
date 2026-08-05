import type { Metadata } from "next";
import { AdminDatabaseTable } from "@/components/admin/AdminDatabaseTable";
import { db } from "@/lib/db";
export const metadata: Metadata = { title: "Pesanan Admin" }; export const dynamic = "force-dynamic";
export default async function AdminOrdersPage() { const rows = await db.order.findMany({ where: { archivedAt: null }, include: { user: true }, orderBy: { createdAt: "desc" } }); return <AdminDatabaseTable entity="orders" rows={rows.map((row) => ({ id: row.id, customer: row.user.name, date: row.createdAt.toISOString(), total: Number(row.totalAmount), status: row.status }))} />; }
