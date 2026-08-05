import { NextResponse } from "next/server";
import { apiError, readJson } from "@/lib/api";
import { requireApiUser } from "@/lib/dal";
import { db } from "@/lib/db";
import { createOrder, toOrderDto } from "@/lib/orders";

export async function GET(request: Request) {
  try { const session = await requireApiUser(request); const rows = await db.order.findMany({ where: { archivedAt: null, ...(session.user.role === "ADMIN" ? {} : { userId: session.user.id }) }, include: { items: true, payment: true }, orderBy: { createdAt: "desc" } }); return NextResponse.json({ data: rows.map(toOrderDto) }); }
  catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try { const session = await requireApiUser(request); const order = await createOrder(session.user, await readJson(request)); return NextResponse.json({ data: order }, { status: 201 }); }
  catch (error) { return apiError(error); }
}
