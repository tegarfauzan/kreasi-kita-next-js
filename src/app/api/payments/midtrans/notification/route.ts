import { NextResponse } from "next/server";
import { apiError, readJson } from "@/lib/api";
import { processMidtransNotification } from "@/lib/orders";

export async function POST(request: Request) {
  try { const result = await processMidtransNotification(await readJson(request)); return NextResponse.json({ success: true, ...result }); }
  catch (error) { return apiError(error); }
}
