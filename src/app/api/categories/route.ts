import { NextResponse } from "next/server";
import slugify from "slugify";
import { db } from "@/lib/db";
import { apiError, readJson } from "@/lib/api";
import { requireApiAdmin } from "@/lib/dal";
import { categorySchema } from "@/lib/validators";

export async function GET() { return NextResponse.json({ data: await db.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }) }); }
export async function POST(request: Request) { try { await requireApiAdmin(request); const data = categorySchema.parse(await readJson(request)); const row = await db.category.create({ data: { ...data, slug: slugify(data.name, { lower: true, strict: true, locale: "id" }) } }); return NextResponse.json({ data: row }, { status: 201 }); } catch (error) { return apiError(error); } }
