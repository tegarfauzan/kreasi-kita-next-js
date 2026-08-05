"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

export function ResetPasswordForm() {
  const router = useRouter(); const searchParams = useSearchParams();
  const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const values = new FormData(event.currentTarget); const password = String(values.get("password") ?? ""); const confirm = String(values.get("confirm") ?? ""); const token = searchParams.get("token");
    if (!token) return setError("Tautan reset tidak valid atau sudah kedaluwarsa.");
    if (password.length < 8) return setError("Password minimal 8 karakter.");
    if (password !== confirm) return setError("Konfirmasi password belum sama.");
    setSubmitting(true); const result = await authClient.resetPassword({ newPassword: password, token });
    if (result.error) { setError(result.error.message ?? "Tautan reset tidak valid atau sudah kedaluwarsa."); setSubmitting(false); return; }
    router.replace("/login?reset=success");
  };
  return <section className="page-shell py-16 sm:py-24"><div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm sm:p-10"><p className="font-accent text-3xl font-semibold">Satu langkah lagi.</p><h1 className="font-display text-5xl font-extrabold text-ink-black">Password Baru</h1><p className="mt-4 leading-7">Gunakan password unik yang tidak dipakai pada layanan lain.</p><form className="mt-8 space-y-5" onSubmit={submit}><div><label className="form-label" htmlFor="new-password">Password baru</label><input id="new-password" name="password" type="password" autoComplete="new-password" className="form-input" required /></div><div><label className="form-label" htmlFor="confirm-password">Konfirmasi password</label><input id="confirm-password" name="confirm" type="password" autoComplete="new-password" className="form-input" required /></div>{error && <p className="form-error" role="alert">{error}</p>}<button disabled={submitting} className="btn-primary w-full disabled:opacity-60">{submitting ? "Menyimpan…" : "Simpan Password Baru"}</button></form><Link href="/login" className="mt-6 inline-block text-sm font-bold underline decoration-brand-yellow">Kembali ke login</Link></div></section>;
}
