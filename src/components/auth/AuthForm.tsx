"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { Icon } from "../ui/Icon";

type AuthMode = "login" | "register";
type Errors = Partial<Record<"name" | "email" | "password" | "confirmPassword" | "terms" | "server", string>>;

function PasswordField({ id, label, autoComplete, error }: { id: string; label: string; autoComplete: string; error?: string }) {
  const [visible, setVisible] = useState(false);
  return <div><label htmlFor={id} className="form-label">{label}</label><div className="relative"><input id={id} name={id} type={visible ? "text" : "password"} autoComplete={autoComplete} placeholder="Minimal 8 karakter" className="form-input pr-12" aria-describedby={`${id}-error`} required /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-body-gray hover:bg-canvas-gray" onClick={() => setVisible((value) => !value)} aria-label={visible ? `Sembunyikan ${label.toLocaleLowerCase("id-ID")}` : `Tampilkan ${label.toLocaleLowerCase("id-ID")}`}><Icon name={visible ? "eyeOff" : "eye"} /></button></div>{error && <p id={`${id}-error`} className="form-error">{error}</p>}</div>;
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const register = mode === "register";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const nextErrors: Errors = {};
    const name = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const password = String(values.get("password") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Masukkan alamat email yang valid.";
    if (password.length < 8) nextErrors.password = "Password minimal 8 karakter.";
    if (register) {
      if (name.length < 2) nextErrors.name = "Nama minimal 2 karakter.";
      if (String(values.get("confirmPassword") ?? "") !== password) nextErrors.confirmPassword = "Konfirmasi password belum sama.";
      if (values.get("terms") !== "on") nextErrors.terms = "Persetujuan diperlukan untuk melanjutkan.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    const result = register
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password, rememberMe: values.get("rememberMe") === "on" });
    if (result.error) { setErrors({ server: result.error.message ?? "Autentikasi gagal. Silakan periksa kembali data akun." }); setSubmitting(false); return; }
    const requested = searchParams.get("callbackURL");
    const callbackURL = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/";
    router.replace(callbackURL); router.refresh();
  };

  return <section className="min-h-[calc(100vh-5rem)] bg-white"><div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
    <div className="flex items-center px-5 py-12 sm:px-10 lg:px-16 xl:px-24"><div className="mx-auto w-full max-w-lg">
      <p className="font-accent text-3xl font-semibold">{register ? "Senang akhirnya bertemu!" : "Selamat datang kembali."}</p>
      <h1 className="font-display text-5xl font-extrabold leading-none text-ink-black sm:text-6xl">{register ? "Buat Akun" : "Masuk"}</h1>
      <p className="mt-4 leading-7">{register ? "Simpan karya pilihanmu dan ikuti perjalanan pesanannya." : "Lanjutkan menemukan karya yang terasa personal."}</p>
      <form className="mt-9 space-y-5" onSubmit={submit} noValidate>
        {register && <div><label htmlFor="name" className="form-label">Nama lengkap</label><input id="name" name="name" type="text" autoComplete="name" placeholder="Nama kamu" className="form-input" aria-describedby="name-error" />{errors.name && <p id="name-error" className="form-error">{errors.name}</p>}</div>}
        <div><label htmlFor="email" className="form-label">Email</label><input id="email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" className="form-input" aria-describedby="email-error" />{errors.email && <p id="email-error" className="form-error">{errors.email}</p>}</div>
        <PasswordField id="password" label="Password" autoComplete={register ? "new-password" : "current-password"} error={errors.password} />
        {register && <PasswordField id="confirmPassword" label="Konfirmasi password" autoComplete="new-password" error={errors.confirmPassword} />}
        {register ? <><label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" name="terms" className="mt-1 h-4 w-4 accent-brand-yellow" /><span>Saya menyetujui syarat penggunaan KreasiKita.</span></label>{errors.terms && <p className="form-error">{errors.terms}</p>}</> : <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" name="rememberMe" className="h-4 w-4 accent-brand-yellow" /> Ingat saya</label><Link href="/forgot-password" className="font-bold text-ink-black underline decoration-brand-yellow">Lupa Password?</Link></div>}
        {errors.server && <p className="form-error rounded-xl bg-status-error/5 p-3" role="alert">{errors.server}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:cursor-wait disabled:opacity-60">{submitting ? "Memproses…" : register ? "Daftar Sekarang" : "Masuk ke Akun"} <Icon name="arrow" /></button>
      </form>
      <p className="mt-7 text-center text-sm">{register ? "Sudah punya akun?" : "Belum punya akun?"} <Link href={register ? "/login" : "/register"} className="font-bold text-ink-black underline decoration-brand-yellow decoration-4 underline-offset-4">{register ? "Masuk" : "Daftar"}</Link></p>
      <div className="mt-8 rounded-xl border border-black/10 bg-canvas-gray/60 p-4 text-xs leading-5"><strong className="text-ink-black">Keamanan akun:</strong> password di-hash, session disimpan aman di database, dan percobaan autentikasi dibatasi.</div>
    </div></div>
    <aside className="relative hidden overflow-hidden bg-brand-yellow p-12 lg:flex lg:items-center lg:justify-center" aria-label="Panel visual KreasiKita"><span className="absolute right-8 top-8 font-display text-9xl font-extrabold text-transparent opacity-25 [-webkit-text-stroke:2px_#1c1c1c]" aria-hidden="true">{register ? "04" : "03"}</span><div className="relative max-w-md text-center"><div className="mx-auto grid h-52 w-52 place-items-center rounded-[3rem] border-[10px] border-ink-black bg-white shadow-[18px_18px_0_#1c1c1c]"><Icon name={register ? "star" : "shield"} className="h-24 w-24 text-ink-black" /></div><p className="mt-12 font-accent text-4xl font-semibold text-ink-black">{register ? "Satu akun, banyak cerita." : "Kembali ke karya yang kamu suka."}</p><p className="mt-4 leading-7 text-ink-black/70">Akunmu melindungi profil dan riwayat pesanan pribadi.</p></div></aside>
  </div></section>;
}
