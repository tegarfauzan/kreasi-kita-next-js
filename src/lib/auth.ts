import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { env } from "@/env";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]!);
}

export const auth = betterAuth({
  appName: "KreasiKita",
  baseURL: env.NEXT_PUBLIC_APP_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
  database: prismaAdapter(db, { provider: "mysql" }),
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "CUSTOMER", input: false },
      phone: { type: "string", required: false },
      address: { type: "string", required: false },
      city: { type: "string", required: false },
      postalCode: { type: "string", required: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return;
      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: env.EMAIL_FROM,
        to: user.email,
        subject: "Atur ulang password KreasiKita",
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h1>Atur ulang password</h1><p>Halo ${escapeHtml(user.name)},</p><p>Tautan ini hanya dapat digunakan dalam waktu terbatas.</p><p><a href="${escapeHtml(url)}" style="background:#F5A623;color:#1C1C1C;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">Atur password baru</a></p><p>Jika bukan kamu yang meminta, abaikan email ini.</p></div>`,
      });
    },
  },
  rateLimit: { enabled: true, window: 60, max: 100, storage: "database" },
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  advanced: { useSecureCookies: new URL(env.NEXT_PUBLIC_APP_URL).protocol === "https:" },
  plugins: [nextCookies()],
});
