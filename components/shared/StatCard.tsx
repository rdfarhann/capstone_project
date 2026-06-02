// components/shared/StatCard.tsx
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "green" | "amber" | "red" | "blue";
  subtitle?: string;
  trend?: { value: number; label: string };
}

const colorMap = {
  green: { bg: "bg-[#E8F5E9]", icon: "bg-[#1B5E20]/10 text-[#1B5E20]", ring: "ring-[#1B5E20]/10", text: "text-[#1B5E20]" },
  amber: { bg: "bg-amber-50",  icon: "bg-amber-100 text-amber-700",       ring: "ring-amber-100",   text: "text-amber-700" },
  red:   { bg: "bg-red-50",    icon: "bg-red-100 text-red-600",            ring: "ring-red-100",     text: "text-red-600" },
  blue:  { bg: "bg-blue-50",   icon: "bg-blue-100 text-blue-700",          ring: "ring-blue-100",    text: "text-blue-700" },
};

export function StatCard({ title, value, icon: Icon, color, subtitle, trend }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-xs hover:shadow-sm transition-shadow`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${c.icon} ${c.ring}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-foreground leading-tight tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
      {trend && (
        <div className={`shrink-0 text-right`}>
          <span className={`text-xs font-semibold ${trend.value >= 0 ? "text-green-600" : "text-red-500"}`}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
          <p className="text-[10px] text-muted-foreground">{trend.label}</p>
        </div>
      )}
    </div>
  );
}