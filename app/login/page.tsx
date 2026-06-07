// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, AlertTriangle, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const h = "var(--font-heading)";
  const b = "var(--font-body)";

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
    <div style={{ minHeight: "100vh", display: "flex", position: "relative", overflow: "hidden" }}>

      {/* ── Background foto sekolah ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src="/background_sekolah.png"
          alt="SMKN 1 Gunung Agung"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
        {/* Overlay gradient hijau gelap */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(27,94,32,0.92) 0%, rgba(27,94,32,0.75) 40%, rgba(0,0,0,0.65) 100%)",
        }} />
        {/* Noise texture overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* ── Aksen garis atas (kuning, sama dgn header) ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "3px", background: "#F9A825", zIndex: 10,
      }} />

      {/* ── Kiri: branding besar (desktop only) ── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "60px 64px",
        position: "relative", zIndex: 1,
      }} className="login-left">
        <div style={{ maxWidth: "440px" }}>
          {/* Logo + nama sekolah */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "16px",
              overflow: "hidden", flexShrink: 0,
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Image
                src="/logo.png"
                alt="Logo SMKN 1 Gunung Agung"
                width={64}
                height={64}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                priority
              />
            </div>
            <div>
              <div style={{
                fontFamily: h, fontWeight: 700, fontSize: "13px",
                color: "rgba(255,255,255,0.65)", letterSpacing: "0.08em",
                textTransform: "uppercase", marginBottom: "2px",
              }}>
                SMK Negeri 1 Gunung Agung
              </div>
              <div style={{
                fontFamily: h, fontWeight: 800, fontSize: "22px",
                color: "#fff", lineHeight: 1.15, letterSpacing: "-0.01em",
              }}>
                Perpustakaan Digital
              </div>
            </div>
          </div>

          {/* Tagline */}
          <h1 style={{
            fontFamily: h, fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 44px)",
            color: "#fff", lineHeight: 1.15,
            letterSpacing: "-0.02em", marginBottom: "20px",
          }}>
            Baca, Pinjam &<br />
            <span style={{ color: "#F9A825" }}>Kelola Buku</span>
            <br />dengan Mudah
          </h1>

          <p style={{
            fontFamily: b, fontSize: "15px", lineHeight: 1.7,
            color: "rgba(255,255,255,0.70)", maxWidth: "360px",
          }}>
            Akses ribuan koleksi buku perpustakaan secara digital. Cek ketersediaan, ajukan peminjaman, dan pantau status pengembalian dari mana saja.
          </p>

        </div>
      </div>

      {/* ── Kanan: Form login ── */}
      <div style={{
        width: "100%", maxWidth: "460px", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 32px", position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.97)",
          borderRadius: "20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}>

          {/* Card header strip */}
          <div style={{
            background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)",
            padding: "24px 28px 20px",
            borderBottom: "3px solid #F9A825",
          }}>
            {/* Logo kecil untuk mobile */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                overflow: "hidden", flexShrink: 0,
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <div>
                <div style={{
                  fontFamily: h, fontWeight: 700, fontSize: "15px",
                  color: "#fff", lineHeight: 1.2,
                }}>
                  Portal Perpustakaan
                </div>
                <div style={{
                  fontFamily: b, fontSize: "11px",
                  color: "rgba(255,255,255,0.60)", marginTop: "1px",
                }}>
                  SMKN 1 Gunung Agung
                </div>
              </div>
            </div>
          </div>

          {/* Form body */}
          <div style={{ padding: "28px" }}>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{
                fontFamily: h, fontWeight: 700, fontSize: "20px",
                color: "#1B3A20", marginBottom: "4px",
              }}>
                Selamat Datang
              </h2>
              <p style={{ fontFamily: b, fontSize: "13px", color: "#6B7280" }}>
                Masuk menggunakan NISN atau email kamu
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Error */}
              {error && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px 14px",
                  backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
                  borderRadius: "10px",
                  fontFamily: b, fontSize: "13px", color: "#DC2626",
                }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  {error}
                </div>
              )}

              {/* NISN / Email */}
              <div>
                <label style={{
                  display: "block", fontFamily: h, fontWeight: 600,
                  fontSize: "13px", color: "#374151", marginBottom: "6px",
                }}>
                  NISN atau Email
                </label>
                <input
                  type="text"
                  value={form.identifier}
                  onChange={(e) => set("identifier", e.target.value)}
                  placeholder="0012345678 atau nama@smkn1ga.sch.id"
                  autoComplete="username"
                  disabled={loading}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    border: "1.5px solid #E5E7EB", borderRadius: "10px",
                    padding: "11px 14px",
                    fontFamily: b, fontSize: "14px", color: "#111827",
                    outline: "none", transition: "border-color 0.2s",
                    backgroundColor: loading ? "#F9FAFB" : "#fff",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{
                  display: "block", fontFamily: h, fontWeight: 600,
                  fontSize: "13px", color: "#374151", marginBottom: "6px",
                }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    disabled={loading}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      border: "1.5px solid #E5E7EB", borderRadius: "10px",
                      padding: "11px 44px 11px 14px",
                      fontFamily: b, fontSize: "14px", color: "#111827",
                      outline: "none", transition: "border-color 0.2s",
                      backgroundColor: loading ? "#F9FAFB" : "#fff",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    style={{
                      position: "absolute", right: "12px", top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none",
                      cursor: "pointer", color: "#9CA3AF", padding: "2px",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", marginTop: "4px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  padding: "13px",
                  backgroundColor: loading ? "#4CAF50" : "#1B5E20",
                  color: "#fff", border: "none", borderRadius: "10px",
                  fontFamily: h, fontWeight: 700, fontSize: "14px",
                  letterSpacing: "0.02em", cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 14px rgba(27,94,32,0.35)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2E7D32";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(27,94,32,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1B5E20";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(27,94,32,0.35)";
                  }
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <LogIn size={15} />
                    Masuk Portal
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p style={{
              textAlign: "center", fontFamily: b,
              fontSize: "12px", color: "#9CA3AF", marginTop: "20px", lineHeight: 1.6,
            }}>
              Gunakan NISN dan password yang diberikan administrator.
              <br />
              Hubungi petugas perpustakaan jika lupa password.
            </p>
          </div>
        </div>
      </div>

      {/* ── Responsive mobile ── */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .login-left { display: none !important; }
        }
      `}</style>
    </div>
  );
}