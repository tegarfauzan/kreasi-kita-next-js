import type { Metadata } from "next";
import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";
import { db } from "@/lib/db";
export const metadata: Metadata = { title: "Settings Admin" }; export const dynamic = "force-dynamic";
export default async function AdminSettingsPage() { const row = await db.storeSetting.findUniqueOrThrow({ where: { id: "default" } }); const settings = { storeName: row.storeName, email: row.email, phone: row.phone, address: row.address, shippingCost: Number(row.shippingCost) }; return <div className="mx-auto max-w-5xl"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.16em]">Konfigurasi</p><h2 className="font-display text-4xl font-extrabold text-ink-black">Pengaturan Toko</h2><p className="mt-2 max-w-2xl leading-7">Kelola informasi dasar yang digunakan storefront dan proses checkout.</p></div><AdminSettingsForm settings={settings} /></div>; }
