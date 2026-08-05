import { NextResponse } from "next/server";
import { ApiError, apiError, readJson } from "@/lib/api";
import { requireApiAdmin } from "@/lib/dal";
import { db } from "@/lib/db";
import { orderStatusSchema } from "@/lib/validators";

const allowed: Record<string, string[]> = { PAID: ["PROCESSING"], PROCESSING: ["SHIPPED"], SHIPPED: ["COMPLETED"] };
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireApiAdmin(request); const { id } = await params; const { status } = orderStatusSchema.parse(await readJson(request)); const current = await db.order.findUnique({ where: { id } }); if (!current) throw new ApiError(404, "Pesanan tidak ditemukan.", "ORDER_NOT_FOUND"); if (!allowed[current.status]?.includes(status)) throw new ApiError(409, `Status ${current.status} tidak dapat diubah menjadi ${status}.`, "INVALID_STATUS_TRANSITION"); const order = await db.order.update({ where: { id }, data: { status } }); return NextResponse.json({ data: order }); }
  catch (error) { return apiError(error); }
}
