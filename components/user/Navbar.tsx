"use client";
// components/user/UserNavbar.tsx

import { Bell, Search, } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/lib/mockData";
import { SidebarTrigger } from "@/components/ui/sidebar";

const MY_USER_ID = "u1";
const MY_NAME    = "Budi Santoso";
const MY_CLASS   = "X TKJ 1";

interface UserNavbarProps {
  title: string;
  subtitle?: string;
}

export function UserNavbar({ title, subtitle }: UserNavbarProps) {
  const unread = mockNotifications.filter(n => !n.isRead && n.userId === MY_USER_ID).length;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 lg:px-6">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />

      <Separator orientation="vertical" className="h-5" />

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-foreground leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Cari buku..."
            className="h-8 w-44 rounded-lg border border-input bg-muted/40 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>

        {/* Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
          asChild
        >
          <a href="/dashboard/user/notifications">
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </a>
        </Button>

        <Separator orientation="vertical" className="h-5" />

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B5E20] text-white text-xs font-bold shrink-0">
            {MY_NAME.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="hidden md:block leading-none">
            <p className="text-sm font-semibold text-foreground">{MY_NAME}</p>
            <p className="text-xs text-muted-foreground">{MY_CLASS}</p>
          </div>
        </div>
      </div>
    </header>
  );
}