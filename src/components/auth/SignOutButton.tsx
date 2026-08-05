"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Icon } from "../ui/Icon";

export function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  return <button type="button" className={className} onClick={async () => { await authClient.signOut(); router.replace("/login"); router.refresh(); }}><Icon name="logout" /> Keluar</button>;
}
