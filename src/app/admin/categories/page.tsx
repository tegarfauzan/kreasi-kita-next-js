import type { Metadata } from "next";
import { AdminDatabaseTable } from "@/components/admin/AdminDatabaseTable";
import { db } from "@/lib/db";
export const metadata: Metadata = { title: "Kategori Admin" }; export const dynamic = "force-dynamic";
export default async function AdminCategoriesPage() { const rows = await db.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { createdAt: "desc" } }); return <AdminDatabaseTable entity="categories" rows={rows.map((row) => ({ id: row.id, name: row.name, slug: row.slug, isActive: row.isActive, productCount: row._count.products, createdAt: row.createdAt.toISOString() }))} />; }
