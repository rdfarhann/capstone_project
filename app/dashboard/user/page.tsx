"use client";
// app/dashboard/user/page.tsx
// Beranda siswa — menampilkan info peminjaman aktif, notifikasi, & katalog buku

import { useState } from "react";
import { useLoans, useNotifications, useBooks, type BookRow } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen, BookMarked, Bell, AlertTriangle,
  Clock, Search, ChevronRight,
} from "lucide-react";
import Link from "next/link";

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

// ── Book Card ────────────────────────────────────────────────
function BookCard({ book }: { book: BookRow }) {
  const available = book.available_stock > 0 && book.status === "available";
  return (
    <div className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow flex gap-3">
      <div className="w-12 h-16 bg-[#E8F5E9] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <BookOpen className="w-5 h-5 text-[#2E7D32] opacity-60" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 text-sm line-clamp-2 leading-snug">{book.title}</p>
        <p className="text-xs text-gray-400 mt-1">{book.author}</p>
        <p className="text-xs text-gray-400">{book.category_name} · {book.year}</p>
        <span className={`inline-flex mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
          available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
        }`}>
          {available ? `Tersedia (${book.available_stock})` : "Tidak Tersedia"}
        </span>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function UserHomePage() {
  const [search, setSearch]           = useState("");
  const [debouncedSearch, setDebounced] = useState("");

  // Ambil data user dari session (cookie JWT)
  const { user, loading: authLoading } = useAuth();
  const userId = String(user?.id ?? "");
  const userName = user?.name?.split(" ")[0] ?? "Siswa";

  const { data: myLoans, loading: loansLoading } = useLoans(
    userId ? { userId, status: "active" } : undefined
  );

  const { data: notifications, loading: notifLoading } = useNotifications(
    userId, true
  );

  const { data: books, loading: booksLoading } = useBooks({
    search: debouncedSearch || undefined,
  });

  const handleSearch = (val: string) => {
    setSearch(val);
    const t = setTimeout(() => setDebounced(val), 400);
    return () => clearTimeout(t);
  };

  const activeLoans  = myLoans ?? [];
  const overdueLoans = activeLoans.filter((l) => l.days_overdue > 0);
  const unreadNotifs = notifications ?? [];

  // Loading state saat session belum siap
  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <BookOpen className="w-8 h-8 mx-auto mb-2 animate-pulse opacity-40" />
          <p className="text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      
      {/* ── Topbar / Header Baru dengan Sidebar Trigger ── */}
      <header className="flex items-center gap-3 px-6 py-4 border-b bg-white flex-shrink-0">
        <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
        <Separator orientation="vertical" className="h-5" />
        <BookOpen className="w-4 h-4 text-[#2E7D32]" />
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-gray-800">Beranda Beraktivitas</h1>
          <p className="text-xs text-gray-400">Pusat informasi dan pencarian katalog siswa</p>
        </div>
      </header>

      {/* Konten Utama Terbungkus Area Scrollable */}
      <main className="flex-1 overflow-y-auto p-6 bg-[#F9FBF9]">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Greeting */}
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Halo, {userName} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Selamat datang di perpustakaan digital SMKN 1 Gunung Agung
            </p>
            {user?.class_name && (
              <p className="text-xs text-gray-400 mt-0.5">Kelas {user.class_name}</p>
            )}
          </div>

          {/* Alert overdue */}
          {overdueLoans.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-700">
                  Kamu memiliki {overdueLoans.length} buku yang terlambat dikembalikan!
                </p>
                <p className="text-xs text-red-500 mt-0.5">
                  Total denda: {formatRupiah(overdueLoans.reduce((sum, l) => sum + l.fine_amount, 0))}
                </p>
              </div>
              <Link
                href="/dashboard/user/history"
                className="text-xs text-red-600 font-medium hover:underline flex-shrink-0"
              >
                Lihat →
              </Link>
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Sedang Dipinjam",
                value: loansLoading ? "—" : activeLoans.length,
                icon: BookMarked,
                color: "bg-[#E8F5E9] text-[#2E7D32]",
              },
              {
                label: "Terlambat",
                value: loansLoading ? "—" : overdueLoans.length,
                icon: Clock,
                color: overdueLoans.length > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400",
              },
              {
                label: "Notifikasi Baru",
                value: notifLoading ? "—" : unreadNotifs.length,
                icon: Bell,
                color: unreadNotifs.length > 0 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400",
              },
            ].map((s) => (
              <div key={s.label} className="bg-white border rounded-xl p-4 text-center">
                <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-2`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Peminjaman Aktif */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-[#2E7D32]" />
                Peminjaman Aktif
              </h2>
              <Link
                href="/dashboard/user/history"
                className="text-xs text-[#2E7D32] hover:underline flex items-center gap-1"
              >
                Lihat semua <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {loansLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : activeLoans.length === 0 ? (
              <div className="bg-white border rounded-xl p-8 text-center text-gray-400">
                <BookMarked className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Kamu belum meminjam buku apapun</p>
                <Link
                  href="/dashboard/user/books"
                  className="mt-2 inline-block text-xs font-semibold text-[#2E7D32] hover:underline"
                >
                  Cari buku →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {activeLoans.slice(0, 3).map((loan) => (
                  <div key={loan.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E8F5E9] rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-[#2E7D32]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm line-clamp-1">{loan.book_title}</p>
                      <p className="text-xs text-gray-400">{loan.book_author}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-medium ${
                        loan.days_overdue > 0 ? "text-red-600" : "text-gray-600"
                      }`}>
                        {loan.days_overdue > 0
                          ? `Terlambat ${loan.days_overdue}h`
                          : `${loan.days_remaining}h lagi`}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(loan.due_date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Katalog Buku */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2E7D32]" />
              Cari Buku
            </h2>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cari judul, penulis, atau ISBN..."
                className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
              />
            </div>
            {booksLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : !books?.length ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                {debouncedSearch
                  ? `Tidak ada buku untuk "${debouncedSearch}"`
                  : "Tidak ada buku tersedia"}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {books.slice(0, 8).map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
            {books && books.length > 8 && (
              <div className="text-center mt-4">
                <Link
                  href="/dashboard/user/books"
                  className="text-sm text-[#2E7D32] font-medium hover:underline"
                >
                  Lihat semua {books.length} buku →
                </Link>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}