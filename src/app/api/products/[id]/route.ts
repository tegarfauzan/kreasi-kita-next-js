import { NextResponse } from "next/server";
import slugify from "slugify";
import { db } from "@/lib/db";
import { apiError, readJson } from "@/lib/api";
import { requireApiAdmin } from "@/lib/dal";
import { productSchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, { params }: Context) {
  try { await requireApiAdmin(request); const { id } = await params; const data = productSchema.parse(await readJson(request)); const slug = slugify(data.name, { lower: true, strict: true, locale: "id" }); const product = await db.$transaction(async (tx) => { await tx.productImage.deleteMany({ where: { productId: id } }); return tx.product.update({ where: { id }, data: { ...data, slug, badge: data.badge || null, keywords: data.keywords, images: { create: data.images.map((image, sortOrder) => ({ ...image, sortOrder })) } } }); }); return NextResponse.json({ data: product }); }
  catch (error) { return apiError(error); }
}
export async function DELETE(request: Request, { params }: Context) {
  try { await requireApiAdmin(request); const { id } = await params; const used = await db.orderItem.count({ where: { productId: id } }); if (used) await db.product.update({ where: { id }, data: { isActive: false } }); else await db.product.delete({ where: { id } }); return NextResponse.json({ success: true }); }
  catch (error) { return apiError(error); }
}
