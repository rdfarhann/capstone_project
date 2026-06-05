// app/api/stats/route.ts
import { query } from "@/lib/db";
import { ok, serverError } from "@/lib/apiResponse";
import type { AdminStats } from "@/types";

// ── GET /api/stats ───────────────────────────────────────────
export async function GET() {
  try {
    // Pakai view v_admin_stats yang sudah ada di database
    const rows = await query<AdminStats>(`
      SELECT
        total_books            AS totalBooks,
        total_users            AS totalUsers,
        active_loans           AS activeLoans,
        pending_loans          AS pendingLoans,
        overdue_loans          AS overdueLoans,
        total_fines_collected  AS totalFinesCollected,
        books_out_of_stock     AS booksOutOfStock
      FROM v_admin_stats
    `);

    // Ambil data tren peminjaman 7 hari terakhir untuk grafik
    const trend = await query<{ date: string; count: number }>(`
      SELECT
        DATE_FORMAT(borrow_date, '%d/%m') AS date,
        COUNT(*)                          AS count
      FROM loans
      WHERE borrow_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY borrow_date
      ORDER BY borrow_date ASC
    `);

    return ok({ stats: rows[0] ?? null, trend });
  } catch (err) {
    return serverError(err);
  }
}