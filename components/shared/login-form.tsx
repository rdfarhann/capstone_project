"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LibraryBig, Mail, Lock, GraduationCap, ArrowLeft } from "lucide-react"
import Link from "next/link"

const h = "var(--font-heading, 'Montserrat', sans-serif)"
const b = "var(--font-body, 'Open Sans', sans-serif)"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>

      {/* Back */}
      <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"13px", color:"rgba(255,255,255,0.5)", textDecoration:"none", fontFamily:b, transition:"color 0.2s", width:"fit-content" }}
        onMouseEnter={e => (e.currentTarget.style.color="#fff")}
        onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.5)")}
      >
        <ArrowLeft size={14}/> Kembali ke Beranda
      </Link>

      {/* Card */}
      <div style={{ backgroundColor:"#fff", borderRadius:"20px", overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)" }}>

        {/* Header */}
        <div style={{ background:"linear-gradient(140deg, #1B5E20 0%, #2E7D32 100%)", padding:"36px 36px 28px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px", backgroundColor:"#F9A825" }} />
          <div style={{ position:"absolute", top:"-50px", right:"-50px", width:"180px", height:"180px", borderRadius:"50%", border:"1px solid rgba(255,255,255,0.06)", pointerEvents:"none" }} />

          <div style={{ display:"flex", justifyContent:"center", marginBottom:"18px" }}>
            <div style={{ padding:"14px", borderRadius:"16px", backgroundColor:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", display:"inline-flex" }}>
              <LibraryBig size={36} color="white"/>
            </div>
          </div>

          <h1 style={{ fontFamily:h, fontSize:"19px", fontWeight:800, color:"#fff", letterSpacing:"0.04em", textTransform:"uppercase", marginBottom:"6px" }}>
            Perpustakaan Digital
          </h1>
          <p style={{ fontFamily:b, fontSize:"13px", color:"rgba(255,255,255,0.65)", fontWeight:300 }}>
            SMK Negeri 1 Gunung Agung
          </p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", marginTop:"10px", color:"rgba(255,255,255,0.4)", fontSize:"12px", fontFamily:b }}>
            <GraduationCap size={13}/>
            <span>Portal Siswa dan Guru</span>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding:"32px 36px 36px" }}>
          <form onSubmit={e => e.preventDefault()}>
            <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>

              {/* Email */}
              <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
                <Label htmlFor="email" style={{ fontSize:"12px", fontWeight:700, color:"#1A2E1A", fontFamily:h, textTransform:"uppercase", letterSpacing:"0.05em" }}>Email</Label>
                <div style={{ position:"relative" }}>
                  <Mail size={15} style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", color:"#6A8A6A", pointerEvents:"none" }}/>
                  <Input id="email" type="email" placeholder="email@smkn1gunungagung.sch.id" required
                    style={{ paddingLeft:"38px", height:"44px", borderRadius:"10px", backgroundColor:"#F9FBF9", border:"1.5px solid #C8E6C9", color:"#1A2E1A", fontFamily:b, fontSize:"14px", outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                    onFocus={e => { e.target.style.borderColor="#2E7D32"; e.target.style.boxShadow="0 0 0 3px rgba(46,125,50,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor="#C8E6C9"; e.target.style.boxShadow="none"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <Label htmlFor="password" style={{ fontSize:"12px", fontWeight:700, color:"#1A2E1A", fontFamily:h, textTransform:"uppercase", letterSpacing:"0.05em" }}>Password</Label>
                  <a href="#" style={{ fontSize:"12px", color:"#2E7D32", textDecoration:"none", fontFamily:b, transition:"color 0.2s" }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color="#1B5E20")}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color="#2E7D32")}
                  >Lupa password?</a>
                </div>
                <div style={{ position:"relative" }}>
                  <Lock size={15} style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", color:"#6A8A6A", pointerEvents:"none" }}/>
                  <Input id="password" type="password" placeholder="Masukkan password" required
                    style={{ paddingLeft:"38px", height:"44px", borderRadius:"10px", backgroundColor:"#F9FBF9", border:"1.5px solid #C8E6C9", color:"#1A2E1A", fontFamily:b, fontSize:"14px", outline:"none", transition:"border-color 0.2s, box-shadow 0.2s" }}
                    onFocus={e => { e.target.style.borderColor="#2E7D32"; e.target.style.boxShadow="0 0 0 3px rgba(46,125,50,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor="#C8E6C9"; e.target.style.boxShadow="none"; }}
                  />
                </div>
              </div>

              <div style={{ height:"1px", backgroundColor:"#E8F5E9" }}/>

              {/* Submit */}
              <Button type="submit" style={{
                width:"100%", height:"46px",
                background:"linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)",
                color:"#fff", border:"none", borderRadius:"10px",
                fontFamily:h, fontSize:"14px", fontWeight:700,
                letterSpacing:"0.03em", cursor:"pointer",
                boxShadow:"0 4px 16px rgba(27,94,32,0.3)", transition:"all 0.2s ease",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background="linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)"; el.style.transform="translateY(-1px)"; el.style.boxShadow="0 8px 24px rgba(27,94,32,0.4)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background="linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)"; el.style.transform="translateY(0)"; el.style.boxShadow="0 4px 16px rgba(27,94,32,0.3)"; }}
              >
                Masuk ke Portal
              </Button>

              <p style={{ textAlign:"center", fontSize:"12px", color:"#6A8A6A", fontFamily:b }}>
                Belum punya akun?{" "}
                <a href="#" style={{ color:"#2E7D32", fontWeight:700, textDecoration:"none" }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.textDecoration="underline")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.textDecoration="none")}
                >Hubungi Administrator</a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <p style={{ textAlign:"center", fontSize:"11px", color:"rgba(255,255,255,0.25)", fontFamily:b, fontWeight:300 }}>
        &copy; {new Date().getFullYear()} SMK Negeri 1 Gunung Agung. Hak cipta dilindungi.
      </p>
    </div>
  )
}