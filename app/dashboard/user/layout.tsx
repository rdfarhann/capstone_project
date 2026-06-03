// app/dashboard/user/layout.tsx
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip"; // 1. Impor TooltipProvider

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <TooltipProvider delayDuration={0}> {/* 2. Bungkus komponen di dalamnya */}
        <UserSidebar />
        <SidebarInset className="flex flex-col min-h-svh overflow-hidden bg-background">
          {children}
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}