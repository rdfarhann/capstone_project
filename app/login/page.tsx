import { LoginForm } from "@/components/shared/login-form"

type Ring = {
  top?: string
  right?: string
  bottom?: string
  left?: string
  size: number
}

const rings: Ring[] = [
  { top: "8%",  right: "6%",  size: 480 },
  { top: "14%", right: "12%", size: 300 },
  { bottom: "6%", left: "4%", size: 360 },
]

export default function Page() {
  return (
    <div style={{
      position: "relative", display: "flex", minHeight: "100svh",
      width: "100%", alignItems: "center", justifyContent: "center",
      padding: "24px",
      backgroundImage: "url('/background_sekolah.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      overflow: "hidden",
    }}>
      {/* Dark overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", zIndex: 0 }} />

      {/* Green tint overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, rgba(27,94,32,0.55) 0%, rgba(46,125,50,0.4) 50%, rgba(27,94,32,0.6) 100%)", zIndex: 0 }} />

      {/* Gold top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: "#F9A825", zIndex: 10 }} />

      {/* Decorative rings */}
      {rings.map((s, i) => (
        <div key={i} style={{
          position: "absolute", pointerEvents: "none", zIndex: 1,
          top: s.top, right: s.right, bottom: s.bottom, left: s.left,
          width: s.size, height: s.size,
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)",
        }} />
      ))}

      {/* Dot grid — top left */}
      <svg style={{ position: "absolute", top: "7%", left: "5%", opacity: 0.12, pointerEvents: "none", zIndex: 1 }}
        width="150" height="150" viewBox="0 0 150 150">
        {Array.from({ length: 5 }).flatMap((_, r) =>
          Array.from({ length: 5 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={c * 28 + 14} cy={r * 28 + 14} r="2.5" fill="white" />
          ))
        )}
      </svg>

      {/* Dot grid — bottom right */}
      <svg style={{ position: "absolute", bottom: "8%", right: "6%", opacity: 0.1, pointerEvents: "none", zIndex: 1 }}
        width="100" height="100" viewBox="0 0 100 100">
        {Array.from({ length: 4 }).flatMap((_, r) =>
          Array.from({ length: 4 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={c * 24 + 12} cy={r * 24 + 12} r="2" fill="#F9A825" />
          ))
        )}
      </svg>

      {/* Radial glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "radial-gradient(ellipse 60% 50% at 75% 35%, rgba(249,168,37,0.08) 0%, transparent 65%), radial-gradient(ellipse 50% 60% at 20% 70%, rgba(255,255,255,0.04) 0%, transparent 65%)",
      }} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "420px" }}>
        <LoginForm />
      </div>
    </div>
  )
}