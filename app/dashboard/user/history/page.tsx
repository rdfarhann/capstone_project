"use client";
// app/dashboard/user/history/page.tsx — Riwayat & Pengembalian
import { useState } from "react";
import { BookOpen, Clock, AlertTriangle, CheckCircle, RefreshCcw, History, X } from "lucide-react";
import { UserNavbar } from "@/components/user/Navbar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import {
  mockLoans, calculateFine, getDaysRemaining,
  formatRupiah, formatDate, fineConfig,
} from "@/lib/mockData";
import type { Loan } from "@/types";

const MY_USER_ID = "u1";

type Tab = "active" | "history";

export default function UserHistoryPage() {
  const [loans, setLoans]         = useState<Loan[]>(mockLoans.filter(l => l.userId === MY_USER_ID));
  const [tab, setTab]             = useState<Tab>("active");
  const [returnTarget, setReturn] = useState<Loan | null>(null);
  const [successMsg, setSuccess]  = useState<string | null>(null);

  const activeLoans  = loans.filter(l => l.status === "active"  || l.status === "overdue");
  const historyLoans = loans.filter(l => l.status === "returned" || l.status === "pending");

  const handleReturn = () => {
    if (!returnTarget) return;
    const returnDate = new Date().toISOString().split("T")[0];
    const fine       = calculateFine(returnTarget.dueDate, returnDate);
    setLoans(p => p.map(l =>
      l.id === returnTarget.id
        ? { ...l, status: "returned", returnDate, fineAmount: fine }
        : l
    ));
    setSuccess(`Pengajuan pengembalian "${returnTarget.bookTitle}" berhasil dikirim.`);
    setReturn(null);
    setTimeout(() => setSuccess(null), 5000);
  };

  return (
    <>
      <UserNavbar title="Riwayat Peminjaman" subtitle="Kelola buku yang sedang kamu pinjam" />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-8 space-y-5">

          {/* Success toast */}
          {successMsg && (
            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3.5">
              <CheckCircle size={16} className="text-green-600 shrink-0" />
              <p className="flex-1 text-sm font-medium text-green-800">{successMsg}</p>
              <button onClick={() => setSuccess(null)}><X size={14} className="text-green-600/60 hover:text-green-700" /></button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border">
            {([
              { key:"active",  label:"Sedang Dipinjam", count: activeLoans.length  },
              { key:"history", label:"Riwayat",         count: historyLoans.length },
            ] as { key:Tab; label:string; count:number }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  tab === t.key
                    ? "border-[#1B5E20] text-[#1B5E20]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                  tab === t.key ? "bg-[#E8F5E9] text-[#1B5E20]" : "bg-muted text-muted-foreground"
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* ── Active Loans ── */}
          {tab === "active" && (
            <div className="space-y-3">
              {activeLoans.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card py-20 text-center">
                  <BookOpen size={40} className="mx-auto mb-3 text-muted-foreground/20" />
                  <p className="text-muted-foreground">Tidak ada buku yang sedang dipinjam</p>
                  <a href="/dashboard/user/books" className="mt-2 inline-block text-xs font-semibold text-[#1B5E20] hover:underline">
                    Cari buku →
                  </a>
                </div>
              ) : activeLoans.map(loan => {
                const daysLeft = getDaysRemaining(loan.dueDate);
                const fine     = calculateFine(loan.dueDate, undefined, fineConfig.pricePerDay);
                const isLate   = daysLeft < 0;
                const isWarn   = !isLate && daysLeft <= 3;

                return (
                  <div
                    key={loan.id}
                    className={`rounded-2xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm ${
                      isLate ? "border-red-200 bg-red-50/30" : "border-border"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isLate ? "bg-red-100" : "bg-[#E8F5E9]"}`}>
                        <BookOpen size={20} className={isLate ? "text-red-600" : "text-[#1B5E20]"} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="font-bold text-foreground">{loan.bookTitle}</h3>
                            <p className="text-sm text-muted-foreground">{loan.bookAuthor}</p>
                          </div>
                          <StatusBadge status={loan.status} />
                        </div>

                        {/* Stats grid */}
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label:"Tanggal Pinjam",  value:formatDate(loan.borrowDate),  cls:"" },
                            { label:"Batas Kembali",   value:formatDate(loan.dueDate),      cls: isLate ? "text-red-600 font-semibold" : "" },
                            { label:"Sisa Waktu",
                              value: isLate ? `${Math.abs(daysLeft)} hari terlambat` : `${daysLeft} hari lagi`,
                              cls: isLate ? "text-red-600 font-bold" : isWarn ? "text-amber-600 font-bold" : "text-green-600 font-bold",
                            },
                            { label:"Denda Berjalan",  value: fine > 0 ? formatRupiah(fine) : "Rp 0", cls: fine > 0 ? "text-red-600 font-bold" : "text-muted-foreground" },
                          ].map(({ label, value, cls }) => (
                            <div key={label}>
                              <p className="text-[11px] text-muted-foreground">{label}</p>
                              <p className={`text-sm mt-0.5 ${cls || "text-foreground font-medium"}`}>{value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Countdown bar */}
                        {!isLate && (
                          <div className="mt-3">
                            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${isWarn ? "bg-amber-400" : "bg-[#4CAF50]"}`}
                                style={{ width: `${Math.max(5, (daysLeft / 14) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* CTA */}
                        <div className="mt-3">
                          <Button
                            size="sm"
                            className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white gap-1.5"
                            onClick={() => setReturn(loan)}
                          >
                            <RefreshCcw size={13} />
                            Ajukan Pengembalian
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── History ── */}
          {tab === "history" && (
            <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
              {historyLoans.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                  <History size={40} className="mx-auto mb-3 opacity-20" />
                  <p>Belum ada riwayat peminjaman</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {historyLoans.map(loan => (
                    <div key={loan.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                        <BookOpen size={16} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{loan.bookTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {loan.bookAuthor} · Dipinjam {formatDate(loan.borrowDate)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right space-y-1">
                        <StatusBadge status={loan.status} />
                        {loan.returnDate && (
                          <p className="text-[11px] text-muted-foreground">
                            Kembali {formatDate(loan.returnDate)}
                          </p>
                        )}
                        {loan.fineAmount > 0 && (
                          <p className="text-[11px] font-semibold text-red-500">
                            Denda: {formatRupiah(loan.fineAmount)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal Konfirmasi Pengembalian */}
      <Modal isOpen={!!returnTarget} onClose={() => setReturn(null)} title="Ajukan Pengembalian" size="sm">
        {returnTarget && (() => {
          const fine = calculateFine(returnTarget.dueDate);
          return (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="font-bold text-foreground">{returnTarget.bookTitle}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{returnTarget.bookAuthor}</p>
              </div>

              {fine > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-sm font-semibold text-red-700">
                    Denda terhitung: {formatRupiah(fine)}
                  </p>
                  <p className="mt-0.5 text-xs text-red-600/80">
                    Denda dibayarkan langsung ke petugas perpustakaan.
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                Pengajuan akan dikonfirmasi petugas perpustakaan. Silakan kembalikan buku secara langsung.
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="outline" className="flex-1" onClick={() => setReturn(null)}>
                  Batal
                </Button>
                <Button className="flex-1 bg-[#1B5E20] hover:bg-[#2E7D32] text-white" onClick={handleReturn}>
                  Kirim Pengajuan
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </>
  );
}