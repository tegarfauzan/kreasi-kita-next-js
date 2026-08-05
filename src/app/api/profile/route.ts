import { NextResponse } from "next/server";
import { apiError, readJson } from "@/lib/api";
import { requireApiUser } from "@/lib/dal";
import { db } from "@/lib/db";
import { profileSchema } from "@/lib/validators";

export async function PUT(request: Request) { try { const session = await requireApiUser(request); const data = profileSchema.parse(await readJson(request)); const user = await db.user.update({ where: { id: session.user.id }, data: { ...data, phone: data.phone || null, address: data.address || null, city: data.city || null, postalCode: data.postalCode || null }, select: { id: true, name: true, email: true, phone: true, address: true, city: true, postalCode: true } }); return NextResponse.json({ data: user }); } catch (error) { return apiError(error); } }
