"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "../layout/Logo";
import { Icon, type IconName } from "../ui/Icon";
import { SignOutButton } from "../auth/SignOutButton";

const navigation: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/products", label: "Produk", icon: "package" },
  { href: "/admin/categories", label: "Kategori", icon: "tag" },
  { href: "/admin/orders", label: "Pesanan", icon: "orders" },
  { href: "/admin/settings", label: "Settings", icon: "settings" }
];

const titles: Record<string, string> = { "/admin": "Dashboard", "/admin/products": "Produk", "/admin/categories": "Kategori", "/admin/orders": "Pesanan", "/admin/profile": "Profil Admin", "/admin/settings": "Settings" };

export function AdminShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [desktop, setDesktop] = useState(false);
  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)");
    const sync = () => setDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  const sidebarExpanded = desktop ? !collapsed : mobileOpen;

  return <div className="admin-layout min-h-screen bg-canvas-gray" data-sidebar-collapsed={desktop && collapsed}>
    <button type="button" className={`${mobileOpen ? "block" : "hidden"} fixed inset-0 z-40 bg-black/60 lg:hidden`} onClick={() => setMobileOpen(false)} aria-label="Tutup sidebar" />
    <aside id="admin-sidebar" aria-hidden={!desktop && !mobileOpen} className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-ink-black p-6 transition lg:sticky lg:top-0 lg:h-screen lg:w-auto ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
      <div className="flex items-center justify-between"><Logo light /><button type="button" className="rounded-full p-2 text-white lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Tutup sidebar"><Icon name="close" /></button></div>
      <nav className="mt-10 space-y-2" aria-label="Navigasi admin">{navigation.map((item) => { const active = pathname === item.href; return <Link key={item.href} href={item.href} className={`admin-nav-link ${active ? "admin-nav-active" : ""}`} aria-current={active ? "page" : undefined}><Icon name={item.icon} /> {item.label}</Link>; })}</nav>
      <div className="mt-auto border-t border-white/15 pt-5"><Link href="/admin/profile" className={`flex items-center gap-3 rounded-xl p-2 transition ${pathname === "/admin/profile" ? "bg-brand-yellow text-ink-black" : "hover:bg-white/10"}`} aria-current={pathname === "/admin/profile" ? "page" : undefined} aria-label="Buka profil Admin Demo"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-display font-bold ${pathname === "/admin/profile" ? "bg-ink-black text-brand-yellow" : "bg-brand-yellow text-ink-black"}`}>AD</span><div className="min-w-0"><p className={`truncate font-bold ${pathname === "/admin/profile" ? "text-ink-black" : "text-white"}`}>Admin Demo</p><p className={`truncate text-xs ${pathname === "/admin/profile" ? "text-ink-black/65" : "text-white/50"}`}>admin@kreasikita.id</p></div><Icon name="chevron" className="ml-auto h-4 w-4 shrink-0" /></Link><SignOutButton className="mt-4 flex items-center gap-2 px-2 text-sm font-semibold text-white/60 hover:text-white" /></div>
    </aside>
    <div className="min-w-0"><header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-black/10 bg-white/95 px-5 backdrop-blur sm:px-8"><div className="flex items-center gap-3"><button type="button" className="rounded-full border-2 border-ink-black p-2" onClick={() => desktop ? setCollapsed((value) => !value) : setMobileOpen((value) => !value)} aria-controls="admin-sidebar" aria-expanded={sidebarExpanded} aria-label={sidebarExpanded ? "Tutup sidebar" : "Buka sidebar"}><Icon name="menu" /></button><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-body-gray">Admin Workspace</p><h1 className="font-display text-2xl font-extrabold text-ink-black">{titles[pathname ?? "/admin"] ?? "Admin"}</h1></div></div><Link href="/" className="hidden rounded-full border-2 border-ink-black px-4 py-2 text-sm font-bold text-ink-black transition hover:bg-ink-black hover:text-white sm:inline-flex">Lihat Toko</Link></header><main className="p-5 sm:p-8">{children}</main></div>
  </div>;
}
