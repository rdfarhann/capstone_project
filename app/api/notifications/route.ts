// app/api/notifications/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/apiResponse";

// ── GET /api/notifications ───────────────────────────────────
// Query params: ?userId=&unreadOnly=true
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId") ?? "";
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    if (!userId) return badRequest("userId wajib diisi");

    let sql = `
      SELECT
        n.id, n.user_id, n.type, n.title, n.message,
        n.is_read, n.created_at, n.loan_id,
        CASE
          WHEN l.status IN ('active','overdue') AND l.due_date < CURDATE()
          THEN GREATEST(0, DATEDIFF(CURDATE(), l.due_date)) * fc.price_per_day
          ELSE NULL
        END AS fine_amount
      FROM  notifications n
      LEFT JOIN loans l      ON l.id = n.loan_id
      CROSS JOIN fine_config fc
      WHERE n.user_id = ?
    `;
    const params: (string | number)[] = [userId];

    if (unreadOnly) {
      sql += " AND n.is_read = 0";
    }

    sql += " ORDER BY n.created_at DESC LIMIT 50";

    const notifications = await query(sql, params);
    return ok(notifications);
  } catch (err) {
    return serverError(err);
  }
}

// ── PATCH /api/notifications ─────────────────────────────────
// Tandai dibaca. Body: { id?, userId, markAll? }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, userId, markAll } = body;

    if (!userId) return badRequest("userId wajib diisi");

    if (markAll) {
      await execute("UPDATE notifications SET is_read=1 WHERE user_id=?", [userId]);
      return ok({ message: "Semua notifikasi ditandai dibaca" });
    }

    if (!id) return badRequest("id notifikasi wajib diisi");
    await execute("UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?", [id, userId]);
    return ok({ message: "Notifikasi ditandai dibaca" });
  } catch (err) {
    return serverError(err);
  }
}

// ── DELETE /api/notifications ────────────────────────────────
// Query params: ?id=&userId=
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id || !userId) return badRequest("id dan userId wajib diisi");

    await execute("DELETE FROM notifications WHERE id=? AND user_id=?", [id, userId]);
    return ok({ message: "Notifikasi dihapus" });
  } catch (err) {
    return serverError(err);
  }
}