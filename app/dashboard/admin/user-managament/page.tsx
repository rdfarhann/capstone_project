// app/dashboard/admin/user-managament/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useUsers, apiCall, type UserRow } from "@/hooks/useApi";
import {
  Users, Search, Plus, Pencil, ToggleLeft,
  ToggleRight, AlertTriangle, X, BookMarked,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// ── Helpers ──────────────────────────────────────────────────
const EMPTY_FORM = {
  nisn: "", name: "", email: "", class_name: "",
  phone: "", role: "user" as "admin" | "user", password: "",
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

// ── User Modal ───────────────────────────────────────────────
function UserModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: UserRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(
    initial
      ? {
          nisn: initial.nisn, name: initial.name, email: initial.email,
          class_name: initial.class_name, phone: initial.phone ?? "",
          role: initial.role, password: "",
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    const required = initial
      ? ["nisn", "name", "email", "class_name"]
      : ["nisn", "name", "email", "class_name", "password"];
    if (required.some((k) => !form[k as keyof typeof form])) {
      setErr("Semua field wajib diisi"); return;
    }
    setSaving(true); setErr("");
    const body = initial ? { ...form } : { ...form };
    const res = initial
      ? await apiCall(`/api/users?id=${initial.id}`, "PUT", body)
      : await apiCall("/api/users", "POST", body);
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
            {initial ? "Edit Anggota" : "Tambah Anggota Baru"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {err && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />{err}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "NISN", key: "nisn", placeholder: "1234567890" },
              { label: "Kelas", key: "class_name", placeholder: "X TKJ 1" },
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
          </div>

          {[
            { label: "Nama Lengkap", key: "name", placeholder: "Nama siswa" },
            { label: "Email", key: "email", placeholder: "siswa@smkn1ga.sch.id", type: "email" },
            { label: "No. HP (opsional)", key: "phone", placeholder: "08xx-xxxx-xxxx" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type ?? "text"}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
              />
            </div>
          ))}

          {!initial && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Min. 8 karakter"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
            >
              <option value="user">Siswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
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
export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editUser, setEditUser] = useState<UserRow | null | undefined>(undefined);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const { data: users, loading, error, refetch } = useUsers({
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
  });

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    const t = setTimeout(() => setDebouncedSearch(val), 400);
    return () => clearTimeout(t);
  }, []);

  const handleToggleActive = async (user: UserRow) => {
    setTogglingId(user.id);
    await apiCall(`/api/users?id=${user.id}`, "PATCH", {
      is_active: user.is_active ? 0 : 1,
    });
    setTogglingId(null);
    refetch();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="flex items-center gap-3 px-6 py-4 border-b bg-white flex-shrink-0">
        <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
        <Separator orientation="vertical" className="h-5" />
        <Users className="w-4 h-4 text-[#2E7D32]" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-800">Manajemen Anggota</h1>
          <p className="text-xs text-gray-400">Kelola data siswa dan admin</p>
        </div>
        <button
          onClick={() => setEditUser(null)}
          className="flex items-center gap-2 bg-[#2E7D32] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1B5E20] transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Anggota
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 bg-[#F9FBF9]">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari nama, NISN, atau email..."
              className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32]"
            />
          </div>
          <div className="flex gap-1">
            {[
              { value: "", label: "Semua" },
              { value: "user", label: "Siswa" },
              { value: "admin", label: "Admin" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setRoleFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  roleFilter === f.value
                    ? "bg-[#2E7D32] text-white"
                    : "bg-white border text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            Gagal memuat data: {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F1F8F1] border-b">
                <tr>
                  {["Anggota", "NISN", "Kelas", "Peminjaman", "Role", "Status", "Aksi"].map((h) => (
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
                ) : !users?.length ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      Tidak ada anggota ditemukan
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{user.nisn}</td>
                      <td className="px-4 py-3 text-gray-600">{user.class_name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-gray-600">
                          <BookMarked className="w-3.5 h-3.5 text-gray-400" />
                          <span>{user.active_loans}</span>
                          <span className="text-gray-300">/</span>
                          <span className="text-gray-400 text-xs">{user.total_loans} total</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {user.role === "admin" ? "Admin" : "Siswa"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {user.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditUser(user)}
                            className="p-1.5 text-gray-400 hover:text-[#2E7D32] hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(user)}
                            disabled={togglingId === user.id}
                            title={user.is_active ? "Nonaktifkan" : "Aktifkan"}
                            className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-40"
                          >
                            {user.is_active
                              ? <ToggleRight className="w-4 h-4 text-[#2E7D32]" />
                              : <ToggleLeft className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {users && (
            <div className="px-4 py-3 border-t text-xs text-gray-400">
              {users.length} anggota ditemukan
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {editUser !== undefined && (
        <UserModal
          initial={editUser}
          onClose={() => setEditUser(undefined)}
          onSaved={refetch}
        />
      )}
    </div>
  );
}