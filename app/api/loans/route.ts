// app/api/loans/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import { ok, created, badRequest, serverError } from "@/lib/apiResponse";

// ── GET /api/loans ───────────────────────────────────────────
// Query params: ?status=&userId=&search=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") ?? "";
    const userId = searchParams.get("userId") ?? "";
    const search = searchParams.get("search") ?? "";

    let sql = `
      SELECT
        l.id, l.user_id, l.book_id,
        l.borrow_date, l.due_date, l.return_date,
        l.status, l.fine_amount, l.notes, l.created_at,
        u.name   AS user_name,
        u.class_name AS user_class,
        b.title  AS book_title,
        b.author AS book_author,
        fc.price_per_day AS fine_per_day,
        GREATEST(0, DATEDIFF(CURDATE(), l.due_date)) AS days_overdue,
        GREATEST(0, DATEDIFF(l.due_date, CURDATE())) AS days_remaining
      FROM  loans l
      JOIN  users u     ON u.id = l.user_id
      JOIN  books b     ON b.id = l.book_id
      CROSS JOIN fine_config fc
      WHERE 1=1
    `;
    const params: (string | number | null)[] = [];

    if (status) {
      sql += " AND l.status = ?";
      params.push(status);
    }
    if (userId) {
      sql += " AND l.user_id = ?";
      params.push(userId);
    }
    if (search) {
      sql += " AND (u.name LIKE ? OR b.title LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like);
    }

    sql += " ORDER BY l.created_at DESC";

    const loans = await query(sql, params);
    return ok(loans);
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/loans ──────────────────────────────────────────
// Ajukan peminjaman baru (status = pending)
// Body: { userId, bookId, notes? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, bookId, notes } = body;

    if (!userId || !bookId) {
      return badRequest("userId dan bookId wajib diisi");
    }

    // Cek stok buku tersedia
    const books = await query<{ available_stock: number }>(
      "SELECT available_stock FROM books WHERE id = ?",
      [bookId]
    );
    if (!books.length || books[0].available_stock < 1) {
      return badRequest("Buku tidak tersedia atau stok habis");
    }

    // Cek user tidak punya pinjaman aktif untuk buku yang sama
    const existing = await query<{ id: number }>(
      "SELECT id FROM loans WHERE user_id=? AND book_id=? AND status IN ('active','pending','overdue')",
      [userId, bookId]
    );
    if (existing.length > 0) {
      return badRequest("Anda sudah memiliki peminjaman aktif untuk buku ini");
    }

    const result = await execute(
      `INSERT INTO loans (user_id, book_id, borrow_date, due_date, status, notes)
       VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'pending', ?)`,
      [userId, bookId, notes ?? null]
    );

    return created({ id: result.insertId, message: "Pengajuan peminjaman berhasil dikirim" });
  } catch (err) {
    return serverError(err);
  }
}