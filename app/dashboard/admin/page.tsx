// app/dashboard/admin/page.tsx
"use client";

import { useState } from "react";
import { useStats } from "@/hooks/useApi";
import {
  BookOpen, Users, BookMarked, AlertTriangle,
  Clock, TrendingUp, RefreshCw, DollarSign,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// ── Format Rupiah ────────────────────────────────────────────
function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, color, sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`rounded-lg p-3 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── Bar Chart (Tailwind) ─────────────────────────────────────
function TrendChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-[120px] w-full pt-2">
      {data.map((d) => {
        const pct = Math.round((d.count / max) * 100);
        const px = Math.max(Math.round((pct / 100) * 120), 4);
        return (
          <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-[10px] text-gray-500 font-medium">{d.count}</span>
            <div
              className="w-full rounded-t-md bg-[#2E7D32] opacity-80 hover:opacity-100 transition-opacity"
              style={{ height: px }}
              title={`${d.date}: ${d.count} peminjaman`}
            />
            <span className="text-[10px] text-gray-400">{d.date}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data, loading, error, refetch } = useStats();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const s = data?.stats;
  const trend = data?.trend ?? [];

  // Isi kosong untuk chart bila data belum cukup (7 hari)
  const chartData = (() => {
    if (!trend.length) return [];
    const map = new Map(trend.map((t) => [t.date, t.count]));
    const result: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      result.push({ date: label, count: map.get(label) ?? 0 });
    }
    return result;
  })();

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="flex items-center gap-3 px-6 py-4 border-b bg-white flex-shrink-0">
        <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
        <Separator orientation="vertical" className="h-5" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-800">Dashboard Admin</h1>
          <p className="text-xs text-gray-400">Ringkasan aktivitas perpustakaan</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="flex items-center gap-2 text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-[#F9FBF9]">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            Gagal memuat data: {error}. Pastikan database MySQL berjalan.
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Buku"
            value={loading ? "—" : (s?.totalBooks ?? 0)}
            icon={BookOpen}
            color="bg-[#2E7D32]"
            sub={`${s?.booksOutOfStock ?? 0} stok habis`}
          />
          <StatCard
            label="Total Anggota"
            value={loading ? "—" : (s?.totalUsers ?? 0)}
            icon={Users}
            color="bg-[#1565C0]"
            sub="Siswa terdaftar"
          />
          <StatCard
            label="Dipinjam Aktif"
            value={loading ? "—" : (s?.activeLoans ?? 0)}
            icon={BookMarked}
            color="bg-[#E65100]"
            sub={`${s?.pendingLoans ?? 0} menunggu approval`}
          />
          <StatCard
            label="Total Denda"
            value={loading ? "—" : formatRupiah(s?.totalFinesCollected ?? 0)}
            icon={DollarSign}
            color="bg-[#AD1457]"
            sub="Terkumpul"
          />
        </div>

        {/* Row: Chart + Overdue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Tren Peminjaman */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
                  Tren Peminjaman
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">7 hari terakhir</p>
              </div>
            </div>
            {loading ? (
              <div className="h-[120px] flex items-center justify-center text-sm text-gray-400">
                Memuat data...
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-[120px] flex items-center justify-center text-sm text-gray-400">
                Belum ada data peminjaman
              </div>
            ) : (
              <TrendChart data={chartData} />
            )}
          </div>

          {/* Status Ringkas */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E65100]" />
              Status Saat Ini
            </h2>
            <div className="space-y-3">
              {[
                { label: "Dipinjam aktif", value: s?.activeLoans ?? 0, color: "bg-[#2E7D32]" },
                { label: "Menunggu approval", value: s?.pendingLoans ?? 0, color: "bg-[#F9A825]" },
                { label: "Terlambat", value: s?.overdueLoans ?? 0, color: "bg-[#C62828]" },
                { label: "Stok habis", value: s?.booksOutOfStock ?? 0, color: "bg-[#546E7A]" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`} />
                  <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {loading ? "—" : item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/dashboard/admin/books", label: "Kelola Buku", desc: "Tambah, edit, hapus buku", icon: BookOpen, color: "bg-[#E8F5E9] text-[#2E7D32]" },
            { href: "/dashboard/admin/user-managament", label: "Kelola Anggota", desc: "Manajemen data siswa", icon: Users, color: "bg-[#E3F2FD] text-[#1565C0]" },
            { href: "/dashboard/admin/loans", label: "Peminjaman & Denda", desc: "Approve & proses pengembalian", icon: BookMarked, color: "bg-[#FFF3E0] text-[#E65100]" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 bg-white rounded-xl border p-4 hover:shadow-md transition-shadow group"
            >
              <div className={`rounded-lg p-2.5 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-800 group-hover:text-[#2E7D32] transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}