// app/dashboard/user/layout.tsx
"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserSidebar } from "@/components/user/Sidebar"; // Memanggil sidebar baru kita

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <TooltipProvider delayDuration={0}>
        <div className="flex h-screen bg-[#F9FBF9] overflow-hidden w-full">
          
          {/* ── SEKARANG MENGGUNAKAN USER SIDEBAR SHADCN YANG BARU ── */}
          <UserSidebar />

          {/* Content Area */}
          <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-[#F9FBF9]">
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </SidebarInset>
          
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}