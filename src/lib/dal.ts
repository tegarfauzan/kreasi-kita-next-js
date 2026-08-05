import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { env } from "@/env";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireAdmin() {
  const session = await requireUser();
  if (session.user.role !== "ADMIN") redirect("/");
  return session;
}

export async function requireApiUser(request: Request) {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(env.NEXT_PUBLIC_APP_URL).origin) throw new ApiError(403, "Origin permintaan tidak diizinkan.", "INVALID_ORIGIN");
  }
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new ApiError(401, "Silakan masuk untuk melanjutkan.", "UNAUTHENTICATED");
  return session;
}

export async function requireApiAdmin(request: Request) {
  const session = await requireApiUser(request);
  if (session.user.role !== "ADMIN") throw new ApiError(403, "Akses admin diperlukan.", "FORBIDDEN");
  return session;
}
