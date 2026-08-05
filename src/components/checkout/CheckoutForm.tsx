"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/format";
import { Icon } from "../ui/Icon";
import { useToast } from "../ui/ToastProvider";

interface CheckoutItem { product: Product; initialQuantity: number }
interface CheckoutUser { name: string; email: string; phone: string; address: string; city: string; postalCode: string }

export function CheckoutForm({ items, user }: { items: CheckoutItem[]; user: CheckoutUser }) {
  const [quantities, setQuantities] = useState(() => items.map((item) => item.initialQuantity));
  const [formError, setFormError] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const shipping = 18000;
  const subtotal = items.reduce((sum, item, index) => sum + item.product.price * (quantities[index] ?? 1), 0);
  const changeQuantity = (index: number, delta: number) => setQuantities((current) => current.map((value, itemIndex) => itemIndex === index ? Math.max(1, Math.min(items[index]!.product.stock, value + delta)) : value));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const valid = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[required]")].every((field) => field.value.trim());
    setFormError(!valid);
    if (!valid || submitting) return;
    setSubmitting(true); setServerError("");
    const values = new FormData(form);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((item, index) => ({ productId: item.product.id, quantity: quantities[index] })),
          recipientName: values.get("name"), recipientPhone: values.get("phone"), shippingAddress: values.get("address"),
          shippingCity: values.get("city"), shippingPostalCode: values.get("postal"),
        }),
      });
      const result = await response.json() as { data?: { redirectUrl?: string }; error?: string };
      if (!response.ok || !result.data?.redirectUrl) throw new Error(result.error ?? "Pembayaran belum dapat dibuat.");
      showToast("Pesanan dibuat. Mengarahkan ke pembayaran aman Midtrans…");
      window.location.assign(result.data.redirectUrl);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Terjadi gangguan. Silakan coba lagi.");
      setSubmitting(false);
    }
  };

  return <form className="page-shell grid gap-8 lg:grid-cols-[1fr_25rem]" onSubmit={submit} noValidate>
    <div className="space-y-7">
      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 border-b border-black/10 pb-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-brand-yellow font-display font-bold text-ink-black">1</span><h2 className="font-display text-2xl font-bold text-ink-black">Informasi Pengiriman</h2></div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div><label htmlFor="checkout-name" className="form-label">Nama penerima</label><input id="checkout-name" name="name" className="form-input" autoComplete="name" defaultValue={user.name} required /></div>
          <div><label htmlFor="checkout-phone" className="form-label">Nomor telepon</label><input id="checkout-phone" name="phone" className="form-input" inputMode="tel" autoComplete="tel" defaultValue={user.phone} required /></div>
          <div className="sm:col-span-2"><label htmlFor="checkout-address" className="form-label">Alamat lengkap</label><textarea id="checkout-address" name="address" className="form-input min-h-28 resize-y" autoComplete="street-address" defaultValue={user.address} required /></div>
          <div><label htmlFor="checkout-city" className="form-label">Kota</label><input id="checkout-city" name="city" className="form-input" autoComplete="address-level2" defaultValue={user.city} required /></div>
          <div><label htmlFor="checkout-postal" className="form-label">Kode pos</label><input id="checkout-postal" name="postal" className="form-input" inputMode="numeric" autoComplete="postal-code" defaultValue={user.postalCode} required /></div>
        </div>
        {formError && <p className="form-error mt-5">Lengkapi seluruh informasi pengiriman sebelum melanjutkan.</p>}
        {serverError && <p className="form-error mt-5" role="alert">{serverError}</p>}
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 border-b border-black/10 pb-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-brand-yellow font-display font-bold text-ink-black">2</span><h2 className="font-display text-2xl font-bold text-ink-black">Item Pesanan</h2></div>
        {items.map(({ product }, index) => <article key={product.id} className="flex gap-4 border-b border-black/10 py-5 last:border-0"><Image src={product.imageUrl} alt={product.imageAlt} width={120} height={120} quality={80} className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28" /><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[0.14em]">{product.category}</p><h3 className="font-display text-xl font-bold text-ink-black">{product.name}</h3><p className="mt-1 font-bold text-ink-black">{formatCurrency(product.price)}</p><div className="mt-3 inline-flex items-center rounded-full border border-black/20"><button type="button" className="grid h-9 w-9 place-items-center font-bold" onClick={() => changeQuantity(index, -1)} aria-label={`Kurangi ${product.name}`}>−</button><input className="h-9 w-10 bg-transparent text-center text-sm font-bold outline-none" value={quantities[index]} readOnly aria-label={`Jumlah ${product.name}`} /><button type="button" className="grid h-9 w-9 place-items-center font-bold" onClick={() => changeQuantity(index, 1)} aria-label={`Tambah ${product.name}`}>+</button></div></div><p className="shrink-0 font-bold text-ink-black">{formatCurrency(product.price * (quantities[index] ?? 1))}</p></article>)}
      </div>
    </div>
    <aside className="h-fit rounded-2xl bg-ink-black p-6 text-white shadow-xl lg:sticky lg:top-28"><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-yellow">Ringkasan</p><h2 className="mt-1 font-display text-3xl font-bold">Total Pesanan</h2><div className="mt-6 space-y-4 text-sm"><div className="flex justify-between text-white/65"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div><div className="flex justify-between text-white/65"><span>Pengiriman</span><span>{formatCurrency(shipping)}</span></div><div className="border-t border-white/15 pt-4"><div className="flex items-end justify-between gap-4"><span className="font-bold">Total</span><strong className="font-display text-3xl text-brand-yellow">{formatCurrency(subtotal + shipping)}</strong></div></div></div><button type="submit" disabled={submitting} className="btn-primary mt-7 w-full ring hover:ring-brand-yellow disabled:cursor-wait disabled:opacity-60">{submitting ? "Memproses…" : "Bayar Sekarang"} <Icon name="arrow" /></button><div className="mt-5 flex items-start gap-2 text-xs leading-5 text-white/55"><Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow" /> Harga dan stok diverifikasi kembali oleh server sebelum transaksi Midtrans dibuat.</div></aside>
  </form>;
}
