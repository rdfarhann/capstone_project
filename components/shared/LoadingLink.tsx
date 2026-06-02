"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link, { LinkProps } from "next/link";
import type { UrlObject } from "url";
import { useRouter } from "next/navigation";

// ─── Loading Overlay (di-render langsung ke <body> via portal) ────────────────

function LoadingOverlay() {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(255,255,255,0.72)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      animation: "ll-fadeIn 0.15s ease",
    }}>
      <style>{`
        @keyframes ll-fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes ll-spin    { to   { transform:rotate(360deg) } }
        @keyframes ll-pulse   { 0%,100%{transform:scale(.6);opacity:.4} 50%{transform:scale(1);opacity:1} }
      `}</style>
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "3px solid transparent",
          borderTopColor: "#2563eb", borderRightColor: "#2563eb",
          animation: "ll-spin 0.75s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: "30%", borderRadius: "50%",
          background: "#2563eb",
          animation: "ll-pulse 0.75s ease-in-out infinite",
        }} />
      </div>
    </div>,
    document.body
  );
}


// ─── LoadingLink ──────────────────────────────────────────────────────────────

type LoadingLinkProps = Omit<LinkProps, "onClick"> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
    /** Minimum ms overlay ditampilkan sebelum navigasi. Default: 400 */
    minDelay?: number;
  };

export default function LoadingLink({
  href,
  children,
  minDelay = 400,
  ...props
}: LoadingLinkProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Simpan ref agar cleanup bisa dilakukan jika komponen unmount sebelum waktunya
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) return;

      const hrefStr =
        typeof href === "string"
          ? href
          : (href as UrlObject).pathname ?? "";

      // Link eksternal — biarkan browser menangani
      if (hrefStr.startsWith("http") || hrefStr.startsWith("//")) return;

      e.preventDefault();

      // 1. Tampilkan overlay DULU
      setLoading(true);

      // 2. Baru navigasi setelah minDelay — overlay sudah pasti terlihat
      timerRef.current = setTimeout(() => {
        router.push(hrefStr);
        // Beri waktu Next.js merender halaman baru sebelum sembunyikan overlay
        timerRef.current = setTimeout(() => setLoading(false), 800);
      }, minDelay);
    },
    [href, minDelay, router]
  );

  return (
    <>
      {loading && <LoadingOverlay />}
      <Link href={href} onClick={handleClick} {...props}>
        {children}
      </Link>
    </>
  );
}