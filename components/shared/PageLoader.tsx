"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const h = "var(--font-heading, 'Montserrat', sans-serif)";
  const b = "var(--font-body, 'Open Sans', sans-serif)";

  useEffect(() => {
    // Simulate progress: fast to 80%, then wait for page, then finish
    const stages = [
      { target: 30, duration: 200 },
      { target: 60, duration: 300 },
      { target: 80, duration: 400 },
    ];

    let current = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    stages.forEach(({ target, duration }, i) => {
      const delay = stages.slice(0, i).reduce((acc, s) => acc + s.duration, 0);
      timers.push(
        setTimeout(() => {
          const steps = 20;
          const increment = (target - current) / steps;
          let step = 0;
          const interval = setInterval(() => {
            step++;
            current += increment;
            setProgress(Math.min(Math.round(current), target));
            if (step >= steps) clearInterval(interval);
          }, duration / steps);
        }, delay)
      );
    });

    // When window loads, finish the bar
    const finish = () => {
      setProgress(100);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setVisible(false), 500);
      }, 300);
    };

    if (document.readyState === "complete") {
      setTimeout(finish, 600);
    } else {
      window.addEventListener("load", finish, { once: true });
      // Fallback: force finish after 3s
      timers.push(setTimeout(finish, 3000));
    }

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", finish);
    };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      backgroundColor: "#1B5E20",
      backgroundImage: "url('/background_sekolah.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      transition: "opacity 0.5s ease",
      opacity: fadeOut ? 0 : 1,
      pointerEvents: fadeOut ? "none" : "all",
    }}>
      {/* Dark + green overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, rgba(27,94,32,0.6) 0%, rgba(46,125,50,0.45) 100%)" }} />

      {/* Gold top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "#F9A825" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>

        {/* Logo + school name */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "20px",
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "1.5px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: "loaderPulse 1.8s ease-in-out infinite",
          }}>
            <Image
              src="/logo.png"
              alt="Logo SMKN 1 Gunung Agung"
              width={60}
              height={60}
              style={{ objectFit: "contain", width: "60px", height: "60px" }}
              priority
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: h, fontSize: "18px", fontWeight: 800,
              color: "#fff", letterSpacing: "0.03em", marginBottom: "4px",
            }}>
              Perpustakaan Digital
            </div>
            <div style={{
              fontFamily: b, fontSize: "13px", fontWeight: 300,
              color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em",
            }}>
              SMK Negeri 1 Gunung Agung
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: "200px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "100%", height: "3px", borderRadius: "100px",
            backgroundColor: "rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: "100px",
              background: "linear-gradient(90deg, #F9A825, #FFD54F)",
              width: `${progress}%`,
              transition: "width 0.15s ease",
              boxShadow: "0 0 8px rgba(249,168,37,0.6)",
            }} />
          </div>
          <span style={{
            fontFamily: b, fontSize: "11px",
            color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em",
          }}>
            {progress < 100 ? "Memuat..." : "Selesai"}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes loaderPulse {
          0%, 100% { transform: scale(1);   box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
          50%       { transform: scale(1.05); box-shadow: 0 12px 40px rgba(249,168,37,0.2); }
        }
      `}</style>
    </div>
  );
}