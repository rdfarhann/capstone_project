"use client";
// app/dashboard/user/books/page.tsx — Katalog Buku
import { useState, useMemo } from "react";
import { Search, Filter, BookOpen, CheckCircle, Clock, X } from "lucide-react";
import { UserNavbar } from "@/components/user/Navbar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { mockBooks } from "@/lib/mockData";
import type { Book } from "@/types";

const CATEGORIES = ["Semua","Teknologi","Akuntansi","Bahasa","Matematika","Ekonomi","Bisnis","Sains"];

export default function UserBooksPage() {
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("Semua");
  const [cart, setCart]             = useState<string[]>([]);
  const [confirmBook, setConfirm]   = useState<Book | null>(null);
  const [successMsg, setSuccess]    = useState<string | null>(null);

  const filtered = useMemo(() =>
    mockBooks.filter(b => {
      const q = search.toLowerCase();
      return (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
        && (category === "Semua" || b.category === category);
    }), [search, category]);

  const handleBorrow = (book: Book) => {
    setCart(p => [...p, book.id]);
    setConfirm(null);
    setSuccess(`Pengajuan pinjam "${book.title}" berhasil dikirim! Tunggu konfirmasi admin.`);
    setTimeout(() => setSuccess(null), 5000);
  };

  return (
    <>
      <UserNavbar title="Katalog Buku" subtitle="Temukan dan pinjam buku yang kamu butuhkan" />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-8 space-y-5">

          {/* Success toast */}
          {successMsg && (
            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3.5">
              <CheckCircle size={16} className="text-green-600 shrink-0" />
              <p className="flex-1 text-sm font-medium text-green-800">{successMsg}</p>
              <button onClick={() => setSuccess(null)} className="text-green-600/60 hover:text-green-700">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Search & Filter */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari judul, penulis, atau kategori..."
                className="w-full h-10 rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-all"
              />
            </div>

            {/* Category chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Filter size={11} /> Kategori:
              </span>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3 py-0.5 text-xs font-semibold transition-colors ${
                    category === cat
                      ? "bg-[#1B5E20] text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Result summary */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              Menampilkan{" "}
              <span className="font-semibold text-foreground">{filtered.length}</span> buku
              {category !== "Semua" && <span> — kategori <span className="font-semibold text-[#1B5E20]">{category}</span></span>}
            </p>
            {cart.length > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                <CheckCircle size={13} />
                {cart.length} pengajuan terkirim
              </div>
            )}
          </div>

          {/* Book Grid */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card py-20 text-center">
              <BookOpen size={40} className="mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">Tidak ada buku ditemukan</p>
              <button
                onClick={() => { setSearch(""); setCategory("Semua"); }}
                className="mt-2 text-xs font-semibold text-[#1B5E20] hover:underline"
              >
                Reset filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map(book => {
                const isRequested = cart.includes(book.id);
                const isAvailable = book.availableStock > 0;

                return (
                  <div
                    key={book.id}
                    className="group flex flex-col rounded-2xl border border-border bg-card shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
                  >
                    {/* Cover */}
                    <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-[#1B5E20]/8 to-[#4CAF50]/8">
                      <BookOpen size={36} className="text-[#1B5E20]/20" />
                      <div className="absolute top-2.5 right-2.5">
                        <StatusBadge status={book.status} />
                      </div>
                      {book.availableStock <= 1 && isAvailable && (
                        <div className="absolute bottom-2 left-2.5">
                          <span className="rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            Stok terbatas
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col p-3.5">
                      <span className="mb-1.5 w-fit rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-semibold text-[#1B5E20]">
                        {book.category}
                      </span>
                      <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 flex-1">
                        {book.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground truncate">{book.author}</p>
                      <p className="text-xs text-muted-foreground/60">{book.publisher} · {book.year}</p>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{book.availableStock}/{book.stock} tersedia</span>
                        <span>{book.location}</span>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() => !isRequested && isAvailable && setConfirm(book)}
                        disabled={!isAvailable || isRequested}
                        className={`mt-3 w-full rounded-lg py-1.5 text-xs font-semibold transition-all ${
                          isRequested
                            ? "bg-muted text-muted-foreground cursor-default"
                            : isAvailable
                              ? "bg-[#1B5E20] text-white hover:bg-[#2E7D32] active:scale-95"
                              : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        {isRequested
                          ? <span className="flex items-center justify-center gap-1"><CheckCircle size={11} /> Diajukan</span>
                          : isAvailable
                            ? "Ajukan Pinjam"
                            : <span className="flex items-center justify-center gap-1"><Clock size={11} /> Tidak Tersedia</span>
                        }
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal Konfirmasi */}
      <Modal isOpen={!!confirmBook} onClose={() => setConfirm(null)} title="Konfirmasi Pengajuan Pinjam" size="sm">
        {confirmBook && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9]">
                <BookOpen size={22} className="text-[#1B5E20]" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground leading-snug">{confirmBook.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{confirmBook.author}</p>
                <p className="text-xs text-muted-foreground/60">{confirmBook.publisher} · Rak: {confirmBook.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Stok Tersedia</p>
                <p className="font-bold text-foreground">{confirmBook.availableStock} buku</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Batas Pinjam</p>
                <p className="font-bold text-foreground">14 hari</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              Pengajuan akan dikirim ke admin untuk disetujui. Setelah disetujui, ambil buku langsung di perpustakaan.
            </div>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setConfirm(null)}>
                Batal
              </Button>
              <Button
                className="flex-1 bg-[#1B5E20] hover:bg-[#2E7D32] text-white"
                onClick={() => handleBorrow(confirmBook)}
              >
                Kirim Pengajuan
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}