import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Atur Ulang Password", description: "Buat password baru untuk akun KreasiKita." };
export default function ResetPasswordPage() { return <Suspense><ResetPasswordForm /></Suspense>; }
