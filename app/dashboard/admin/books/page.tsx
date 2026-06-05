// app/dashboard/admin/books/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useBooks, apiCall, type BookRow } from "@/hooks/useApi";
import {
  Plus, Search, Pencil, Trash2, BookOpen, X, AlertTriangle,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// ── Helpers ──────────────────────────────────────────────────
const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  available:   { label: "Tersedia",    cls: "bg-green-100 text-green-800" },
  borrowed:    { label: "Dipinjam",    cls: "bg-orange-100 text-orange-800" },
  maintenance: { label: "Maintenance", cls: "bg-gray-100 text-gray-600" },
};

const EMPTY_FORM = {
  title: "", author: "", publisher: "", isbn: "",
  category_id: "", stock: "", location: "", year: String(new Date().getFullYear()),
};

// ── Modal Tambah/Edit ────────────────────────────────────────
function BookModal({
  initial, onClose, onSaved,
}: {
  initial?: BookRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title, author: initial.author, publisher: initial.publisher,
          isbn: initial.isbn, category_id: String(initial.category_id),
          stock: String(initial.stock), location: initial.location,
          year: String(initial.year),
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    const required = ["title", "author", "publisher", "isbn", "category_id", "stock", "location", "year"];
    if (required.some((k) => !form[k as keyof typeof form])) {
      setErr("Semua field wajib diisi"); return;
    }
    setSaving(true); setErr("");
    const body = { ...form, stock: Number(form.stock), year: Number(form.year), category_id: Number(form.category_id) };
    const res = initial
      ? await apiCall(`/api/books?id=${initial.id}`, "PUT", body)
      : await apiCall("/api/books", "POST", body);
    setSaving(false);
    if (!res.ok) { setErr(res.message ?? "Gagal menyimpan"); return; }
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-base font-semibold text-gray-800">
            {initial ? "Edit Buku" : "Tambah Buku Baru"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          {err && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />{err}
            </div>
          )}
          {[
            { label: "Judul Buku", key: "title", placeholder: "Contoh: Pemrograman Web" },
            { label: "Penulis", key: "author", placeholder: "Nama penulis" },
            { label: "Penerbit", key: "publisher", placeholder: "Nama penerbit" },
            { label: "ISBN", key: "isbn", placeholder: "978-xxx-xxx-xxx-x" },
            { label: "Lokasi/Rak", key: "location", placeholder: "Contoh: Rak A-01" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                value={form[f.key as keyof typeof form]}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
              />
            </div>
          ))}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Kategori</label>
              <input
                type="number" value={form.category_id}
                onChange={(e) => set("category_id", e.target.value)}
                placeholder="1"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
              <input
                type="number" value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="10"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
              <input
                type="number" value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="2024"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button
            onClick={handleSubmit} disabled={saving}
            className="flex-1 bg-[#2E7D32] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#1B5E20] disabled:opacity-60 transition-colors"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function AdminBooksPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editBook, setEditBook] = useState<BookRow | null | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: books, loading, error, refetch } = useBooks({ search: debouncedSearch });

  // Simple debounce
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    const t = setTimeout(() => setDebouncedSearch(val), 400);
    return () => clearTimeout(t);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Nonaktifkan buku ini?")) return;
    setDeletingId(id);
    await apiCall(`/api/books?id=${id}`, "DELETE");
    setDeletingId(null);
    refetch();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="flex items-center gap-3 px-6 py-4 border-b bg-white flex-shrink-0">
        <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
        <Separator orientation="vertical" className="h-5" />
        <BookOpen className="w-4 h-4 text-[#2E7D32]" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-800">Manajemen Buku</h1>
          <p className="text-xs text-gray-400">Kelola koleksi buku perpustakaan</p>
        </div>
        <button
          onClick={() => setEditBook(null)}
          className="flex items-center gap-2 bg-[#2E7D32] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1B5E20] transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Buku
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 bg-[#F9FBF9]">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari judul, penulis, atau ISBN..."
            className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            Gagal memuat data buku: {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F1F8F1] border-b">
                <tr>
                  {["Judul / Penulis", "ISBN", "Kategori", "Stok", "Lokasi", "Status", "Aksi"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !books?.length ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      {debouncedSearch ? `Tidak ada buku untuk "${debouncedSearch}"` : "Belum ada buku terdaftar"}
                    </td>
                  </tr>
                ) : (
                  books.map((book) => {
                    const st = STATUS_LABEL[book.status] ?? STATUS_LABEL.available;
                    return (
                      <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 line-clamp-1">{book.title}</p>
                          <p className="text-xs text-gray-400">{book.author} · {book.year}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{book.isbn}</td>
                        <td className="px-4 py-3 text-gray-600">{book.category_name}</td>
                        <td className="px-4 py-3">
                          <span className="font-medium">{book.available_stock}</span>
                          <span className="text-gray-400">/{book.stock}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{book.location}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${st.cls}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditBook(book)}
                              className="p-1.5 text-gray-400 hover:text-[#2E7D32] hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(book.id)}
                              disabled={deletingId === book.id}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {books && (
            <div className="px-4 py-3 border-t text-xs text-gray-400">
              {books.length} buku ditemukan
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {editBook !== undefined && (
        <BookModal
          initial={editBook}
          onClose={() => setEditBook(undefined)}
          onSaved={refetch}
        />
      )}
    </div>
  );
}