// app/dashboard/user/layout.tsx
// Layout untuk dashboard siswa — Menggunakan Shadcn/UI Sidebar
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BookMarked, Bell, User, LogOut } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const NAV = [
  { href: "/dashboard/user", label: "Beranda", icon: BookOpen, exact: true },
  { href: "/dashboard/user/loans", label: "Peminjaman Saya", icon: BookMarked },
  { href: "/dashboard/user/notifications", label: "Notifikasi", icon: Bell },
  { href: "/dashboard/user/profile", label: "Profil", icon: User },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={true}>
      <TooltipProvider delayDuration={0}>
        <div className="flex h-screen bg-[#F9FBF9] overflow-hidden w-full">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r flex flex-col flex-shrink-0">
            {/* Logo */}
            <div className="p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#2E7D32] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Perpustakaan</p>
                  <p className="text-xs text-gray-400">SMKN 1 Gunung Agung</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1">
              {NAV.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#E8F5E9] text-[#2E7D32]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${active ? "text-[#2E7D32]" : "text-gray-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t">
              <Link
                href="/login"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Link>
            </div>
          </aside>

          {/* Content Area menggunakan SidebarInset */}
          <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-[#F9FBF9]">
            {/* Opsi Tambahan: Jika ingin trigger dipasang di header global layout */}
            {/* <header className="flex h-14 items-center gap-4 border-b bg-white px-4">
              <SidebarTrigger />
            </header> */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}