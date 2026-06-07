"use client";
// app/dashboard/user/books/page.tsx — Katalog Buku
import { useState, useMemo } from "react";
import {
  Search, Filter, BookOpen, CheckCircle,
  Clock, X, AlertTriangle, Loader2, RefreshCw,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useBooks, apiCall, type BookRow } from "@/hooks/useApi";

const CATEGORIES = [
  "Semua", "Teknologi", "Akuntansi", "Bahasa",
  "Matematika", "Ekonomi", "Bisnis", "Sains",
];

// ── Modal Konfirmasi Pinjam ───────────────────────────────────
function BorrowModal({
  book,
  onClose,
  onConfirm,
  loading,
}: {
  book: BookRow;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-base font-semibold text-gray-800">Konfirmasi Pengajuan Pinjam</h2>
          <button onClick={onClose} disabled={loading} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Info buku */}
          <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9]">
              <BookOpen className="w-6 h-6 text-[#2E7D32]" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-800 leading-snug">{book.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
              <p className="text-xs text-gray-400">{book.publisher} · Rak: {book.location}</p>
            </div>
          </div>

          {/* Detail */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-400">Stok Tersedia</p>
              <p className="font-bold text-gray-800 mt-0.5">{book.available_stock} buku</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-400">Batas Pinjam</p>
              <p className="font-bold text-gray-800 mt-0.5">14 hari</p>
            </div>
          </div>

          {/* Catatan */}
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
            Pengajuan akan dikirim ke admin untuk disetujui. Setelah disetujui, ambil buku langsung di perpustakaan.
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
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
              : "Kirim Pengajuan"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function UserBooksPage() {
  const [search, setSearch]         = useState("");
  const [debouncedSearch, setDebounced] = useState("");
  const [category, setCategory]     = useState("Semua");
  const [confirmBook, setConfirm]   = useState<BookRow | null>(null);
  const [borrowing, setBorrowing]   = useState(false);
  const [successMsg, setSuccess]    = useState<string | null>(null);
  const [errorMsg, setError]        = useState<string | null>(null);
  const [borrowedIds, setBorrowedIds] = useState<number[]>([]);

  // Debounce search
  const handleSearch = (val: string) => {
    setSearch(val);
    const t = setTimeout(() => setDebounced(val), 400);
    return () => clearTimeout(t);
  };

  const { data: books, loading, error, refetch } = useBooks({
    search: debouncedSearch || undefined,
    category: category !== "Semua" ? category : undefined,
  });

  const handleBorrow = async () => {
    if (!confirmBook) return;
    setBorrowing(true);
    setError(null);

    const res = await apiCall("/api/loans", "POST", {
      book_id: confirmBook.id,
    });

    setBorrowing(false);

    if (!res.ok) {
      setError(res.message ?? "Gagal mengajukan peminjaman");
      setConfirm(null);
      return;
    }

    setBorrowedIds((p) => [...p, confirmBook.id]);
    setConfirm(null);
    setSuccess(`Pengajuan pinjam "${confirmBook.title}" berhasil dikirim! Tunggu konfirmasi admin.`);
    refetch();
    setTimeout(() => setSuccess(null), 5000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="flex items-center gap-3 px-6 py-4 border-b bg-white flex-shrink-0">
        <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
        <Separator orientation="vertical" className="h-5" />
        <BookOpen className="w-4 h-4 text-[#2E7D32]" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-800">Katalog Buku</h1>
          <p className="text-xs text-gray-400">Temukan dan pinjam buku yang kamu butuhkan</p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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

        {/* Search & Filter */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm mb-5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari judul, penulis, atau ISBN..."
              className="w-full h-10 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] transition-all"
            />
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
              <Filter className="w-3 h-3" /> Kategori:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3 py-0.5 text-xs font-semibold transition-colors ${
                  category === cat
                    ? "bg-[#2E7D32] text-white"
                    : "bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Result summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Menampilkan{" "}
            <span className="font-semibold text-gray-800">{loading ? "—" : (books?.length ?? 0)}</span> buku
            {category !== "Semua" && (
              <span> — kategori <span className="font-semibold text-[#2E7D32]">{category}</span></span>
            )}
          </p>
          {borrowedIds.length > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
              <CheckCircle className="w-3.5 h-3.5" />
              {borrowedIds.length} pengajuan terkirim
            </div>
          )}
        </div>

        {/* Book Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-white overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-200" />
                <div className="p-3.5 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-7 bg-gray-200 rounded-lg mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : !books?.length ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Tidak ada buku ditemukan</p>
            <button
              onClick={() => { setSearch(""); setCategory("Semua"); setDebounced(""); }}
              className="mt-2 text-xs font-semibold text-[#2E7D32] hover:underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {books.map((book) => {
              const isRequested = borrowedIds.includes(book.id);
              const isAvailable = book.available_stock > 0 && book.status === "available";

              return (
                <div
                  key={book.id}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
                >
                  {/* Cover */}
                  <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-[#2E7D32]/8 to-[#4CAF50]/8">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-9 h-9 text-[#2E7D32]/20" />
                    )}
                    {/* Status badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {isAvailable ? "Tersedia" : "Tidak Tersedia"}
                      </span>
                    </div>
                    {book.available_stock === 1 && isAvailable && (
                      <div className="absolute bottom-2 left-2.5">
                        <span className="rounded-full border border-yellow-200 bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">
                          Stok terbatas
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-3.5">
                    <span className="mb-1.5 w-fit rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-semibold text-[#2E7D32]">
                      {book.category_name}
                    </span>
                    <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 flex-1">
                      {book.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400 truncate">{book.author}</p>
                    <p className="text-xs text-gray-300">{book.publisher} · {book.year}</p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                      <span>{book.available_stock}/{book.stock} tersedia</span>
                      <span>{book.location}</span>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => !isRequested && isAvailable && setConfirm(book)}
                      disabled={!isAvailable || isRequested}
                      className={`mt-3 w-full rounded-lg py-1.5 text-xs font-semibold transition-all ${
                        isRequested
                          ? "bg-gray-100 text-gray-400 cursor-default"
                          : isAvailable
                            ? "bg-[#2E7D32] text-white hover:bg-[#1B5E20] active:scale-95"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isRequested ? (
                        <span className="flex items-center justify-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Diajukan
                        </span>
                      ) : isAvailable ? (
                        "Ajukan Pinjam"
                      ) : (
                        <span className="flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" /> Tidak Tersedia
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Konfirmasi */}
      {confirmBook && (
        <BorrowModal
          book={confirmBook}
          onClose={() => !borrowing && setConfirm(null)}
          onConfirm={handleBorrow}
          loading={borrowing}
        />
      )}
    </div>
  );
}