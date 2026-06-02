"use client";
// components/admin/AdminNavbar.tsx

import { Bell, Search,  } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockNotifications } from "@/lib/mockData";
import { SidebarTrigger } from "@/components/ui/sidebar";
interface AdminNavbarProps {
  title: string;
  subtitle?: string;
}

export function AdminNavbar({ title, subtitle }: AdminNavbarProps) {
  const unread = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 lg:px-6">
      {/* Sidebar toggle */}
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />

      <Separator orientation="vertical" className="h-5" />

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-foreground leading-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search
            size={14}
            className="absolute left-3 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Cari..."
            className="h-8 w-44 rounded-lg border border-input bg-muted/40 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>

        {/* Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none">
              {unread}
            </span>
          )}
        </Button>

        <Separator orientation="vertical" className="h-5" />

        {/* Admin badge */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B5E20] text-white text-xs font-bold shrink-0">
            PS
          </div>
          <div className="hidden md:block leading-none">
            <p className="text-sm font-semibold text-foreground">Pak Surya</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}