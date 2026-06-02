"use client";

import { useEffect, useRef } from "react";
import LoadingLink from "@/components/shared/LoadingLink";
import { BookOpen, LogIn, ChevronDown, BookMarked, FlaskConical, Calculator, Monitor } from "lucide-react";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const h = "var(--font-heading)";
  const b = "var(--font-body)";

  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.querySelectorAll(".hero-animate").forEach((item, i) => {
      (item as HTMLElement).style.animationDelay = `${i * 0.15}s`;
      item.classList.add("animate-fade-up");
    });
  }, []);

  const subjectIcons = [
    { icon: <BookMarked size={16} color="rgba(255,255,255,0.7)" />, label: "Umum" },
    { icon: <FlaskConical size={16} color="rgba(255,255,255,0.7)" />, label: "Sains" },
    { icon: <Calculator size={16} color="rgba(255,255,255,0.7)" />, label: "Akuntansi" },
    { icon: <Monitor size={16} color="rgba(255,255,255,0.7)" />, label: "TKJ" },
  ];

  return (
    <section ref={ref} id="beranda" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden", paddingTop: "80px", paddingBottom: "60px",
      backgroundImage: "url('/background_sekolah.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
    }}>
      {/* Dark overlay on background image */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", zIndex: 0 }} />
      {/* Green tint overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, rgba(27,94,32,0.55) 0%, rgba(46,125,50,0.4) 50%, rgba(27,94,32,0.6) 100%)", zIndex: 0 }} />

      {/* Decorative */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-160px", top: "50%", transform: "translateY(-50%)", width: "600px", height: "600px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", animation: "float 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", right: "-60px", top: "50%", transform: "translateY(-50%)", width: "420px", height: "420px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", animation: "float 8s ease-in-out infinite", animationDelay: "1s" }} />
        <svg style={{ position: "absolute", right: "6%", top: "12%", opacity: 0.08 }} width="180" height="180" viewBox="0 0 180 180">
          {Array.from({ length: 6 }).flatMap((_, r) => Array.from({ length: 6 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={c * 28 + 14} cy={r * 28 + 14} r="2.5" fill="white" />
          )))}
        </svg>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(transparent, rgba(249,251,249,0.15))" }} />
      </div>

      <div style={{
        maxWidth: "1200px", margin: "0 auto", padding: "40px 24px",
        display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "40px",
        alignItems: "center", width: "100%", position: "relative", zIndex: 1,
      }}>
        {/* Left Content */}
        <div>
          <div className="hero-animate opacity-0" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 14px",
            backgroundColor: "rgba(249,168,37,0.2)", border: "1px solid rgba(249,168,37,0.4)",
            borderRadius: "100px", marginBottom: "24px",
          }}>
            <BookOpen size={13} color="#F9A825" />
            <span style={{ fontFamily: b, fontSize: "12px", color: "#F9A825", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
              Portal Perpustakaan Digital
            </span>
          </div>

          <h1 className="hero-animate opacity-0" style={{
            fontFamily: h, fontSize: "clamp(34px, 4.5vw, 54px)", fontWeight: 800,
            color: "#fff", lineHeight: 1.15, marginBottom: "18px", letterSpacing: "-0.02em",
          }}>
            Perpustakaan<br />
            <span style={{ color: "#F9A825" }}>SMKN 1</span><br />
            Gunung Agung
          </h1>

          <p className="hero-animate opacity-0" style={{
            fontFamily: b, fontSize: "16px", color: "rgba(255,255,255,0.75)",
            lineHeight: 1.8, marginBottom: "36px", maxWidth: "460px", fontWeight: 300,
          }}>
            Jelajahi ribuan koleksi buku, referensi ilmiah, dan sumber belajar untuk mendukung prestasi seluruh warga SMKN 1 Gunung Agung.
          </p>

          <div className="hero-animate opacity-0" style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <LoadingLink href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "13px 28px", backgroundColor: "#F9A825", color: "#1B5E20",
              borderRadius: "10px", fontFamily: h, fontSize: "14px", fontWeight: 700,
              textDecoration: "none", transition: "all 0.25s ease",
              boxShadow: "0 4px 20px rgba(249,168,37,0.35)",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "#FFB300"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 28px rgba(249,168,37,0.45)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "#F9A825"; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 4px 20px rgba(249,168,37,0.35)"; }}
            >
              <LogIn size={16} color="#1B5E20" />
              Masuk ke Portal
            </LoadingLink>

            <a href="#tentang" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "13px 28px", backgroundColor: "rgba(255,255,255,0.1)",
              color: "#fff", borderRadius: "10px", fontFamily: h, fontSize: "14px", fontWeight: 600,
              textDecoration: "none", transition: "all 0.25s ease",
              border: "1.5px solid rgba(255,255,255,0.25)",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "rgba(255,255,255,0.18)"; el.style.borderColor = "rgba(255,255,255,0.4)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "rgba(255,255,255,0.1)"; el.style.borderColor = "rgba(255,255,255,0.25)"; }}
            >
              Pelajari Lebih Lanjut
              <ChevronDown size={15} color="white" />
            </a>
          </div>
        </div>

        {/* Right Content: Visi Misi Card */}
        <div className="hero-animate opacity-0" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "520px" }}>
            
            {/* Main Visi Misi Card */}
            <div style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(16px)",
              borderRadius: "24px", padding: "28px 32px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
              animation: "float 6s ease-in-out infinite",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px",
              }}>
                <BookOpen size={22} color="white" />
              </div>
              
              {/* Bagian Visi */}
              <div style={{ fontFamily: h, fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                Visi
              </div>
              <div style={{ fontFamily: b, fontSize: "13.5px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: "20px" }}>
                Terwujudnya lembaga pendidikan menengah kejuruan yang mampu mencetak lulusan yang berkepribadian kuat, percaya diri, cerdas, mandiri dan berdaya saing.
              </div>
              
              {/* Bagian Misi */}
              <div style={{ fontFamily: h, fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                Misi
              </div>
              <ul style={{ 
                fontFamily: b, fontSize: "13px", color: "rgba(255,255,255,0.75)", 
                lineHeight: 1.55, margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px",
                marginBottom: "24px"
              }}>
                <li>Membentuk karakter positif peserta didik;</li>
                <li>Memberikan pengalaman nyata bagi peserta didik melalui proses belajar mengajar baik di sekolah maupun di dunia usaha/industri;</li>
                <li>Menciptakan kebersamaan dan kekeluargaan dalam pelaksanaan tugas berdasarkan profesionalitas;</li>
                <li>Menjadikan sekolah sebagai kebanggaan warga sekolah dan masyarakat sekitarnya; dan</li>
                <li>Mewujudkan iklim bisnis di sekolah melalui proses belajar mengajar dan business center.</li>
              </ul>
              
              {/* Subject Icons Footer */}
              <div style={{ paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "10px" }}>
                {subjectIcons.map((item, i) => (
                  <div key={i} title={item.label} style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.05)"
                  }}>
                    {item.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Floating chip — To Be Better */}
            <div style={{
              position: "absolute", top: "-30px", right: "10px", zIndex: 2,
              backgroundColor: "#fff", borderRadius: "14px", padding: "10px 18px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              animation: "float 5s ease-in-out infinite", animationDelay: "1s",
            }}>
              <div style={{ fontFamily: b, fontSize: "10px", color: "#6A8A6A", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>We Must Grow Up</div>
              <div style={{ fontFamily: h, fontSize: "18px", fontWeight: 800, color: "#1B5E20", lineHeight: 1.2 }}>To Be Better</div>
            </div>

          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 1 }}>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", display: "block" }}>
          <path d="M0 60V30C360 0 720 60 1080 30C1260 15 1380 20 1440 30V60H0Z" fill="#F9FBF9" />
        </svg>
      </div>

      <style>{`
        @media (max-width:991px){
          #beranda>div{grid-template-columns:1fr!important; gap:50px!important; padding-top:40px!important;}
          #beranda>div>div:last-child{margin-top:20px;}
        }
        @media (max-width:576px){
          #beranda>div>div:last-child{display:none!important;}
        }
      `}</style>
    </section>
  );
}