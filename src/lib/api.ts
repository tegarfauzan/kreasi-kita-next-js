import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(public status: number, message: string, public code = "REQUEST_FAILED") {
    super(message);
  }
}

export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Data yang dikirim belum valid.", code: "VALIDATION_ERROR", fields: error.flatten().fieldErrors }, { status: 422 });
  }
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  }
  console.error("Unhandled API error", error instanceof Error ? error.message : "Unknown error");
  return NextResponse.json({ error: "Terjadi gangguan pada server.", code: "INTERNAL_ERROR" }, { status: 500 });
}

export async function readJson(request: Request): Promise<unknown> {
  try { return await request.json(); }
  catch { throw new ApiError(400, "Body JSON tidak valid.", "INVALID_JSON"); }
}
