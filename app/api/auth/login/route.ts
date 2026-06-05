// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 1. ⚠️ UBAH IMPORT-NYA: Ambil fungsi helper 'query' dari '@/lib/db'
import { query } from "@/lib/db"; 

const JWT_SECRET = process.env.JWT_SECRET ?? "c80d3cbb0768de81351428f52f40ca8f1956f97ffc2d25a25420394b9bd69153";
const JWT_EXPIRES = "7d";

// 2. Buat interface untuk tipe data User agar TypeScript tahu struktur data baris tabelmu
interface UserRow {
  id: number;
  nisn: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  class_name: string;
  avatar_url: string | null;
  is_active: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body as {
      identifier?: string;
      password?: string;
    };

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "NISN/Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // 3. ⚠️ GUNAKAN HELPER 'query': Jauh lebih bersih dan sudah ter-typed otomatis!
    const users = await query<UserRow>(
      `SELECT id, nisn, name, email, password, role, class_name, avatar_url, is_active
       FROM users
       WHERE (nisn = ? OR email = ?)
       LIMIT 1`,
      [identifier.trim(), identifier.trim().toLowerCase()]
    );

    // 4. Sisa kode ke bawah tetap sama, tidak ada yang perlu diubah...
    if (users.length === 0) {
      return NextResponse.json(
        { message: "NISN/Email atau password salah" },
        { status: 401 }
      );
    }

    const user = users[0];

    if (user.is_active === 0) {
      return NextResponse.json(
        { message: "Akun kamu dinonaktifkan. Hubungi petugas perpustakaan." },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "NISN/Email atau password salah" },
        { status: 401 }
      );
    }

    const tokenPayload = {
      id: user.id,
      nisn: user.nisn,
      name: user.name,
      email: user.email,
      role: user.role,
      class_name: user.class_name,
      avatar_url: user.avatar_url,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    const response = NextResponse.json({
      message: "Login berhasil",
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        class_name: user.class_name,
        avatar_url: user.avatar_url,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}