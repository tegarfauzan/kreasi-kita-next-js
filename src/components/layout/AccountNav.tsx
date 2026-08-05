import Link from "next/link";
import { Icon } from "../ui/Icon";
import { SignOutButton } from "../auth/SignOutButton";

type AccountPage = "orders" | "profile";
const linkClass = (active: boolean) => active ? "flex items-center gap-3 rounded-xl bg-brand-yellow px-4 py-3 font-bold text-ink-black" : "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-white/65 transition hover:bg-white/10 hover:text-white";

export function AccountNav({ active }: { active: AccountPage }) {
  return <aside className="h-fit rounded-2xl bg-ink-black p-5 text-white lg:sticky lg:top-28"><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-yellow">Akun Saya</p><nav className="mt-4 space-y-2" aria-label="Menu akun"><Link href="/orders" className={linkClass(active === "orders")} aria-current={active === "orders" ? "page" : undefined}><Icon name="orders" /> Pesanan</Link><Link href="/profile" className={linkClass(active === "profile")} aria-current={active === "profile" ? "page" : undefined}><Icon name="user" /> Profil</Link><SignOutButton className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-white/65 transition hover:bg-white/10 hover:text-white" /></nav></aside>;
}
