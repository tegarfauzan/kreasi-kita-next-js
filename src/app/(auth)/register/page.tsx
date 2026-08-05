import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Daftar", description: "Buat akun pelanggan KreasiKita." };
export default function RegisterPage() { return <Suspense><AuthForm mode="register" /></Suspense>; }
