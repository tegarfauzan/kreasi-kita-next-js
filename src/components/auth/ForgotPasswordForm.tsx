"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { Icon } from "../ui/Icon";
import { useToast } from "../ui/ToastProvider";

export function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Masukkan alamat email yang valid.");
    setError(""); setSubmitting(true);
    await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    setSubmitting(false);
    showToast("Jika email terdaftar, instruksi reset akan dikirim.");
  };
  return <section className="min-h-[calc(100vh-5rem)] bg-white"><div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2"><div className="flex items-center px-5 py-12 sm:px-10 lg:px-16 xl:px-24"><div className="mx-auto w-full max-w-lg"><Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-ink-black hover:underline"><Icon name="chevron" className="h-4 w-4 rotate-180" /> Kembali ke login</Link><p className="font-accent text-3xl font-semibold">Tenang, kita bantu.</p><h1 className="font-display text-5xl font-extrabold leading-none text-ink-black sm:text-6xl">Lupa Password?</h1><p className="mt-4 leading-7">Masukkan email akunmu. Kami akan mengirim tautan reset yang aman dan memiliki masa berlaku terbatas.</p><form className="mt-9 space-y-5" onSubmit={submit} noValidate><div><label htmlFor="forgot-email" className="form-label">Email</label><div className="relative"><input id="forgot-email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" className="form-input pl-11" aria-describedby="forgot-email-error" required /><Icon name="user" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-body-gray" /></div>{error && <p id="forgot-email-error" className="form-error">{error}</p>}</div><button type="submit" disabled={submitting} className="btn-primary w-full disabled:cursor-wait disabled:opacity-60">{submitting ? "Mengirim…" : "Kirim Tautan Reset"} <Icon name="arrow" /></button></form><div className="mt-8 rounded-xl border border-black/10 bg-canvas-gray/60 p-4 text-xs leading-5"><strong className="text-ink-black">Prinsip keamanan:</strong> respons tidak mengungkap apakah sebuah email terdaftar. Tautan bersifat sekali pakai dan kedaluwarsa.</div></div></div><aside className="relative hidden overflow-hidden bg-brand-yellow p-12 lg:flex lg:items-center lg:justify-center" aria-label="Panel pemulihan akun"><div className="relative max-w-md text-center"><div className="mx-auto grid h-52 w-52 place-items-center rounded-[3rem] border-[10px] border-ink-black bg-white shadow-[18px_18px_0_#1c1c1c]"><Icon name="shield" className="h-24 w-24 text-ink-black" /></div><p className="mt-12 font-accent text-4xl font-semibold text-ink-black">Akses kembali, tanpa panik.</p></div></aside></div></section>;
}
