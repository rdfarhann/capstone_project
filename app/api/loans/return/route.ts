// app/api/loans/return/route.ts
import { NextRequest } from "next/server";
import { callProcedure } from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/apiResponse";

// ── POST /api/loans/return ───────────────────────────────────
// Body: { loanId }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { loanId } = body;

    if (!loanId) {
      return badRequest("loanId wajib diisi");
    }

    // Stored procedure: set return_date, hitung denda, tambah available_stock
    await callProcedure("CALL return_book(?)", [loanId]);

    return ok({ message: "Pengembalian buku berhasil diproses" });
  } catch (err: unknown) {
    const msg = (err as { message?: string }).message ?? "";
    if (msg.includes("tidak ditemukan") || msg.includes("not found")) {
      return badRequest(msg);
    }
    return serverError(err);
  }
}