// app/dashboard/user/fines/page.tsx
// ============================================================
// Halaman denda milik siswa.
// Menggunakan useLoans (filter returned + fine_amount > 0)
// karena tidak ada useFines — denda dihitung dari data loan.
// ============================================================
"use client";

import { useState } from "react";
import { useLoans, type LoanRow } from "@/hooks/useApi";
import {
  DollarSign, AlertTriangle, CheckCircle,
  RefreshCw, Clock, BookOpen, Info,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// ── Helpers ──────────────────────────────────────────────────
function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// Denda dianggap "lunas" jika buku sudah dikembalikan
function isPaid(loan: LoanRow) {
  return loan.status === "returned";
}

// ── Main Page ────────────────────────────────────────────────
export default function UserFinesPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  // Ambil semua loan — filter yang punya denda
  const { data: loans, loading, error, refetch } = useLoans();

  const fineLoans = (loans ?? []).filter((l) => l.fine_amount > 0);

  const filtered = fineLoans.filter((l) => {
    if (statusFilter === "unpaid") return !isPaid(l);
    if (statusFilter === "paid")   return isPaid(l);
    return true;
  });

  const totalUnpaid = fineLoans
    .filter((l) => !isPaid(l))
    .reduce((sum, l) => sum + l.fine_amount, 0);

  const totalPaid = fineLoans
    .filter((l) => isPaid(l))
    .reduce((sum, l) => sum + l.fine_amount, 0);

  const unpaidCount = fineLoans.filter((l) => !isPaid(l)).length;

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="flex items-center gap-3 px-6 py-4 border-b bg-white flex-shrink-0">
        <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
        <Separator orientation="vertical" className="h-5" />
        <DollarSign className="w-4 h-4 text-[#AD1457]" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-800">Denda Saya</h1>
          <p className="text-xs text-gray-400">Riwayat denda keterlambatan pengembalian buku</p>
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
        {/* Alert denda belum dibayar */}
        {unpaidCount > 0 && (
          <div className="mb-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Kamu memiliki {unpaidCount} denda yang belum lunas
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Total tagihan:{" "}
                <span className="font-bold">{formatRupiah(totalUnpaid)}</span>.
                Segera kembalikan buku dan bayar denda ke petugas perpustakaan.
              </p>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border bg-white p-5 flex items-start gap-4 shadow-sm">
            <div className="rounded-lg p-3 bg-[#C62828]">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Belum Lunas</p>
              <p className="text-2xl font-bold text-red-600 mt-0.5">
                {loading ? "—" : formatRupiah(totalUnpaid)}
              </p>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-5 flex items-start gap-4 shadow-sm">
            <div className="rounded-lg p-3 bg-[#2E7D32]">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Sudah Lunas</p>
              <p className="text-2xl font-bold text-gray-800 mt-0.5">
                {loading ? "—" : formatRupiah(totalPaid)}
              </p>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-5 flex items-start gap-4 shadow-sm">
            <div className="rounded-lg p-3 bg-[#AD1457]">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Denda</p>
              <p className="text-2xl font-bold text-gray-800 mt-0.5">
                {loading ? "—" : formatRupiah(totalUnpaid + totalPaid)}
              </p>
            </div>
          </div>
        </div>

        {/* Info cara bayar */}
        <div className="mb-4 flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Pembayaran denda dilakukan langsung di perpustakaan kepada petugas.
            Harap tunjukkan halaman ini saat melakukan pembayaran. Denda dihitung{" "}
            <span className="font-semibold">per hari keterlambatan</span>.
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-between items-center mb-4 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] text-gray-700"
          >
            <option value="all">Semua Denda</option>
            <option value="unpaid">Belum Lunas</option>
            <option value="paid">Sudah Lunas</option>
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
                  {["Judul Buku", "Tgl Jatuh Tempo", "Tgl Dikembalikan", "Keterlambatan", "Denda/Hari", "Total Denda", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-300" />
                      <p>
                        {statusFilter === "unpaid"
                          ? "Tidak ada denda yang belum lunas 🎉"
                          : "Tidak ada data denda"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((loan) => {
                    const paid = isPaid(loan);
                    return (
                      <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="font-medium text-gray-800 line-clamp-1">
                              {loan.book_title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 ml-5">{loan.book_author}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {formatDate(loan.due_date)}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {formatDate(loan.return_date)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-red-600 font-medium text-sm">
                            <Clock className="w-3.5 h-3.5" />
                            {loan.days_overdue} hari
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {formatRupiah(loan.fine_per_day)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-sm">
                          <span className={paid ? "text-gray-700" : "text-red-600"}>
                            {formatRupiah(loan.fine_amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              paid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {paid ? "Lunas" : "Belum Lunas"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {fineLoans.length > 0 && (
            <div className="px-4 py-3 border-t text-xs text-gray-400">
              {filtered.length} dari {fineLoans.length} denda
            </div>
          )}
        </div>
      </main>
    </div>
  );
}