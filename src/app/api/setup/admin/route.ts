import { hashPassword } from "better-auth/crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/env";
import { ApiError, apiError, readJson } from "@/lib/api";
import { db } from "@/lib/db";
import { matchesBearerToken } from "@/lib/secure-token";

export const dynamic = "force-dynamic";

const bootstrapSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(128),
});

const RATE_LIMIT_KEY = "setup:admin";
const RATE_LIMIT_WINDOW_MS = BigInt(15 * 60 * 1000);
const RATE_LIMIT_MAX_ATTEMPTS = 5;

async function consumeAttempt() {
  const now = BigInt(Date.now());

  return db.$transaction(async (tx) => {
    const current = await tx.rateLimit.findUnique({ where: { key: RATE_LIMIT_KEY } });
    const expired = !current || now - current.lastRequest >= RATE_LIMIT_WINDOW_MS;

    if (current && !expired && current.count >= RATE_LIMIT_MAX_ATTEMPTS) return false;

    await tx.rateLimit.upsert({
      where: { key: RATE_LIMIT_KEY },
      create: { key: RATE_LIMIT_KEY, count: 1, lastRequest: now },
      update: expired ? { count: 1, lastRequest: now } : { count: { increment: 1 }, lastRequest: now },
    });

    return true;
  });
}

export async function POST(request: Request) {
  try {
    if (!env.ADMIN_BOOTSTRAP_ENABLED || !env.ADMIN_BOOTSTRAP_TOKEN) {
      throw new ApiError(404, "Route tidak ditemukan.", "NOT_FOUND");
    }

    if (!(await consumeAttempt())) {
      throw new ApiError(429, "Terlalu banyak percobaan. Coba kembali beberapa saat lagi.", "RATE_LIMITED");
    }

    if (!matchesBearerToken(request.headers.get("authorization"), env.ADMIN_BOOTSTRAP_TOKEN)) {
      throw new ApiError(404, "Route tidak ditemukan.", "NOT_FOUND");
    }

    const payload = bootstrapSchema.parse(await readJson(request));
    const passwordHash = await hashPassword(payload.password);

    await db.$transaction(async (tx) => {
      const existingAdmin = await tx.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
      if (existingAdmin) throw new ApiError(409, "Admin awal sudah tersedia.", "ADMIN_EXISTS");

      const existingEmail = await tx.user.findUnique({ where: { email: payload.email }, select: { id: true } });
      if (existingEmail) throw new ApiError(409, "Email tidak dapat digunakan.", "EMAIL_UNAVAILABLE");

      const user = await tx.user.create({
        data: { name: payload.name, email: payload.email, emailVerified: true, role: "ADMIN" },
        select: { id: true },
      });

      await tx.account.create({
        data: {
          providerId: "credential",
          accountId: user.id,
          userId: user.id,
          password: passwordHash,
        },
      });
    });

    return NextResponse.json(
      { data: { created: true }, message: "Admin awal berhasil dibuat. Nonaktifkan bootstrap sekarang." },
      { status: 201, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
