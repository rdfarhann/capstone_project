// app/dashboard/user/page.tsx
// Beranda siswa — menampilkan info peminjaman aktif, notifikasi, & katalog buku
"use client";

import { useState } from "react";
import { useLoans, useNotifications, useBooks, type BookRow } from "@/hooks/useApi";
import {
  BookOpen, BookMarked, Bell, AlertTriangle,
  Clock, Search, ChevronRight,
} from "lucide-react";
import Link from "next/link";

// ── Hardcoded mock session — ganti dengan session nyata jika sudah ada auth ──
const MOCK_USER_ID = "1";
const MOCK_USER_NAME = "Siswa";

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
      <div className="w-12 h-16 bg-[#E8F5E9] rounded-lg flex-shrink-0 flex items-center justify-center">
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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: myLoans, loading: loansLoading } = useLoans({
    userId: MOCK_USER_ID,
    status: "active",
  });

  const { data: notifications, loading: notifLoading } = useNotifications(
    MOCK_USER_ID, true
  );

  const { data: books, loading: booksLoading } = useBooks({
    search: debouncedSearch || undefined,
  });

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout(undefined);
    const t = setTimeout(() => setDebouncedSearch(val), 400);
    return () => clearTimeout(t);
  };

  const activeLoans = myLoans ?? [];
  const overdueLoans = activeLoans.filter((l) => l.days_overdue > 0);
  const unreadNotifs = notifications ?? [];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Greeting */}
        <div>
          <h1 className="text-xl font-bold text-gray-800">Halo, {MOCK_USER_NAME} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Selamat datang di perpustakaan digital SMKN 1 Gunung Agung</p>
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
            <Link href="/dashboard/user/loans" className="text-xs text-red-600 font-medium hover:underline flex-shrink-0">
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
              color: "bg-red-50 text-red-600",
            },
            {
              label: "Notifikasi Baru",
              value: notifLoading ? "—" : unreadNotifs.length,
              icon: Bell,
              color: "bg-blue-50 text-blue-600",
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
            <Link href="/dashboard/user/loans" className="text-xs text-[#2E7D32] hover:underline flex items-center gap-1">
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
                    <p className={`text-xs font-medium ${loan.days_overdue > 0 ? "text-red-600" : "text-gray-600"}`}>
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
              {debouncedSearch ? `Tidak ada buku untuk "${debouncedSearch}"` : "Tidak ada buku tersedia"}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {books.slice(0, 8).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}