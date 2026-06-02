"use client";
// app/dashboard/admin/page.tsx
import { BookOpen, Users, BookMarked, Wallet, AlertTriangle, Clock } from "lucide-react";
import { AdminNavbar } from "@/components/admin/Navbar";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  mockAdminStats, mockLoans, mockBooks,
  loanTrendData, calculateFine, formatRupiah, formatDate,
} from "@/lib/mockData";

export default function AdminDashboardPage() {
  const recentLoans = mockLoans.slice(0, 5);
  const maxTrend    = Math.max(...loanTrendData.map(d => d.loans));
  const CHART_H     = 100;

  return (
    <>
      <AdminNavbar title="Dashboard" subtitle="Selamat datang kembali, Pak Surya" />

      {/* ── Scrollable content area ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-8 space-y-6">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard title="Total Buku"       value={mockAdminStats.totalBooks}                        icon={BookOpen}   color="green" subtitle="Koleksi perpustakaan" />
            <StatCard title="Total Anggota"    value={mockAdminStats.totalUsers}                        icon={Users}      color="blue"  subtitle="Siswa terdaftar" />
            <StatCard title="Sedang Dipinjam"  value={mockAdminStats.activeLoans}                       icon={BookMarked} color="amber" subtitle={`${mockAdminStats.overdueLoans} terlambat`} />
            <StatCard title="Total Denda"      value={formatRupiah(mockAdminStats.totalFinesCollected)} icon={Wallet}     color="red"   subtitle="Terkumpul bulan ini" />
          </div>

          {/* ── Chart + Status ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Bar chart */}
            <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-foreground">Tren Peminjaman</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">6 bulan terakhir</p>
                </div>
                <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  2026
                </span>
              </div>

              <div
                className="flex items-end gap-3"
                style={{ height: `${CHART_H + 36}px` }}
              >
                {loanTrendData.map((d) => {
                  const barH = Math.max(6, Math.round((d.loans / maxTrend) * CHART_H));
                  return (
                    <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-xs font-semibold text-muted-foreground">{d.loans}</span>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-[#1B5E20] to-[#4CAF50] hover:opacity-80 transition-opacity cursor-default"
                        style={{ height: `${barH}px` }}
                      />
                      <span className="text-[11px] text-muted-foreground">{d.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Cepat */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-foreground">Status Cepat</h3>

              <div className="space-y-3">
                {[
                  { label: "Pengajuan Menunggu", value: mockAdminStats.pendingLoans,  Icon: Clock,         color: "text-blue-600",  bg: "bg-blue-50  ring-blue-100"  },
                  { label: "Buku Terlambat",     value: mockAdminStats.overdueLoans,  Icon: AlertTriangle, color: "text-red-600",   bg: "bg-red-50   ring-red-100"   },
                  { label: "Stok Menipis (<2)",  value: mockBooks.filter(b => b.availableStock < 2).length, Icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50 ring-amber-100" },
                ].map(({ label, value, Icon, color, bg }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${bg}`}>
                      <Icon size={15} className={color} />
                    </div>
                    <p className="flex-1 text-sm text-muted-foreground">{label}</p>
                    <span className={`text-lg font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Buku Populer
                </p>
                {mockBooks.filter(b => b.availableStock < b.stock).slice(0, 3).map(book => (
                  <div key={book.id} className="flex items-center gap-2 py-1">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E8F5E9]">
                      <BookOpen size={12} className="text-[#1B5E20]" />
                    </div>
                    <p className="flex-1 text-xs text-muted-foreground truncate">{book.title}</p>
                    <StatusBadge status={book.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tabel Peminjaman Terbaru ── */}
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h3 className="font-bold text-foreground">Peminjaman Terbaru</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Aktivitas sirkulasi buku terkini</p>
              </div>
              <a
                href="/dashboard/admin/loans"
                className="text-xs font-semibold text-[#1B5E20] hover:underline underline-offset-2 shrink-0"
              >
                Lihat Semua →
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Peminjam", "Buku", "Tgl Pinjam", "Batas Kembali", "Status", "Denda"].map(h => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentLoans.map(loan => {
                    const fine = calculateFine(loan.dueDate, loan.returnDate);
                    return (
                      <tr key={loan.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-foreground">{loan.userName}</p>
                          <p className="text-xs text-muted-foreground">{loan.userClass}</p>
                        </td>
                        <td className="px-5 py-3.5 max-w-[180px]">
                          <p className="font-medium text-foreground truncate">{loan.bookTitle}</p>
                          <p className="text-xs text-muted-foreground">{loan.bookAuthor}</p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground">
                          {formatDate(loan.borrowDate)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground">
                          {formatDate(loan.dueDate)}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={loan.status} />
                        </td>
                        <td className="px-5 py-3.5 font-semibold">
                          <span className={fine > 0 ? "text-red-600" : "text-muted-foreground"}>
                            {fine > 0 ? formatRupiah(fine) : "–"}
                          </span>
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
    </>
  );
}