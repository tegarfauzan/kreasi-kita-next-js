import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { ApiError, apiError } from "@/lib/api";
import { requireApiAdmin } from "@/lib/dal";
import { env } from "@/env";

export async function POST(request: Request) {
  try {
    await requireApiAdmin(request);
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) throw new ApiError(503, "Upload gambar belum dikonfigurasi.", "UPLOAD_NOT_CONFIGURED");
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "kreasikita/products";
    const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, env.CLOUDINARY_API_SECRET);
    return NextResponse.json({ data: { timestamp, folder, signature, cloudName: env.CLOUDINARY_CLOUD_NAME, apiKey: env.CLOUDINARY_API_KEY } });
  } catch (error) { return apiError(error); }
}
