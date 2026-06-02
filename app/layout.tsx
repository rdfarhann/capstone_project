import type { Metadata } from "next";
import { Montserrat, Open_Sans, Geist } from "next/font/google";
import PageLoader from "@/components/shared/PageLoader";
import "./globals.css";
import LoadingLink from "@/components/shared/LoadingLink";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Perpustakaan SMK Negeri 1 Gunung Agung",
  description:
    "Portal Perpustakaan Digital SMK Negeri 1 Gunung Agung – Akses koleksi buku, referensi akademik, dan sumber belajar terlengkap untuk warga sekolah.",
  keywords: "perpustakaan, SMK Negeri 1 Gunung Agung, SMKN1 Gunung Agung, buku, digital library",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={cn("scroll-smooth", montserrat.variable, openSans.variable, "font-sans", geist.variable)}>
      {/* Tambahkan kelas antialiased agar font dirender lebih halus di browser */}
      <body className="antialiased bg-[#F9FBF9] text-[#1A2E1A]">
        <PageLoader />
        {children}
      </body>
    </html>
  );
}