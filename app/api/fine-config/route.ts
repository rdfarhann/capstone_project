// app/api/fine-config/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/apiResponse";

// ── GET /api/fine-config ─────────────────────────────────────
export async function GET() {
  try {
    const rows = await query<{
      price_per_day: number;
      updated_at: string;
      updated_by: string;
    }>("SELECT price_per_day, updated_at, updated_by FROM fine_config LIMIT 1");

    return ok(rows[0] ?? { price_per_day: 1000, updated_at: null, updated_by: null });
  } catch (err) {
    return serverError(err);
  }
}

// ── PUT /api/fine-config ─────────────────────────────────────
// Body: { pricePerDay, adminId }
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { pricePerDay, adminId } = body;

    if (!pricePerDay || isNaN(Number(pricePerDay))) {
      return badRequest("pricePerDay harus berupa angka");
    }
    if (!adminId) return badRequest("adminId wajib diisi");

    await execute(
      "UPDATE fine_config SET price_per_day=?, updated_by=?, updated_at=NOW() WHERE 1=1",
      [Number(pricePerDay), adminId]
    );

    return ok({ message: "Tarif denda berhasil diperbarui" });
  } catch (err) {
    return serverError(err);
  }
}