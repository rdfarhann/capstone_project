"use client";
// app/dashboard/admin/books/page.tsx
import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, BookOpen, Filter } from "lucide-react";
import { AdminNavbar } from "@/components/admin/Navbar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { mockBooks } from "@/lib/mockData";
import type { Book } from "@/types";

type BookForm = Omit<Book, "id" | "createdAt" | "status" | "availableStock">;

const EMPTY: BookForm = { title:"", author:"", publisher:"", isbn:"", category:"", stock:1, location:"", year:new Date().getFullYear() };
const CATS = ["Teknologi","Akuntansi","Bahasa","Matematika","Ekonomi","Bisnis","Sains","Lainnya"];

export default function AdminBooksPage() {
  const [books, setBooks]           = useState<Book[]>(mockBooks);
  const [search, setSearch]         = useState("");
  const [cat, setCat]               = useState("Semua");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Book | null>(null);
  const [form, setForm]             = useState<BookForm>(EMPTY);
  const [deleteId, setDeleteId]     = useState<string | null>(null);

  const filtered = useMemo(() =>
    books.filter(b => {
      const q = search.toLowerCase();
      return (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q))
        && (cat === "Semua" || b.category === cat);
    }), [books, search, cat]);

  const openAdd  = () => { setEditTarget(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (b: Book) => {
    setEditTarget(b);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, status, availableStock, ...rest } = b;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editTarget) {
      setBooks(p => p.map(b => b.id === editTarget.id
        ? { ...b, ...form, availableStock: form.stock - (b.stock - b.availableStock) }
        : b));
    } else {
      setBooks(p => [{ ...form, id:`b${Date.now()}`, availableStock:form.stock, status:"available", createdAt:new Date().toISOString().split("T")[0] }, ...p]);
    }
    setModalOpen(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: name === "stock" || name === "year" ? Number(value) : value }));
  };

  const FIELDS: { label:string; name:keyof BookForm; type?:string; placeholder:string }[] = [
    { label:"Judul Buku",   name:"title",     placeholder:"Masukkan judul buku" },
    { label:"Penulis",      name:"author",    placeholder:"Nama penulis" },
    { label:"Penerbit",     name:"publisher", placeholder:"Nama penerbit" },
    { label:"ISBN",         name:"isbn",      placeholder:"978-xxx-xxx-xxx-x" },
    { label:"Tahun Terbit", name:"year",      type:"number", placeholder:"2024" },
    { label:"Jumlah Stok",  name:"stock",     type:"number", placeholder:"1" },
    { label:"Lokasi/Rak",   name:"location",  placeholder:"Rak A-01" },
  ];

  return (
    <>
      <AdminNavbar title="Manajemen Buku" subtitle={`${books.length} buku terdaftar`} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-8 space-y-5">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Cari judul, penulis, ISBN..."
                  className="h-9 w-64 rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div className="relative">
                <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select value={cat} onChange={e => setCat(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer">
                  <option>Semua</option>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <Button onClick={openAdd} size="sm" className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white gap-1.5">
              <Plus size={15} /> Tambah Buku
            </Button>
          </div>

          {/* Summary */}
          <div className="flex gap-2 flex-wrap text-sm">
            {[
              { label:"Total",     val: books.length,                                    cls:"bg-muted text-muted-foreground" },
              { label:"Tersedia",  val: books.filter(b=>b.status==="available").length,  cls:"bg-green-100 text-green-700" },
              { label:"Dipinjam",  val: books.filter(b=>b.status==="borrowed").length,   cls:"bg-amber-100 text-amber-700" },
              { label:"Ditampilkan",val:filtered.length,                                 cls:"bg-blue-100 text-blue-700" },
            ].map(({ label, val, cls }) => (
              <span key={label} className={`rounded-full px-3 py-0.5 text-xs font-semibold ${cls}`}>
                {label}: {val}
              </span>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Buku","Penerbit","ISBN","Kategori","Stok","Lokasi","Status","Aksi"].map(h => (
                      <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="px-5 py-16 text-center text-muted-foreground">
                      <BookOpen size={36} className="mx-auto mb-2 opacity-20" />
                      <p>Tidak ada buku ditemukan</p>
                    </td></tr>
                  ) : filtered.map(book => (
                    <tr key={book.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F5E9]">
                            <BookOpen size={14} className="text-[#1B5E20]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground max-w-[160px] truncate">{book.title}</p>
                            <p className="text-xs text-muted-foreground">{book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground">{book.publisher}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{book.isbn}</td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{book.category}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm">
                        <span className="font-bold text-foreground">{book.availableStock}</span>
                        <span className="text-muted-foreground">/{book.stock}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{book.location}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={book.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600" onClick={() => openEdit(book)}>
                            <Pencil size={13} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50 hover:text-red-500" onClick={() => setDeleteId(book.id)}>
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Tambah/Edit */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Buku" : "Tambah Buku Baru"}>
        <div className="space-y-4">
          {FIELDS.map(f => (
            <div key={f.name}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f.label}</label>
              <input type={f.type ?? "text"} name={f.name} value={String(form[f.name])} onChange={handleInput} placeholder={f.placeholder}
                className="w-full rounded-lg border border-input bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          ))}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kategori</label>
            <select name="category" value={form.category} onChange={handleInput}
              className="w-full rounded-lg border border-input bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Pilih kategori</option>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button className="flex-1 bg-[#1B5E20] hover:bg-[#2E7D32] text-white" onClick={handleSave}>
              {editTarget ? "Simpan Perubahan" : "Tambah Buku"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Hapus */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus" size="sm">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <Trash2 size={22} className="text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Hapus buku ini?</p>
            <p className="mt-1 text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="destructive" className="flex-1" onClick={() => { setBooks(p => p.filter(b => b.id !== deleteId)); setDeleteId(null); }}>
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}