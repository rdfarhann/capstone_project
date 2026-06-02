"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  const h = "var(--font-heading)";
  const b = "var(--font-body)";

  return (
    <footer id="kontak" style={{ backgroundColor: "#1A2E1A", color: "#fff", padding: "72px 0 0" }}>
      {/* Gold top border */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: "-72px", left: 0, right: 0, height: "4px", backgroundColor: "#F9A825" }} />
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "56px", paddingBottom: "56px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "#2E7D32", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H19C19.55 4 20 4.45 20 5V20C20 20.55 19.55 21 19 21H5C4.45 21 4 20.55 4 20V4Z" stroke="white" strokeWidth="1.5"/>
                  <path d="M8 8H16M8 12H16M8 16H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: h, fontWeight: 700, fontSize: "15px", color: "#fff" }}>Perpustakaan Digital</div>
                <div style={{ fontFamily: b, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>SMKN 1 Gunung Agung</div>
              </div>
            </div>
            <p style={{ fontFamily: b, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.85, fontWeight: 300, maxWidth: "300px", marginBottom: "22px" }}>
              Pusat sumber belajar SMKN 1 Gunung Agung yang menyediakan layanan perpustakaan berkualitas untuk mendukung kegiatan akademik seluruh civitas sekolah.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {["IG","TT","FB","YT"].map(s => (
                <a key={s} href="#" style={{
                  width: "34px", height: "34px", borderRadius: "8px",
                  backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none", color: "rgba(255,255,255,0.5)",
                  fontFamily: b, fontSize: "10px", fontWeight: 700, transition: "all 0.2s",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor="rgba(249,168,37,0.15)"; el.style.borderColor="#F9A825"; el.style.color="#F9A825"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor="rgba(255,255,255,0.06)"; el.style.borderColor="rgba(255,255,255,0.1)"; el.style.color="rgba(255,255,255,0.5)"; }}
                >{s}</a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 style={{ fontFamily: h, fontSize: "13px", fontWeight: 700, color: "#F9A825", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Navigasi</h4>
            {[{label:"Beranda",href:"#beranda"},{label:"Tentang Sekolah",href:"#tentang"},{label:"Layanan",href:"#koleksi"},{label:"Kontak",href:"#kontak"},{label:"Masuk Portal",href:"/login"}].map(link => (
              <a key={link.label} href={link.href} style={{ display: "block", fontFamily: b, fontSize: "13px", color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: "10px", transition: "color 0.2s" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color="#fff")}
                onMouseLeave={e => ((e.target as HTMLElement).style.color="rgba(255,255,255,0.5)")}
              >{link.label}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: h, fontSize: "13px", fontWeight: 700, color: "#F9A825", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Kontak</h4>
            {[
              { icon:"📍", text:"Jl. Diponegoro, Tiyuh Marga Jaya, Gunung Agung, Tulang Bawang Barat, Lampung 34684" },
              { icon:"📞", text:"0882-1271-3093" },
              { icon:"✉️", text:"smkn1gunungagung2@gmail.com" },
              { icon:"🕐", text:"Senin–Jumat, 07.30–14.30 WIB" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "13px", flexShrink: 0, marginTop: "2px" }}>{item.icon}</span>
                <span style={{ fontFamily: b, fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, fontWeight: 300 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 0", flexWrap: "wrap", gap: "10px" }}>
          <p style={{ fontFamily: b, fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
            © {year} Perpustakaan SMK Negeri 1 Gunung Agung. Hak cipta dilindungi.
          </p>
          <p style={{ fontFamily: b, fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
            Dibangun untuk mendukung pendidikan berkualitas 📚
          </p>
        </div>
      </div>

      <style>{`@media(max-width:768px){footer>div>div:first-child{grid-template-columns:1fr!important;gap:32px!important;}}`}</style>
    </footer>
  );
}