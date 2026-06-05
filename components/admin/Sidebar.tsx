"use client";
// components/admin/AdminSidebar.tsx

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  ChevronRight,
  Library,
  Loader2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navMain = [
  { title: "Dashboard",          href: "/dashboard/admin",             icon: LayoutDashboard },
  { title: "Manajemen Buku",     href: "/dashboard/admin/books",           icon: BookOpen },
  { title: "Manajemen User",     href: "/dashboard/admin/user-managament", icon: Users },
  { title: "Peminjaman & Denda", href: "/dashboard/admin/loans",           icon: ClipboardList },
];

const navSecondary = [
  { title: "Pengaturan", href: "/dashboard/admin/settings", icon: Settings },
];

interface UserProfile {
  name: string;
  role: string;
  avatar_url: string | null;
}

export function AdminSidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  
  // State untuk menyimpan data user yang sedang login
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Ambil data user saat komponen pertama kali dimuat
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/auth/profile");
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // Jika token tidak valid, arahkan kembali ke login
          router.push("/login");
        }
      } catch (err) {
        console.error("Gagal memuat profil user:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchProfile();
  }, [router]);

  const isActive = (href: string) =>
    href === "/dashboard/admin"
      ? pathname === "/dashboard/admin"
      : pathname.startsWith(href);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Gagal logout dari server");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/login");
      setTimeout(() => setLoggingOut(false), 2000);
    }
  };

  return (
    <Sidebar collapsible="icon">
      {/* ── Header ── */}
      <SidebarHeader className="border-b border-sidebar-border pb-0">
        <div className="h-0.5 w-full bg-[#F9A825] -mt-px rounded-none" />
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/20 overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo SMKN 1 Gunung Agung"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground leading-tight truncate">
              Perpustakaan
            </span>
            <span className="text-xs text-sidebar-foreground/50 truncate">
              SMKN 1 Gunung Agung
            </span>
          </div>
        </div>
        <div className="px-3 pb-3 group-data-[collapsible=icon]:hidden">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F9A825]/30 bg-[#F9A825]/15 px-2.5 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F9A825]" />
            <span className="text-[11px] font-semibold text-[#F9A825]">
              {user?.role === "admin" ? "Admin Panel" : "User Panel"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Main Nav ── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest font-semibold px-3">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map(({ title, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(href)}
                    tooltip={title}
                    className={
                      isActive(href)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        : "text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/60"
                    }
                  >
                    <Link href={href} className="flex items-center gap-3 w-full">
                      <Icon
                        size={17}
                        className={isActive(href) ? "text-[#F9A825]" : "text-sidebar-foreground/50"}
                      />
                      <span>{title}</span>
                      {isActive(href) && (
                        <ChevronRight size={13} className="ml-auto text-sidebar-foreground/30" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-sidebar-border" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest font-semibold px-3">
            Sistem
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map(({ title, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={title}
                    className="text-sidebar-foreground/60 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/60"
                  >
                    <Link href={href} className="flex items-center gap-3 w-full">
                      <Icon size={17} />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {/* Admin / User Info Dinamis */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={user?.name ?? "Profil"}
              className="text-sidebar-foreground/70 hover:bg-sidebar-accent/60 group-data-[collapsible=icon]:justify-center h-12"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 border border-white/20 overflow-hidden">
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.name}
                    width={28}
                    height={28}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <Library size={14} className="text-white" />
                )}
              </div>
              <div className="flex flex-col items-start text-left leading-tight group-data-[collapsible=icon]:hidden max-w-[150px]">
                {loadingUser ? (
                  <>
                    <div className="h-3 w-20 bg-sidebar-foreground/20 animate-pulse rounded mb-1" />
                    <div className="h-2.5 w-14 bg-sidebar-foreground/10 animate-pulse rounded" />
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-sidebar-foreground truncate w-full">
                      {user?.name ?? "Guest"}
                    </span>
                    <span className="text-xs text-sidebar-foreground/50 capitalize">
                      {user?.role ?? "Pengunjung"}
                    </span>
                  </>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Keluar"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-red-300/70 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50 cursor-pointer w-full flex items-center gap-3"
            >
              {loggingOut ? (
                <Loader2 size={17} className="animate-spin shrink-0" />
              ) : (
                <LogOut size={17} className="shrink-0" />
              )}
              <span className="group-data-[collapsible=icon]:hidden">
                {loggingOut ? "Keluar..." : "Keluar"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}