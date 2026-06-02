"use client";

import React, { useState, useEffect } from "react";
// Impor LoadingLink kustom yang sudah mendukung tipe data standard HTML anchor
import LoadingLink from "@/components/shared/LoadingLink"; 

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const h = "var(--font-heading)";
  const b = "var(--font-body)";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "all 0.3s ease",
      backgroundColor: scrolled ? "rgba(27,94,32,0.97)" : "rgba(27,94,32,0.92)",
      backdropFilter: "blur(12px)",
      boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.2)" : "none",
      borderBottom: "3px solid #F9A825",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: scrolled ? "60px" : "70px", transition: "height 0.3s" }}>

        {/* Logo & Info Sekolah */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            backgroundColor: "rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 4H19C19.5523 4 20 4.44772 20 5V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4Z" stroke="white" strokeWidth="1.5"/>
              <path d="M8 8H16M8 12H16M8 16H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: h, fontWeight: 700, fontSize: "14px", color: "#fff", lineHeight: 1.1, letterSpacing: "0.01em" }}>
              Perpustakaan Digital
            </div>
            <div style={{ fontFamily: b, fontSize: "11px", color: "rgba(255,255,255,0.65)", letterSpacing: "0.02em" }}>
              SMKN 1 Gunung Agung
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: "flex", alignItems: "center", gap: "28px" }} className="desktop-nav">
          {["Beranda","Tentang","Koleksi","Kontak"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              fontFamily: b, fontSize: "13px", fontWeight: 500,
              color: "rgba(255,255,255,0.8)", textDecoration: "none",
              letterSpacing: "0.02em", transition: "color 0.2s",
            }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = "#fff")}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.8)")}
            >{item}</a>
          ))}
        </nav>

        {/* Action Button & Mobile Menu Trigger */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Tombol Portal Login yang Sudah Terintegrasi Loading Page Screen */}
          <LoadingLink href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "9px 20px",
            backgroundColor: "#F9A825", color: "#1B5E20",
            borderRadius: "8px", fontFamily: h, fontSize: "13px", fontWeight: 700,
            textDecoration: "none", letterSpacing: "0.02em",
            transition: "all 0.2s ease", border: "none",
          }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { 
              const el = e.currentTarget as HTMLElement; 
              el.style.backgroundColor = "#FFB300"; 
              el.style.transform = "translateY(-1px)"; 
              el.style.boxShadow = "0 4px 14px rgba(0,0,0,0.2)"; 
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { 
              const el = e.currentTarget as HTMLElement; 
              el.style.backgroundColor = "#F9A825"; 
              el.style.transform = "translateY(0)"; 
              el.style.boxShadow = "none"; 
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H15" stroke="#1B5E20" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M10 17L15 12L10 7" stroke="#1B5E20" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 12H3" stroke="#1B5E20" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Masuk Portal
          </LoadingLink>

          {/* Toggle Menu Mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#fff", padding: "4px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {menuOpen
                ? <path d="M6 6L18 18M6 18L18 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                : <path d="M4 7H20M4 12H20M4 17H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {menuOpen && (
        <div style={{ backgroundColor: "#1B5E20", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "12px 24px 16px" }}>
          {["Beranda","Tentang","Koleksi","Kontak"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "10px 0", fontFamily: b, fontSize: "15px", color: "rgba(255,255,255,0.85)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {item}
            </a>
          ))}
        </div>
      )}

      {/* CSS Utility Responsif */}
      <style>{`
        @media (max-width: 768px) { 
          .desktop-nav { display: none !important; } 
          .mobile-menu-btn { display: flex !important; } 
        }
      `}</style>
    </header>
  );
}