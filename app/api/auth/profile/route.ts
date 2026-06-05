// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "c80d3cbb0768de81351428f52f40ca8f1956f97ffc2d25a25420394b9bd69153";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Tidak ada token auth" }, { status: 401 });
    }

    // Verifikasi token JWT
    const decoded = jwt.verify(token, JWT_SECRET) as {
      name: string;
      role: string;
      avatar_url?: string | null;
    };

    return NextResponse.json({
      name: decoded.name,
      role: decoded.role,
      avatar_url: decoded.avatar_url ?? null,
    });
  } catch (error) {
    console.error("[PROFILE API ERROR]", error);
    return NextResponse.json({ message: "Token tidak valid atau kedaluwarsa" }, { status: 401 });
  }
}