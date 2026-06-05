// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.identifier || !form.password) {
      setError("NISN/Email dan password wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message ?? "Login gagal");
        return;
      }
      // Redirect berdasarkan role
      if (json.data.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#2E7D32]/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#1565C0]/6 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-[#2E7D32]/5 blur-2xl" />
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2E7D32" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 overflow-hidden">
          {/* Header strip */}
          <div className="bg-[#2E7D32] px-8 pt-8 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 rounded-xl p-2.5">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium tracking-widest uppercase">
                  Perpustakaan
                </p>
                <h1 className="text-white font-bold text-lg leading-tight">
                  SMK Negeri 1 Gunung Agung
                </h1>
              </div>
            </div>
            <p className="text-white/60 text-sm">
              Masuk ke sistem manajemen perpustakaan
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* NISN / Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  NISN atau Email
                </label>
                <input
                  type="text"
                  value={form.identifier}
                  onChange={(e) => set("identifier", e.target.value)}
                  placeholder="Contoh: 0012345678 atau nama@smkn1ga.sch.id"
                  autoComplete="username"
                  disabled={loading}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32] transition-all disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32] transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] active:bg-[#1B5E20] text-white font-semibold rounded-xl py-3 text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-[#2E7D32]/30 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            {/* Footer info */}
            <p className="text-center text-xs text-gray-400 mt-6">
              Gunakan NISN dan password yang diberikan oleh administrator.
              <br />
              Hubungi petugas perpustakaan jika lupa password.
            </p>
          </div>
        </div>

        {/* Bottom label */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Sistem Manajemen Perpustakaan · SMK Negeri 1 Gunung Agung
        </p>
      </div>
    </div>
  );
}