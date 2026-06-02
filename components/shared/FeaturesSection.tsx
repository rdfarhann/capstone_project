"use client";

import { useEffect, useRef } from "react";
import LoadingLink from "@/components/shared/LoadingLink";

const features = [
  { icon:"🔍", title:"Katalog Digital",       desc:"Cari dan temukan koleksi buku dengan mudah melalui sistem pencarian katalog digital yang lengkap dan cepat.",                         color:"#2E7D32", bg:"#E8F5E9" },
  { icon:"📖", title:"Peminjaman Online",      desc:"Ajukan peminjaman buku secara online tanpa perlu mengantri. Proses cepat dan mudah langsung dari portal.",                           color:"#1B5E20", bg:"#E8F5E9" },
  { icon:"🔔", title:"Notifikasi Jatuh Tempo", desc:"Dapatkan pengingat otomatis sebelum tanggal pengembalian buku agar tidak terkena denda keterlambatan.",                             color:"#F9A825", bg:"#FFF8E1" },
  { icon:"📊", title:"Riwayat Peminjaman",     desc:"Pantau seluruh riwayat peminjaman dan pengembalian buku Anda dengan laporan yang terstruktur.",                                     color:"#388E3C", bg:"#E8F5E9" },
  { icon:"🎓", title:"Referensi Akademik",     desc:"Akses ribuan referensi ilmiah, jurnal, dan bahan ajar yang relevan dengan program keahlian di SMKN 1 Gunung Agung.",              color:"#1B5E20", bg:"#E8F5E9" },
  { icon:"👤", title:"Portal Anggota",         desc:"Kelola profil keanggotaan, lihat status kartu perpustakaan, dan perbarui data diri dengan mudah melalui portal personal.",          color:"#F9A825", bg:"#FFF8E1" },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const h = "var(--font-heading)";
  const b = "var(--font-body)";

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        (entries[0].target as HTMLElement).querySelectorAll(".feature-card").forEach((item, i) => {
          setTimeout(() => { (item as HTMLElement).style.opacity="1"; (item as HTMLElement).style.transform="translateY(0)"; }, i*80);
        });
        observer.unobserve(entries[0].target);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="koleksi" style={{ padding: "100px 0", backgroundColor: "#F9FBF9" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "100px", backgroundColor: "#E8F5E9", border: "1px solid #C8E6C9", marginBottom: "14px" }}>
            <span style={{ fontFamily: b, fontSize: "12px", color: "#2E7D32", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Fitur Layanan</span>
          </div>
          <h2 style={{ fontFamily: h, fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#1A2E1A", marginBottom: "14px", letterSpacing: "-0.01em" }}>
            Apa yang Bisa Anda Lakukan?
          </h2>
          <p style={{ fontFamily: b, fontSize: "15px", color: "#3D5C3D", maxWidth: "500px", margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
            Portal perpustakaan kami menghadirkan berbagai kemudahan untuk mendukung kegiatan belajar mengajar di SMKN 1 Gunung Agung.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", marginBottom: "48px" }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{
              backgroundColor: "#fff", borderRadius: "14px", padding: "28px",
              border: "1px solid #E8F5E9", opacity: 0, transform: "translateY(24px)",
              transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.25s, border-color 0.25s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow="0 12px 40px rgba(46,125,50,0.1)"; el.style.borderColor="#C8E6C9"; el.style.transform="translateY(-4px)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow="none"; el.style.borderColor="#E8F5E9"; el.style.transform="translateY(0)"; }}
            >
              <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: f.bg, border: `1px solid ${f.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "16px" }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: h, fontSize: "16px", fontWeight: 700, color: "#1A2E1A", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontFamily: b, fontSize: "13px", color: "#3D5C3D", lineHeight: 1.75, fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div style={{
          background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)",
          borderRadius: "20px", padding: "52px 56px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "36px",
          position: "relative", overflow: "hidden",
          boxShadow: "0 16px 48px rgba(27,94,32,0.25)",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "#F9A825" }} />
          <div style={{ position: "absolute", right: "-80px", top: "-80px", width: "260px", height: "260px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ fontFamily: h, fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#fff", marginBottom: "10px" }}>Siap Menggunakan Portal?</h3>
            <p style={{ fontFamily: b, fontSize: "14px", color: "rgba(255,255,255,0.65)", fontWeight: 300, lineHeight: 1.7, maxWidth: "400px" }}>
              Masuk dengan akun yang diberikan pihak sekolah dan nikmati semua layanan perpustakaan digital.
            </p>
          </div>

          {/* ✅ Diganti: Link → LoadingLink */}
          <LoadingLink href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 30px", backgroundColor: "#F9A825", color: "#1B5E20",
            borderRadius: "10px", fontFamily: h, fontSize: "14px", fontWeight: 700,
            textDecoration: "none", transition: "all 0.25s ease", flexShrink: 0,
            boxShadow: "0 4px 16px rgba(249,168,37,0.4)",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor="#FFB300"; el.style.transform="translateY(-2px)"; el.style.boxShadow="0 8px 24px rgba(249,168,37,0.5)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor="#F9A825"; el.style.transform="translateY(0)"; el.style.boxShadow="0 4px 16px rgba(249,168,37,0.4)"; }}
          >
            Masuk Sekarang
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M12 5L19 12L12 19" stroke="#1B5E20" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </LoadingLink>
        </div>
      </div>

      <style>{`@media(max-width:900px){#koleksi>div>div:nth-child(2){grid-template-columns:repeat(2,1fr)!important;}}@media(max-width:600px){#koleksi>div>div:nth-child(2){grid-template-columns:1fr!important;}#koleksi>div>div:last-child{flex-direction:column!important;padding:32px 24px!important;}}`}</style>
    </section>
  );
}