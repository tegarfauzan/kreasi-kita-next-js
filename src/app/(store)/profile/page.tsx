import type { Metadata } from "next";
import { AccountNav } from "@/components/layout/AccountNav";
import { ProfileForm } from "@/components/account/ProfileForm";
import { requireUser } from "@/lib/dal";

export const metadata: Metadata = { title: "Profil Saya", description: "Kelola profil pelanggan KreasiKita." };
export const dynamic = "force-dynamic";
export default async function ProfilePage() { const { user } = await requireUser(); return <><section className="bg-white py-12 sm:py-16"><div className="page-shell"><p className="font-accent text-3xl font-semibold">Ruang personalmu</p><h1 className="font-display text-5xl font-extrabold text-ink-black sm:text-6xl">Profil Saya</h1><p className="mt-4 max-w-2xl leading-7">Kelola identitas dan informasi kontak yang dipakai untuk pengalaman belanja dan pengiriman.</p></div></section><section className="py-12 sm:py-16"><div className="page-shell grid gap-8 lg:grid-cols-[16rem_1fr]"><AccountNav active="profile" /><div className="space-y-6"><ProfileForm profile={user} /></div></div></section></>; }
