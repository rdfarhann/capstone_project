// components/shared/StatusBadge.tsx
import type { LoanStatus, BookStatus } from "@/types";

type Status = LoanStatus | BookStatus | "active" | "inactive";

const cfg: Record<string, { label: string; className: string }> = {
  available:  { label: "Tersedia",      className: "bg-green-100 text-green-700 border-green-200" },
  borrowed:   { label: "Dipinjam",      className: "bg-amber-100 text-amber-700 border-amber-200" },
  maintenance:{ label: "Perbaikan",     className: "bg-gray-100  text-gray-500  border-gray-200"  },
  pending:    { label: "Menunggu",      className: "bg-blue-100  text-blue-700  border-blue-200"  },
  active:     { label: "Aktif",         className: "bg-green-100 text-green-700 border-green-200" },
  returned:   { label: "Dikembalikan",  className: "bg-gray-100  text-gray-500  border-gray-200"  },
  overdue:    { label: "Terlambat",     className: "bg-red-100   text-red-600   border-red-200"   },
  inactive:   { label: "Nonaktif",      className: "bg-gray-100  text-gray-400  border-gray-200"  },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, className } = cfg[status] ?? { label: status, className: "bg-gray-100 text-gray-500 border-gray-200" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${className}`}>
      {label}
    </span>
  );
}