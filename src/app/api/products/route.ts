import { NextResponse } from "next/server";
import slugify from "slugify";
import { db } from "@/lib/db";
import { apiError, readJson } from "@/lib/api";
import { requireApiAdmin } from "@/lib/dal";
import { listProducts } from "@/lib/products";
import { productSchema } from "@/lib/validators";

export async function GET() { return NextResponse.json({ data: await listProducts() }); }

export async function POST(request: Request) {
  try {
    await requireApiAdmin(request);
    const data = productSchema.parse(await readJson(request));
    const slug = slugify(data.name, { lower: true, strict: true, locale: "id" });
    const product = await db.product.create({ data: { ...data, slug, badge: data.badge || null, keywords: data.keywords, images: { create: data.images.map((image, sortOrder) => ({ ...image, sortOrder })) } } });
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) { return apiError(error); }
}
