// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // 1. Ambil instance cookie store (tambahkan await untuk Next.js versi terbaru jika diperlukan)
    const cookieStore = await cookies();

    // 2. Hapus cookie 'auth_token' yang dibuat saat login
    cookieStore.delete("auth_token");

    // 3. Kembalikan response sukses 200 OK ke frontend
    return NextResponse.json(
      { success: true, message: "Berhasil logout" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[LOGOUT ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Gagal memproses logout pada server" },
      { status: 500 }
    );
  }
}