import { NextResponse } from "next/server";
import { apiError, readJson } from "@/lib/api";
import { requireApiAdmin } from "@/lib/dal";
import { db } from "@/lib/db";
import { settingsSchema } from "@/lib/validators";

export async function GET(request: Request) { try { await requireApiAdmin(request); return NextResponse.json({ data: await db.storeSetting.findUnique({ where: { id: "default" } }) }); } catch (error) { return apiError(error); } }
export async function PUT(request: Request) { try { await requireApiAdmin(request); const data = settingsSchema.parse(await readJson(request)); const settings = await db.storeSetting.upsert({ where: { id: "default" }, create: { id: "default", ...data, phone: data.phone || null, address: data.address || null }, update: { ...data, phone: data.phone || null, address: data.address || null } }); return NextResponse.json({ data: settings }); } catch (error) { return apiError(error); } }
