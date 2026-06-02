"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, Menu, X } from "lucide-react";

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
      <div style={{
        maxWidth: "1200px", margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: scrolled ? "60px" : "70px", transition: "height 0.3s",
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <div style={{
            width: scrolled ? "36px" : "42px",
            height: scrolled ? "36px" : "42px",
            borderRadius: "10px",
            overflow: "hidden",
            flexShrink: 0,
            transition: "all 0.3s ease",
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "1.5px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Image
              src="/logo.png"
              alt="Logo SMKN 1 Gunung Agung"
              width={42}
              height={42}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              priority
            />
          </div>
          <div>
            <div style={{
              fontFamily: h, fontWeight: 700,
              fontSize: scrolled ? "13px" : "14px",
              color: "#fff", lineHeight: 1.1, letterSpacing: "0.01em",
              transition: "font-size 0.3s",
            }}>
              Perpustakaan Digital
            </div>
            <div style={{ fontFamily: b, fontSize: "11px", color: "rgba(255,255,255,0.65)", letterSpacing: "0.02em" }}>
              SMKN 1 Gunung Agung
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "28px" }} className="desktop-nav">
          {["Beranda", "Tentang", "Koleksi", "Kontak"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              fontFamily: b, fontSize: "13px", fontWeight: 500,
              color: "rgba(255,255,255,0.8)", textDecoration: "none",
              letterSpacing: "0.02em", transition: "color 0.2s",
            }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = "#fff")}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.8)")}
            >
              {item}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "9px 20px",
            backgroundColor: "#F9A825", color: "#1B5E20",
            borderRadius: "8px", fontFamily: h, fontSize: "13px", fontWeight: 700,
            textDecoration: "none", letterSpacing: "0.02em",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "#FFB300"; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 4px 14px rgba(0,0,0,0.2)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "#F9A825"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
          >
            <LogIn size={14} color="#1B5E20" />
            Masuk Portal
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#fff" }}
          >
            {menuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: "#1B5E20", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "12px 24px 16px" }}>
          {["Beranda", "Tentang", "Koleksi", "Kontak"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "10px 0", fontFamily: b, fontSize: "15px", color: "rgba(255,255,255,0.85)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              {item}
            </a>
          ))}
          <Link href="/login" onClick={() => setMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", padding: "11px 0", fontFamily: h, fontSize: "14px", fontWeight: 700, color: "#F9A825", textDecoration: "none" }}
          >
            <LogIn size={15} color="#F9A825" />
            Masuk Portal
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}