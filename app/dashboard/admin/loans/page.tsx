"use client";
// app/dashboard/admin/loans/page.tsx
import { useState, useMemo } from "react";
import { Search, Settings2, CheckCircle, AlertTriangle, Clock, RefreshCcw } from "lucide-react";
import { AdminNavbar } from "@/components/admin/Navbar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import {
  mockLoans, calculateFine, getDaysRemaining,
  formatRupiah, formatDate, fineConfig as defaultFineConfig,
} from "@/lib/mockData";
import type { Loan, FineConfig, LoanStatus } from "@/types";

const STATUS_TABS: { label:string; value:LoanStatus|"all" }[] = [
  { label:"Semua",      value:"all" },
  { label:"Pending",    value:"pending" },
  { label:"Aktif",      value:"active" },
  { label:"Terlambat",  value:"overdue" },
  { label:"Selesai",    value:"returned" },
];

export default function AdminLoansPage() {
  const [loans, setLoans]           = useState<Loan[]>(mockLoans);
  const [fineConfig, setFineConfig] = useState<FineConfig>(defaultFineConfig);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState<LoanStatus|"all">("all");
  const [fineModal, setFineModal]   = useState(false);
  const [newRate, setNewRate]       = useState(fineConfig.pricePerDay);
  const [detailLoan, setDetail]     = useState<Loan | null>(null);

  const filtered = useMemo(() =>
    loans.filter(l => {
      const q = search.toLowerCase();
      return (l.userName.toLowerCase().includes(q) || l.bookTitle.toLowerCase().includes(q))
        && (statusFilter === "all" || l.status === statusFilter);
    }), [loans, search, statusFilter]);

  const handleReturn = (id: string) => {
    setLoans(p => p.map(l => {
      if (l.id !== id) return l;
      const returnDate = new Date().toISOString().split("T")[0];
      return { ...l, status:"returned", returnDate, fineAmount: calculateFine(l.dueDate, returnDate, fineConfig.pricePerDay) };
    }));
  };

  const handleApprove = (id: string) =>
    setLoans(p => p.map(l => l.id === id ? { ...l, status:"active" } : l));

  const saveFineRate = () => {
    setFineConfig(p => ({ ...p, pricePerDay:newRate, updatedAt:new Date().toISOString().split("T")[0] }));
    setLoans(p => p.map(l => l.status !== "returned" ? { ...l, finePerDay:newRate } : l));
    setFineModal(false);
  };

  return (
    <>
      <AdminNavbar title="Peminjaman & Denda" subtitle="Kelola transaksi peminjaman buku" />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-8 space-y-5">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama atau judul buku..."
                className="h-9 w-72 rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <Button onClick={() => setFineModal(true)} size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5">
              <Settings2 size={15} />
              Tarif Denda: {formatRupiah(fineConfig.pricePerDay)}/hari
            </Button>
          </div>

          {/* Status tabs */}
          <div className="flex gap-2 flex-wrap">
            {STATUS_TABS.map(tab => (
              <button key={tab.value} onClick={() => setStatus(tab.value)}
                className={`rounded-full px-4 py-1 text-xs font-semibold transition-colors
                  ${statusFilter === tab.value
                    ? "bg-[#1B5E20] text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {tab.label}
                <span className="ml-1.5 opacity-60">
                  {tab.value === "all" ? loans.length : loans.filter(l => l.status === tab.value).length}
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Peminjam","Buku","Tgl Pinjam","Batas Kembali","Durasi","Status","Denda","Aksi"].map(h => (
                      <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="py-16 text-center text-muted-foreground">Tidak ada data peminjaman</td></tr>
                  ) : filtered.map(loan => {
                    const fine  = calculateFine(loan.dueDate, loan.returnDate, fineConfig.pricePerDay);
                    const dLeft = getDaysRemaining(loan.dueDate);
                    return (
                      <tr key={loan.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-foreground">{loan.userName}</p>
                          <p className="text-xs text-muted-foreground">{loan.userClass}</p>
                        </td>
                        <td className="px-5 py-3.5 max-w-[160px]">
                          <p className="font-medium text-foreground truncate">{loan.bookTitle}</p>
                          <p className="text-xs text-muted-foreground">{loan.bookAuthor}</p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground">{formatDate(loan.borrowDate)}</td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground">{formatDate(loan.dueDate)}</td>
                        <td className="px-5 py-3.5">
                          {loan.status === "returned"
                            ? <span className="text-xs text-muted-foreground">Selesai</span>
                            : dLeft < 0
                              ? <span className="flex items-center gap-1 text-xs font-semibold text-red-600"><AlertTriangle size={11} />{Math.abs(dLeft)} hari terlambat</span>
                              : <span className="flex items-center gap-1 text-xs font-semibold text-amber-600"><Clock size={11} />{dLeft} hari lagi</span>}
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge status={loan.status} /></td>
                        <td className="px-5 py-3.5 font-semibold">
                          <span className={fine > 0 ? "text-red-600" : "text-muted-foreground"}>
                            {fine > 0 ? formatRupiah(fine) : "–"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1 flex-wrap">
                            {loan.status === "pending" && (
                              <Button size="sm" variant="outline"
                                className="h-7 gap-1 text-xs text-green-700 border-green-200 hover:bg-green-50"
                                onClick={() => handleApprove(loan.id)}>
                                <CheckCircle size={11} /> Setuju
                              </Button>
                            )}
                            {(loan.status === "active" || loan.status === "overdue") && (
                              <Button size="sm" variant="outline"
                                className="h-7 gap-1 text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
                                onClick={() => handleReturn(loan.id)}>
                                <RefreshCcw size={11} /> Kembali
                              </Button>
                            )}
                            <Button size="sm" variant="ghost"
                              className="h-7 text-xs text-muted-foreground hover:bg-muted"
                              onClick={() => setDetail(loan)}>
                              Detail
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Tarif Denda */}
      <Modal isOpen={fineModal} onClose={() => setFineModal(false)} title="Pengaturan Tarif Denda" size="sm">
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Tarif denda berlaku untuk semua peminjaman yang belum dikembalikan.
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tarif per Hari (Rp)</label>
            <input type="number" value={newRate} onChange={e => setNewRate(Number(e.target.value))} min={0}
              className="w-full rounded-lg border border-input bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            <p className="mt-1 text-xs text-muted-foreground">Saat ini: {formatRupiah(fineConfig.pricePerDay)}/hari</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setFineModal(false)}>Batal</Button>
            <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={saveFineRate}>Simpan</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Detail */}
      <Modal isOpen={!!detailLoan} onClose={() => setDetail(null)} title="Detail Peminjaman" size="sm">
        {detailLoan && (
          <div className="space-y-2 mt-1">
            {[
              ["Peminjam",       `${detailLoan.userName} (${detailLoan.userClass})`],
              ["Buku",           detailLoan.bookTitle],
              ["Penulis",        detailLoan.bookAuthor],
              ["Tgl Pinjam",     formatDate(detailLoan.borrowDate)],
              ["Batas Kembali",  formatDate(detailLoan.dueDate)],
              ["Tgl Kembali",    detailLoan.returnDate ? formatDate(detailLoan.returnDate) : "–"],
              ["Total Denda",    formatRupiah(calculateFine(detailLoan.dueDate, detailLoan.returnDate, fineConfig.pricePerDay))],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-border py-2">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={detailLoan.status} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}