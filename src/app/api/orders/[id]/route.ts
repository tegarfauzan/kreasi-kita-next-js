import { NextResponse } from "next/server";
import { ApiError, apiError } from "@/lib/api";
import { requireApiAdmin, requireApiUser } from "@/lib/dal";
import { db } from "@/lib/db";
import { toOrderDto } from "@/lib/orders";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const session = await requireApiUser(request); const { id } = await params; const order = await db.order.findFirst({ where: { id, ...(session.user.role === "ADMIN" ? {} : { userId: session.user.id }) }, include: { items: true, payment: true } }); if (!order) throw new ApiError(404, "Pesanan tidak ditemukan.", "ORDER_NOT_FOUND"); return NextResponse.json({ data: toOrderDto(order) }); }
  catch (error) { return apiError(error); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireApiAdmin(request); const { id } = await params; await db.order.update({ where: { id }, data: { archivedAt: new Date() } }); return NextResponse.json({ success: true }); }
  catch (error) { return apiError(error); }
}
