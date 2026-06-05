// app/dashboard/admin/loans/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useLoans, apiCall, type LoanRow } from "@/hooks/useApi";
import {
  BookMarked, Search, CheckCircle, RotateCcw,
  AlertTriangle, Clock, X, Filter,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// ── Helpers ──────────────────────────────────────────────────
const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending:  { label: "Menunggu",  cls: "bg-yellow-100 text-yellow-800" },
  active:   { label: "Dipinjam",  cls: "bg-blue-100 text-blue-800" },
  returned: { label: "Dikembalikan", cls: "bg-green-100 text-green-800" },
  overdue:  { label: "Terlambat", cls: "bg-red-100 text-red-800" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n);
}

// ── Return Modal ─────────────────────────────────────────────
function ReturnModal({
  loan,
  onClose,
  onDone,
}: {
  loan: LoanRow;
  onClose: () => void;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleReturn = async () => {
    setLoading(true); setErr("");
    const res = await apiCall(`/api/loans?id=${loan.id}`, "PATCH", {
      action: "return",
    });
    setLoading(false);
    if (!res.ok) { setErr(res.message ?? "Gagal memproses pengembalian"); return; }
    onDone();
    onClose();
  };

  const fine = loan.fine_amount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-base font-semibold text-gray-800">Konfirmasi Pengembalian</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {err && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />{err}
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Buku</span>
              <span className="font-medium text-gray-800 text-right max-w-[60%]">{loan.book_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Peminjam</span>
              <span className="font-medium text-gray-800">{loan.user_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Jatuh Tempo</span>
              <span className="font-medium text-gray-800">{formatDate(loan.due_date)}</span>
            </div>
            {loan.days_overdue > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Keterlambatan</span>
                <span className="font-medium text-red-600">{loan.days_overdue} hari</span>
              </div>
            )}
          </div>

          {fine && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Total Denda</span>
              </div>
              <span className="text-lg font-bold text-red-700">{formatRupiah(loan.fine_amount)}</span>
            </div>
          )}
        </div>
        <div className="flex gap-3 p-5 border-t">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleReturn}
            disabled={loading}
            className="flex-1 bg-[#2E7D32] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#1B5E20] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {loading ? "Memproses..." : "Konfirmasi Kembali"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function AdminLoansPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [returningLoan, setReturningLoan] = useState<LoanRow | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const { data: loans, loading, error, refetch } = useLoans({
    status: statusFilter || undefined,
    search: debouncedSearch || undefined,
  });

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    const t = setTimeout(() => setDebouncedSearch(val), 400);
    return () => clearTimeout(t);
  }, []);

  const handleApprove = async (id: number) => {
    setApprovingId(id);
    await apiCall(`/api/loans?id=${id}`, "PATCH", { action: "approve" });
    setApprovingId(null);
    refetch();
  };

  const statFilters = [
    { value: "", label: "Semua" },
    { value: "pending", label: "Menunggu" },
    { value: "active", label: "Dipinjam" },
    { value: "overdue", label: "Terlambat" },
    { value: "returned", label: "Dikembalikan" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="flex items-center gap-3 px-6 py-4 border-b bg-white flex-shrink-0">
        <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
        <Separator orientation="vertical" className="h-5" />
        <BookMarked className="w-4 h-4 text-[#2E7D32]" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-800">Peminjaman & Denda</h1>
          <p className="text-xs text-gray-400">Kelola peminjaman dan pengembalian buku</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 bg-[#F9FBF9]">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari nama siswa atau judul buku..."
              className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex gap-1 flex-wrap">
              {statFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === f.value
                      ? "bg-[#2E7D32] text-white"
                      : "bg-white border text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
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
                  {["Peminjam", "Buku", "Dipinjam", "Jatuh Tempo", "Status", "Denda", "Aksi"].map((h) => (
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
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !loans?.length ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      Tidak ada data peminjaman
                    </td>
                  </tr>
                ) : (
                  loans.map((loan) => {
                    const st = STATUS_LABEL[loan.status] ?? STATUS_LABEL.pending;
                    const isOverdue = loan.days_overdue > 0;
                    return (
                      <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{loan.user_name}</p>
                          <p className="text-xs text-gray-400">{loan.user_class}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 line-clamp-1 max-w-[200px]">{loan.book_title}</p>
                          <p className="text-xs text-gray-400">{loan.book_author}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(loan.borrow_date)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={isOverdue ? "text-red-600 font-medium" : "text-gray-600"}>
                            {formatDate(loan.due_date)}
                          </span>
                          {isOverdue && (
                            <p className="text-xs text-red-500">+{loan.days_overdue} hari</p>
                          )}
                          {!isOverdue && loan.days_remaining > 0 && loan.status === "active" && (
                            <p className="text-xs text-gray-400">{loan.days_remaining} hari lagi</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${st.cls}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {loan.fine_amount > 0 ? (
                            <span className="text-red-600 font-medium">{formatRupiah(loan.fine_amount)}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {loan.status === "pending" && (
                              <button
                                onClick={() => handleApprove(loan.id)}
                                disabled={approvingId === loan.id}
                                title="Approve peminjaman"
                                className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] disabled:opacity-60 transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                {approvingId === loan.id ? "..." : "Approve"}
                              </button>
                            )}
                            {(loan.status === "active" || loan.status === "overdue") && (
                              <button
                                onClick={() => setReturningLoan(loan)}
                                title="Proses pengembalian"
                                className="flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Kembalikan
                              </button>
                            )}
                            {(loan.status === "returned") && (
                              <span className="text-xs text-gray-400">Selesai</span>
                            )}
                          </div>
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
              {loans.length} peminjaman ditemukan
            </div>
          )}
        </div>
      </main>

      {/* Return Modal */}
      {returningLoan && (
        <ReturnModal
          loan={returningLoan}
          onClose={() => setReturningLoan(null)}
          onDone={refetch}
        />
      )}
    </div>
  );
}