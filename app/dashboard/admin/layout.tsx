import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip"; // 1. Import TooltipProvider

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. Bungkus semua komponen dengan TooltipProvider di layer paling luar
    // delayDuration={0} membuat tooltip langsung muncul tanpa delay saat sidebar di-hover
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={true}>
        <AdminSidebar />

        {/* SidebarInset = area konten utama di sebelah kanan sidebar */}
        <SidebarInset className="flex flex-col min-h-svh overflow-hidden bg-background">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}