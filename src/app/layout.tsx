import type { Metadata } from "next";
import { Baloo_2, Caveat, Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider } from "@/components/ui/ToastProvider";
import "./globals.css";

const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo", weight: ["600", "700", "800"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["400", "500", "600", "700"] });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", weight: ["500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "KreasiKita — Karya Lokal Penuh Cerita", template: "%s — KreasiKita" },
  description: "Temukan produk kreatif lokal yang fungsional, personal, dan penuh cerita.",
  robots: process.env.NODE_ENV === "production" ? { index: true, follow: true } : { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${baloo.variable} ${jakarta.variable} ${caveat.variable}`}>
      <body><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
