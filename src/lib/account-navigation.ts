export type AccountRole = "ADMIN" | "CUSTOMER" | null;

export function getAccountNavigation(role: AccountRole) {
  if (role === "ADMIN") return { href: "/admin/profile" as const, label: "Buka profil admin", text: "Profil Admin" };
  if (role === "CUSTOMER") return { href: "/profile" as const, label: "Buka profil", text: "Profil" };
  return { href: "/login" as const, label: "Masuk ke akun", text: "Masuk" };
}
