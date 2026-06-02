"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 5000, suffix: "+", label: "Koleksi Buku", icon: "📚" },
  { value: 800,  suffix: "+", label: "Anggota Aktif", icon: "👨‍🎓" },
  { value: 3,    suffix: "",  label: "Konsentrasi Keahlian", icon: "🎓" },
  { value: 20,   suffix: " Thn", label: "Pengalaman Berdiri", icon: "🏛️" },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated.current) {
        animated.current = true;
        const steps = 60; let current = 0;
        const inc = target / steps;
        const timer = setInterval(() => {
          current += inc;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 2000 / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString("id-ID")}{suffix}</span>;
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const h = "var(--font-heading)";
  const b = "var(--font-body)";

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        (entries[0].target as HTMLElement).querySelectorAll(".stat-card").forEach((item, i) => {
          setTimeout(() => { (item as HTMLElement).style.opacity="1"; (item as HTMLElement).style.transform="translateY(0)"; }, i*100);
        });
        observer.unobserve(entries[0].target);
      }
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)" }}>
      {/* Gold top stripe */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: "#F9A825" }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "70px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2px" }}>
          {stats.map((stat, i) => (
            <div key={i} className="stat-card" style={{
              padding: "44px 28px", textAlign: "center",
              borderRight: i < stats.length-1 ? "1px solid rgba(255,255,255,0.1)" : "none",
              opacity: 0, transform: "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease",
            }}>
              <div style={{ fontSize: "34px", marginBottom: "10px" }}>{stat.icon}</div>
              <div style={{ fontFamily: h, fontSize: "clamp(30px,3.5vw,46px)", fontWeight: 800, color: "#F9A825", lineHeight: 1, marginBottom: "8px" }}>
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontFamily: b, fontSize: "12px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:768px){section>div>div{grid-template-columns:repeat(2,1fr)!important;}section>div>div>div{border-right:none!important;border-bottom:1px solid rgba(255,255,255,0.1)!important;}}`}</style>
    </section>
  );
}