import { NextResponse } from "next/server";
import slugify from "slugify";
import { db } from "@/lib/db";
import { ApiError, apiError, readJson } from "@/lib/api";
import { requireApiAdmin } from "@/lib/dal";
import { categorySchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, { params }: Context) { try { await requireApiAdmin(request); const { id } = await params; const data = categorySchema.parse(await readJson(request)); return NextResponse.json({ data: await db.category.update({ where: { id }, data: { ...data, slug: slugify(data.name, { lower: true, strict: true, locale: "id" }) } }) }); } catch (error) { return apiError(error); } }
export async function DELETE(request: Request, { params }: Context) { try { await requireApiAdmin(request); const { id } = await params; if (await db.product.count({ where: { categoryId: id } })) throw new ApiError(409, "Kategori masih digunakan produk dan tidak dapat dihapus.", "CATEGORY_IN_USE"); await db.category.delete({ where: { id } }); return NextResponse.json({ success: true }); } catch (error) { return apiError(error); } }
