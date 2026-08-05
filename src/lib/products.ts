import "server-only";
import { db } from "@/lib/db";
import type { Product } from "@/types";

const productInclude = { category: true, images: { orderBy: { sortOrder: "asc" as const } } };

export function toProductDto(product: Awaited<ReturnType<typeof db.product.findFirstOrThrow>> & { category?: { name: string }; images?: Array<{ url: string; alt: string; photographer: string | null; photoPage: string | null }> }): Product {
  const image = product.images?.[0];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: (product.category?.name ?? "Alat Tulis") as Product["category"],
    price: Number(product.price),
    stock: Math.max(0, product.stock - product.reservedStock),
    badge: product.badge ?? undefined,
    description: product.description,
    keywords: Array.isArray(product.keywords) ? product.keywords.filter((value): value is string => typeof value === "string") : [],
    imageUrl: image?.url ?? "",
    imageAlt: image?.alt ?? product.name,
    photographer: image?.photographer ?? "KreasiKita",
    photoPage: image?.photoPage ?? "https://unsplash.com",
    featured: product.featured,
  };
}

export async function listProducts(options: { includeInactive?: boolean; featured?: boolean } = {}) {
  const rows = await db.product.findMany({
    where: { ...(options.includeInactive ? {} : { isActive: true }), ...(options.featured === undefined ? {} : { featured: options.featured }) },
    include: productInclude,
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });
  return rows.map(toProductDto);
}

export async function getProductBySlug(slug: string) {
  const row = await db.product.findFirst({ where: { slug, isActive: true }, include: productInclude });
  return row ? toProductDto(row) : null;
}
