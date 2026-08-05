import { PublicHeader } from "@/components/layout/PublicHeader";
import { getSession } from "@/lib/dal";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const accountRole = session?.user.role === "ADMIN" ? "ADMIN" : session ? "CUSTOMER" : null;
  return <><a href="#main-content" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-ink-black px-5 py-3 font-bold text-white transition focus:translate-y-0">Lewati ke konten utama</a><PublicHeader showSearch={false} accountRole={accountRole} /><main id="main-content">{children}</main></>;
}
