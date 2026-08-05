import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return <Link href="/" className="group inline-flex items-center gap-2" aria-label="KreasiKita, kembali ke beranda"><span className={`font-display text-2xl font-extrabold tracking-tight ${light ? "text-white" : "text-ink-black"}`}>KreasiKita</span><span className="h-3 w-3 rounded-full bg-brand-yellow transition group-hover:scale-125" aria-hidden="true" /></Link>;
}
