// components/shared/Badge.tsx
import type { LoanStatus, BookStatus } from "@/types";

interface BadgeProps {
  status: LoanStatus | BookStatus | "active" | "inactive";
  className?: string;
}

const config: Record<string, { label: string; classes: string }> = {
  available:   { label: "Tersedia",   classes: "bg-green-100 text-green-700 border border-green-200" },
  borrowed:    { label: "Dipinjam",   classes: "bg-amber-100 text-amber-700 border border-amber-200" },
  maintenance: { label: "Perbaikan",  classes: "bg-gray-100 text-gray-600 border border-gray-200" },
  pending:     { label: "Pending",    classes: "bg-blue-100 text-blue-700 border border-blue-200" },
  active:      { label: "Aktif",      classes: "bg-green-100 text-green-700 border border-green-200" },
  returned:    { label: "Dikembalikan",classes: "bg-gray-100 text-gray-600 border border-gray-200" },
  overdue:     { label: "Terlambat",  classes: "bg-red-100 text-red-700 border border-red-200" },
  inactive:    { label: "Nonaktif",   classes: "bg-gray-100 text-gray-500 border border-gray-200" },
};

export default function Badge({ status, className = "" }: BadgeProps) {
  const cfg = config[status] ?? { label: status, classes: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.classes} ${className}`}>
      {cfg.label}
    </span>
  );
}