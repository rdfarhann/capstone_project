// middleware.ts  ← taruh di ROOT proyek (sejajar dengan app/)
// ============================================================
// Proteksi semua route /dashboard/*
// - Belum login → redirect ke /login
// - Sudah login tapi buka /login → redirect ke dashboard
// - User biasa coba akses /dashboard/admin → redirect ke /dashboard/user
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // jose sudah built-in di Next.js edge runtime

const JWT_SECRET = process.env.JWT_SECRET ?? "ganti_ini_dengan_secret_yang_kuat";

// Encode secret untuk jose
const secret = new TextEncoder().encode(JWT_SECRET);

async function getTokenPayload(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as {
      id: number;
      name: string;
      role: "admin" | "user";
      nisn: string;
      email: string;
    };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  const isLoginPage = pathname === "/login";
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/dashboard/admin");

  // ── Sudah login & buka /login → redirect ke dashboard ──
  if (isLoginPage && token) {
    const payload = await getTokenPayload(token);
    if (payload) {
      const dest = payload.role === "admin" ? "/dashboard/admin" : "/dashboard/user";
      return NextResponse.redirect(new URL(dest, req.url));
    }
  }

  // ── Belum login & buka /dashboard/* → ke /login ──
  if (isDashboard) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await getTokenPayload(token);

    // Token invalid / expired
    if (!payload) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("auth_token");
      return response;
    }

    // User biasa coba buka halaman admin
    if (isAdminRoute && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Jalankan middleware di semua route kecuali asset statis & API
  matcher: [
    "/login",
    "/dashboard/:path*",
  ],
};