// app/dashboard/user/loans/page.tsx
"use client";

import { useState } from "react";
import { useLoans, type LoanRow } from "@/hooks/useApi";
import {
  BookOpen, Search, Clock, CheckCircle,
  AlertTriangle, RefreshCw, Calendar, BookMarked,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// ── Helpers ──────────────────────────────────────────────────
function getEffectiveStatus(loan: LoanRow): "active" | "overdue" | "returned" | "pending" {
  if (loan.status === "returned") return "returned";
  if (loan.status === "overdue" || loan.days_overdue > 0) return "overdue";
  return loan.status as "active" | "pending";
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending:  { label: "Menunggu",      cls: "bg-yellow-100 text-yellow-800" },
  active:   { label: "Dipinjam",      cls: "bg-blue-100 text-blue-800" },
  overdue:  { label: "Terlambat",     cls: "bg-red-100 text-red-800" },
  returned: { label: "Dikembalikan",  cls: "bg-green-100 text-green-800" },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n);
}

// ── Main Page ────────────────────────────────────────────────
export default function UserLoansPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: loans, loading, error, refetch } = useLoans();

  const filtered = (loans ?? []).filter((loan) => {
    const matchSearch =
      loan.book_title.toLowerCase().includes(search.toLowerCase()) ||
      loan.book_author.toLowerCase().includes(search.toLowerCase());
    const effective = getEffectiveStatus(loan);
    const matchStatus = statusFilter === "all" || effective === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount   = (loans ?? []).filter((l) => getEffectiveStatus(l) === "active").length;
  const overdueCount  = (loans ?? []).filter((l) => getEffectiveStatus(l) === "overdue").length;
  const returnedCount = (loans ?? []).filter((l) => getEffectiveStatus(l) === "returned").length;

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="flex items-center gap-3 px-6 py-4 border-b bg-white flex-shrink-0">
        <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
        <Separator orientation="vertical" className="h-5" />
        <BookMarked className="w-4 h-4 text-[#2E7D32]" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-800">Riwayat Peminjaman</h1>
          <p className="text-xs text-gray-400">Daftar buku yang kamu pinjam</p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 bg-[#F9FBF9]">
        {/* Alert terlambat */}
        {overdueCount > 0 && (
          <div className="mb-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Kamu memiliki {overdueCount} peminjaman yang terlambat!
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Segera kembalikan buku ke perpustakaan untuk menghindari denda lebih besar.
              </p>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Sedang Dipinjam", value: activeCount, icon: BookOpen, color: "bg-[#1565C0]" },
            { label: "Terlambat",       value: overdueCount, icon: AlertTriangle, color: "bg-[#C62828]" },
            { label: "Dikembalikan",    value: returnedCount, icon: CheckCircle, color: "bg-[#2E7D32]" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border bg-white p-5 flex items-start gap-4 shadow-sm">
              <div className={`rounded-lg p-3 ${item.color}`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-0.5">
                  {loading ? "—" : item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul atau penulis buku..."
              className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] text-gray-700"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="active">Dipinjam</option>
            <option value="overdue">Terlambat</option>
            <option value="returned">Dikembalikan</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            Gagal memuat data: {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F1F8F1] border-b">
                <tr>
                  {["Judul Buku / Penulis", "Tgl Pinjam", "Tgl Jatuh Tempo", "Sisa / Terlambat", "Denda", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada riwayat peminjaman"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((loan) => {
                    const effective = getEffectiveStatus(loan);
                    const st = STATUS_LABEL[effective];
                    const isLate = effective === "overdue";

                    return (
                      <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 line-clamp-1">{loan.book_title}</p>
                          <p className="text-xs text-gray-400">{loan.book_author}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {formatDate(loan.borrow_date)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className={`flex items-center gap-1.5 ${isLate ? "text-red-600 font-medium" : ""}`}>
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(loan.due_date)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {effective === "returned" ? (
                            <span className="text-gray-400 text-xs">—</span>
                          ) : isLate ? (
                            <span className="text-red-600 font-semibold text-xs">
                              +{loan.days_overdue} hari terlambat
                            </span>
                          ) : (
                            <span className="text-green-700 text-xs font-medium">
                              {loan.days_remaining} hari lagi
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {loan.fine_amount > 0 ? (
                            <span className="text-red-600 font-semibold text-xs">
                              {formatRupiah(loan.fine_amount)}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${st.cls}`}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {loans && (
            <div className="px-4 py-3 border-t text-xs text-gray-400">
              {filtered.length} dari {loans.length} peminjaman
            </div>
          )}
        </div>
      </main>
    </div>
  );
}