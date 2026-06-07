"use client";
// components/user/UserSidebar.tsx

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen, History, Bell, LogOut,
  ChevronRight, UserCircle, LayoutDashboard, Loader2,
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useApi";

const navItems = [
  { title: "Beranda",         href: "/dashboard/user",             icon: LayoutDashboard },
  { title: "Katalog Buku",   href: "/dashboard/user/books",         icon: BookOpen },
  { title: "Peminjaman Saya", href: "/dashboard/user/loans",         icon: History },
  { title: "Notifikasi",     href: "/dashboard/user/notifications", icon: Bell },
];

export function UserSidebar() {
  const pathname          = usePathname();
  const router            = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Data user dari session JWT
  const { user } = useAuth();

  // Notifikasi belum dibaca
  const userId = String(user?.id ?? "");
  const { data: notifications } = useNotifications(userId, true);
  const unread = notifications?.length ?? 0;

  const isActive = (href: string) =>
    href === "/dashboard/user"
      ? pathname === "/dashboard/user"
      : pathname.startsWith(href);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.push("/login");
    }
  };

  return (
    <Sidebar collapsible="icon">
      {/* ── Header ── */}
      <SidebarHeader className="border-b border-sidebar-border pb-0">
        <div className="h-0.5 w-full bg-[#F9A825] -mt-px" />

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

        {/* Role badge */}
        <div className="px-3 pb-3 group-data-[collapsible=icon]:hidden">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F9A825]/30 bg-[#F9A825]/15 px-2.5 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F9A825]" />
            <span className="text-[11px] font-semibold text-[#F9A825]">
              Portal Siswa
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Nav ── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest font-semibold px-3">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ title, href, icon: Icon }) => (
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
                    <Link href={href} className="flex items-center gap-3">
                      <Icon
                        size={17}
                        className={isActive(href) ? "text-[#F9A825]" : "text-sidebar-foreground/50"}
                      />
                      <span className="flex-1">{title}</span>
                      {/* Badge notifikasi */}
                      {href === "/dashboard/user/notifications" && unread > 0 && (
                        <SidebarMenuBadge className="bg-red-500 text-white text-[10px] font-bold">
                          {unread > 9 ? "9+" : unread}
                        </SidebarMenuBadge>
                      )}
                      {isActive(href) && (
                        <ChevronRight size={13} className="text-sidebar-foreground/30" />
                      )}
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
        <SidebarSeparator className="bg-sidebar-border mb-1" />
        <SidebarMenu>
          {/* User info */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={user?.name ?? "Siswa"}
              className="text-sidebar-foreground/70 hover:bg-sidebar-accent/60 cursor-default"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 border border-white/20">
                <UserCircle size={15} className="text-white" />
              </div>
              <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-sidebar-foreground truncate max-w-[130px]">
                  {user?.name ?? "—"}
                </span>
                <span className="text-xs text-sidebar-foreground/50 truncate max-w-[130px]">
                  {user?.class_name ?? "—"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Keluar"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-red-400 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50 cursor-pointer w-full flex items-center gap-3"
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