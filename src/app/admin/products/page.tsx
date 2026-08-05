import type { Metadata } from "next";
import { AdminDatabaseTable } from "@/components/admin/AdminDatabaseTable";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Produk Admin" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [rows, categories] = await Promise.all([
    db.product.findMany({ include: { category: true, images: { orderBy: { sortOrder: "asc" } } }, orderBy: { createdAt: "desc" } }),
    db.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return <AdminDatabaseTable entity="products" categories={categories} rows={rows.map((row) => ({
    id: row.id, name: row.name, slug: row.slug, category: row.category.name, categoryId: row.categoryId, description: row.description,
    price: Number(row.price), stock: row.stock, badge: row.badge ?? "", keywords: Array.isArray(row.keywords) ? row.keywords.filter((value): value is string => typeof value === "string") : [],
    featured: row.featured, isActive: row.isActive, imageUrl: row.images[0]?.url ?? "", imageAlt: row.images[0]?.alt ?? row.name,
    images: row.images.map((image) => ({ url: image.url, alt: image.alt, publicId: image.publicId ?? undefined, photographer: image.photographer ?? undefined, photoPage: image.photoPage ?? undefined })),
  }))} />;
}
