import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/dal";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) { await requireAdmin(); return <AdminShell>{children}</AdminShell>; }
