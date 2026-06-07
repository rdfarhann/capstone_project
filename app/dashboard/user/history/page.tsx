"use client";
// app/dashboard/user/history/page.tsx — Riwayat & Pengembalian
import { useState } from "react";
import {
  BookOpen, Clock, AlertTriangle, CheckCircle,
  RefreshCcw, History, X, Loader2,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useLoans, apiCall, type LoanRow } from "@/hooks/useApi";

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

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending:  { label: "Menunggu",      cls: "bg-yellow-100 text-yellow-800" },
  active:   { label: "Dipinjam",      cls: "bg-blue-100 text-blue-800" },
  overdue:  { label: "Terlambat",     cls: "bg-red-100 text-red-800" },
  returned: { label: "Dikembalikan",  cls: "bg-green-100 text-green-800" },
};

type Tab = "active" | "history";

// ── Modal Konfirmasi Pengembalian ─────────────────────────────
function ReturnModal({
  loan,
  onClose,
  onConfirm,
  loading,
}: {
  loan: LoanRow;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  const isLate = loan.days_overdue > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-base font-semibold text-gray-800">Ajukan Pengembalian</h2>
          <button onClick={onClose} disabled={loading} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Info buku */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="font-bold text-gray-800">{loan.book_title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{loan.book_author}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>Dipinjam: {formatDate(loan.borrow_date)}</span>
              <span>Jatuh tempo: {formatDate(loan.due_date)}</span>
            </div>
          </div>

          {/* Info denda jika terlambat */}
          {isLate && loan.fine_amount > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm font-semibold text-red-700">Ada denda keterlambatan</p>
              </div>
              <p className="text-lg font-bold text-red-600">{formatRupiah(loan.fine_amount)}</p>
              <p className="text-xs text-red-500 mt-1">
                {loan.days_overdue} hari × {formatRupiah(loan.fine_per_day)}/hari.
                Denda dibayarkan langsung ke petugas perpustakaan.
              </p>
            </div>
          )}

          {/* Catatan */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">
            Pengajuan akan dikonfirmasi petugas perpustakaan. Silakan kembalikan buku secara langsung ke perpustakaan.
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-[#2E7D32] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#1B5E20] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : "Kirim Pengajuan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function UserHistoryPage() {
  const [tab, setTab]               = useState<Tab>("active");
  const [returnTarget, setReturn]   = useState<LoanRow | null>(null);
  const [returning, setReturning]   = useState(false);
  const [successMsg, setSuccess]    = useState<string | null>(null);
  const [errorMsg, setError]        = useState<string | null>(null);

  const { data: loans, loading, error, refetch } = useLoans();

  const activeLoans  = (loans ?? []).filter(
    (l) => l.status === "active" || l.status === "overdue" || l.status === "pending"
  );
  const historyLoans = (loans ?? []).filter((l) => l.status === "returned");

  const handleReturn = async () => {
    if (!returnTarget) return;
    setReturning(true);
    setError(null);

    const res = await apiCall(`/api/loans?id=${returnTarget.id}`, "PATCH", {
      action: "return",
    });

    setReturning(false);

    if (!res.ok) {
      setError(res.message ?? "Gagal mengajukan pengembalian");
      return;
    }

    setReturn(null);
    setSuccess(`Pengajuan pengembalian "${returnTarget.book_title}" berhasil dikirim.`);
    refetch();
    setTimeout(() => setSuccess(null), 5000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="flex items-center gap-3 px-6 py-4 border-b bg-white flex-shrink-0">
        <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
        <Separator orientation="vertical" className="h-5" />
        <History className="w-4 h-4 text-[#2E7D32]" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-800">Riwayat Peminjaman</h1>
          <p className="text-xs text-gray-400">Kelola buku yang sedang kamu pinjam</p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium disabled:opacity-50 transition-colors"
        >
          Refresh
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 bg-[#F9FBF9]">
        {/* Toast sukses */}
        {successMsg && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium text-green-800">{successMsg}</p>
            <button onClick={() => setSuccess(null)}>
              <X className="w-4 h-4 text-green-500" />
            </button>
          </div>
        )}

        {/* Toast error */}
        {(errorMsg || error) && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="flex-1 text-sm text-red-700">{errorMsg ?? error}</p>
            <button onClick={() => setError(null)}>
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-5">
          {([
            { key: "active",  label: "Sedang Dipinjam", count: activeLoans.length  },
            { key: "history", label: "Riwayat",          count: historyLoans.length },
          ] as { key: Tab; label: string; count: number }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === t.key
                  ? "border-[#2E7D32] text-[#2E7D32]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                tab === t.key ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-gray-100 text-gray-500"
              }`}>
                {loading ? "—" : t.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Tab: Sedang Dipinjam ── */}
        {tab === "active" && (
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-white p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/2 mt-3" />
                    </div>
                  </div>
                </div>
              ))
            ) : activeLoans.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
                <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">Tidak ada buku yang sedang dipinjam</p>
                <a
                  href="/dashboard/user/books"
                  className="mt-2 inline-block text-xs font-semibold text-[#2E7D32] hover:underline"
                >
                  Cari buku →
                </a>
              </div>
            ) : (
              activeLoans.map((loan) => {
                const isLate = loan.days_overdue > 0;
                const isWarn = !isLate && loan.days_remaining <= 3;
                const st = STATUS_LABEL[isLate ? "overdue" : loan.status] ?? STATUS_LABEL.active;

                return (
                  <div
                    key={loan.id}
                    className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
                      isLate ? "border-red-200 bg-red-50/20" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        isLate ? "bg-red-100" : "bg-[#E8F5E9]"
                      }`}>
                        <BookOpen className={`w-5 h-5 ${isLate ? "text-red-600" : "text-[#2E7D32]"}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="font-bold text-gray-800">{loan.book_title}</h3>
                            <p className="text-sm text-gray-500">{loan.book_author}</p>
                          </div>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${st.cls}`}>
                            {st.label}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label: "Tanggal Pinjam", value: formatDate(loan.borrow_date), cls: "" },
                            {
                              label: "Batas Kembali",
                              value: formatDate(loan.due_date),
                              cls: isLate ? "text-red-600 font-semibold" : "",
                            },
                            {
                              label: "Sisa Waktu",
                              value: isLate
                                ? `${loan.days_overdue} hari terlambat`
                                : `${loan.days_remaining} hari lagi`,
                              cls: isLate
                                ? "text-red-600 font-bold"
                                : isWarn
                                ? "text-yellow-600 font-bold"
                                : "text-green-600 font-bold",
                            },
                            {
                              label: "Denda Berjalan",
                              value: loan.fine_amount > 0 ? formatRupiah(loan.fine_amount) : "Rp 0",
                              cls: loan.fine_amount > 0 ? "text-red-600 font-bold" : "text-gray-400",
                            },
                          ].map(({ label, value, cls }) => (
                            <div key={label}>
                              <p className="text-[11px] text-gray-400">{label}</p>
                              <p className={`text-sm mt-0.5 font-medium ${cls || "text-gray-700"}`}>{value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Progress bar */}
                        {!isLate && loan.status !== "pending" && (
                          <div className="mt-3">
                            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isWarn ? "bg-yellow-400" : "bg-[#4CAF50]"
                                }`}
                                style={{ width: `${Math.max(5, (loan.days_remaining / 14) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Tombol ajukan pengembalian */}
                        {loan.status !== "pending" && (
                          <div className="mt-3">
                            <button
                              onClick={() => setReturn(loan)}
                              className="flex items-center gap-1.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <RefreshCcw className="w-3.5 h-3.5" />
                              Ajukan Pengembalian
                            </button>
                          </div>
                        )}
                        {loan.status === "pending" && (
                          <p className="mt-3 text-xs text-yellow-600 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Menunggu konfirmasi petugas
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Tab: Riwayat ── */}
        {tab === "history" && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 border-b animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : historyLoans.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <History className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p>Belum ada riwayat peminjaman</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {historyLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{loan.book_title}</p>
                      <p className="text-xs text-gray-400">
                        {loan.book_author} · Dipinjam {formatDate(loan.borrow_date)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right space-y-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_LABEL.returned.cls}`}>
                        {STATUS_LABEL.returned.label}
                      </span>
                      {loan.return_date && (
                        <p className="text-[11px] text-gray-400">
                          Kembali {formatDate(loan.return_date)}
                        </p>
                      )}
                      {loan.fine_amount > 0 && (
                        <p className="text-[11px] font-semibold text-red-500">
                          Denda: {formatRupiah(loan.fine_amount)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal konfirmasi pengembalian */}
      {returnTarget && (
        <ReturnModal
          loan={returnTarget}
          onClose={() => !returning && setReturn(null)}
          onConfirm={handleReturn}
          loading={returning}
        />
      )}
    </div>
  );
}