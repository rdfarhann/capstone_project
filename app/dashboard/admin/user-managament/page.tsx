"use client";
// app/dashboard/admin/user-managament/page.tsx
import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, UserCircle, CheckCircle, XCircle } from "lucide-react";
import { AdminNavbar } from "@/components/admin/Navbar";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/lib/mockData";
import type { LibraryUser } from "@/types";

type UserForm = { nisn:string; name:string; email:string; className:string; phone:string; isActive:boolean };
const EMPTY: UserForm = { nisn:"", name:"", email:"", className:"", phone:"", isActive:true };

export default function AdminUsersPage() {
  const [users, setUsers]           = useState<LibraryUser[]>(mockUsers.filter(u => u.role === "user"));
  const [search, setSearch]         = useState("");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<LibraryUser | null>(null);
  const [form, setForm]             = useState<UserForm>(EMPTY);
  const [deleteId, setDeleteId]     = useState<string | null>(null);

  const filtered = useMemo(() =>
    users.filter(u => {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.nisn.includes(q) || u.className.toLowerCase().includes(q);
    }), [users, search]);

  const openAdd  = () => { setEditTarget(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (u: LibraryUser) => {
    setEditTarget(u);
    setForm({ nisn:u.nisn, name:u.name, email:u.email, className:u.className, phone:u.phone ?? "", isActive:u.isActive });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editTarget) {
      setUsers(p => p.map(u => u.id === editTarget.id ? { ...u, ...form } : u));
    } else {
      setUsers(p => [{ ...form, id:`u${Date.now()}`, role:"user", createdAt:new Date().toISOString().split("T")[0], totalLoans:0, activeLoans:0 }, ...p]);
    }
    setModalOpen(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const FIELDS: { label:string; name:keyof UserForm; placeholder:string }[] = [
    { label:"Nama Lengkap", name:"name",      placeholder:"Nama lengkap siswa" },
    { label:"NISN",         name:"nisn",      placeholder:"10 digit NISN" },
    { label:"Email",        name:"email",     placeholder:"email@smkn1ga.sch.id" },
    { label:"Kelas",        name:"className", placeholder:"X TKJ 1" },
    { label:"No. HP",       name:"phone",     placeholder:"08xxxxxxxxxx" },
  ];

  return (
    <>
      <AdminNavbar title="Manajemen User" subtitle={`${users.length} anggota terdaftar`} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-8 space-y-5">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama, NISN, kelas..."
                className="h-9 w-72 rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <Button onClick={openAdd} size="sm" className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white gap-1.5">
              <Plus size={15} /> Tambah Anggota
            </Button>
          </div>

          {/* Summary chips */}
          <div className="flex gap-2 flex-wrap text-sm">
            {[
              { label:"Total",    val:users.length,                         cls:"bg-muted text-muted-foreground" },
              { label:"Aktif",    val:users.filter(u=>u.isActive).length,   cls:"bg-green-100 text-green-700" },
              { label:"Nonaktif", val:users.filter(u=>!u.isActive).length,  cls:"bg-red-100 text-red-600" },
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
                    {["Anggota","NISN","Kelas","Kontak","Peminjaman","Status","Aksi"].map(h => (
                      <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">
                      <UserCircle size={36} className="mx-auto mb-2 opacity-20" />
                      <p>Tidak ada anggota ditemukan</p>
                    </td></tr>
                  ) : filtered.map(user => (
                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B5E20]/10">
                            <UserCircle size={16} className="text-[#1B5E20]" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{user.nisn}</td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{user.className}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{user.phone ?? "–"}</td>
                      <td className="px-5 py-3.5 text-sm">
                        <span className="font-bold text-foreground">{user.activeLoans}</span>
                        <span className="text-muted-foreground text-xs"> aktif / </span>
                        <span className="text-muted-foreground">{user.totalLoans}</span>
                        <span className="text-muted-foreground text-xs"> total</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {user.isActive
                          ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700"><CheckCircle size={12} /> Aktif</span>
                          : <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground"><XCircle size={12} /> Nonaktif</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600" onClick={() => openEdit(user)}>
                            <Pencil size={13} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50 hover:text-red-500" onClick={() => setDeleteId(user.id)}>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Anggota" : "Tambah Anggota Baru"}>
        <div className="space-y-4">
          {FIELDS.map(f => (
            <div key={f.name}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f.label}</label>
              <input type="text" name={f.name} value={String(form[f.name])} onChange={handleInput} placeholder={f.placeholder}
                className="w-full rounded-lg border border-input bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-lg border border-input bg-muted/20 px-3 py-2.5">
            <input type="checkbox" id="isActive" name="isActive" checked={form.isActive} onChange={handleInput} className="h-4 w-4 accent-[#1B5E20]" />
            <label htmlFor="isActive" className="text-sm font-medium text-foreground">Akun Aktif</label>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button className="flex-1 bg-[#1B5E20] hover:bg-[#2E7D32] text-white" onClick={handleSave}>
              {editTarget ? "Simpan Perubahan" : "Tambah Anggota"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus" size="sm">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <Trash2 size={22} className="text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Hapus anggota ini?</p>
            <p className="mt-1 text-sm text-muted-foreground">Riwayat peminjaman tetap tersimpan.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="destructive" className="flex-1" onClick={() => { setUsers(p => p.filter(u => u.id !== deleteId)); setDeleteId(null); }}>Hapus</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}