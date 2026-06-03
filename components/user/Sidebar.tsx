"use client";
// components/user/UserSidebar.tsx
// Style identik dengan AdminSidebar — sidebar shadcn tema hijau

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  History,
  Bell,
  LogOut,
  ChevronRight,
  UserCircle,
  LayoutDashboard,
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
import { mockNotifications } from "@/lib/mockData";

// ID user yang sedang login (nanti diganti dengan session)
const MY_USER_ID = "u1";
const MY_NAME    = "Budi Santoso";
const MY_CLASS   = "X TKJ 1";

const navItems = [
  { title: "Beranda",         href: "/dashboard/user",                  icon: LayoutDashboard },
  { title: "Katalog Buku",    href: "/dashboard/user/books",            icon: BookOpen },
  { title: "Riwayat Pinjam",  href: "/dashboard/user/history",          icon: History },
  { title: "Notifikasi",      href: "/dashboard/user/notifications",    icon: Bell },
];

export function UserSidebar() {
  const pathname = usePathname();
  const unread   = mockNotifications.filter(n => !n.isRead && n.userId === MY_USER_ID).length;

  const isActive = (href: string) =>
    href === "/dashboard/user"
      ? pathname === "/dashboard/user"
      : pathname.startsWith(href);

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
            Menu
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
                          {unread}
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
              tooltip={MY_NAME}
              className="text-sidebar-foreground/70 hover:bg-sidebar-accent/60"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 border border-white/20">
                <UserCircle size={15} className="text-white" />
              </div>
              <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-sidebar-foreground">{MY_NAME}</span>
                <span className="text-xs text-sidebar-foreground/50">{MY_CLASS}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Keluar"
              className="text-red-300/70 hover:text-red-300 hover:bg-red-500/10"
            >
              <Link href="/login">
                <LogOut size={17} />
                <span>Keluar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}