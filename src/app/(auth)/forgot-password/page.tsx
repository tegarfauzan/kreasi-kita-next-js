import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Lupa Password", description: "Pulihkan akses akun KreasiKita." };
export default function ForgotPasswordPage() { return <ForgotPasswordForm />; }
