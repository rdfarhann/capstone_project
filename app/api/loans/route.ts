// app/api/loans/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import { ok, created, badRequest, serverError,  unauthorized, forbidden } from "@/lib/apiResponse";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


const JWT_SECRET = process.env.JWT_SECRET ?? "";

// ── Helper: ambil user dari cookie JWT ───────────────────────
async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as {
      id: number; role: "admin" | "user"; name: string;
    };
  } catch {
    return null;
  }
}

// ── Helper: hitung denda ─────────────────────────────────────
async function calcFine(dueDate: string, returnDate?: string): Promise<number> {
  const config = await query<{ price_per_day: number }>(
    "SELECT price_per_day FROM fine_config ORDER BY updated_at DESC LIMIT 1"
  );
  const pricePerDay = config[0]?.price_per_day ?? 1000;
  const due    = new Date(dueDate);
  const ret    = returnDate ? new Date(returnDate) : new Date();
  const days   = Math.floor((ret.getTime() - due.getTime()) / 86_400_000);
  return days > 0 ? days * pricePerDay : 0;
}

// ── GET /api/loans ───────────────────────────────────────────
// Admin: semua loan. User: hanya loan milik sendiri.
// Query params: ?status=&userId=&search=
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized("Belum login");

    const { searchParams } = req.nextUrl;
    const status  = searchParams.get("status")  ?? "";
    const userId  = searchParams.get("userId")  ?? "";
    const search  = searchParams.get("search")  ?? "";

    let sql = `
      SELECT
        l.id, l.user_id, l.book_id,
        l.borrow_date, l.due_date, l.return_date,
        l.status, l.notes,
        COALESCE(l.fine_amount, 0)   AS fine_amount,
        COALESCE(fc.price_per_day,0) AS fine_per_day,
        u.name   AS user_name,
        u.class_name AS user_class,
        b.title  AS book_title,
        b.author AS book_author,
        -- Hari terlambat (0 jika belum/tidak terlambat)
        GREATEST(0, DATEDIFF(
          COALESCE(l.return_date, CURDATE()), l.due_date
        )) AS days_overdue,
        -- Hari tersisa (negatif jika sudah lewat)
        GREATEST(0, DATEDIFF(l.due_date, CURDATE())) AS days_remaining
      FROM loans l
      JOIN users u  ON u.id = l.user_id
      JOIN books b  ON b.id = l.book_id
      LEFT JOIN fine_config fc ON fc.id = (
        SELECT id FROM fine_config ORDER BY updated_at DESC LIMIT 1
      )
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    // Non-admin hanya bisa lihat milik sendiri
    if (user.role !== "admin") {
      sql += " AND l.user_id = ?";
      params.push(user.id);
    } else if (userId) {
      sql += " AND l.user_id = ?";
      params.push(userId);
    }

    if (status) { sql += " AND l.status = ?"; params.push(status); }
    if (search) {
      sql += " AND (b.title LIKE ? OR u.name LIKE ? OR u.nisn LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    sql += " ORDER BY l.borrow_date DESC";

    const loans = await query(sql, params);
    return ok(loans);
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/loans ──────────────────────────────────────────
// Siswa ajukan pinjam buku. Body: { book_id }
// Admin bisa ajukan untuk user lain. Body: { book_id, user_id, borrow_date?, due_date? }
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized("Belum login");

    const body = await req.json();
    const bookId = Number(body.book_id);
    if (!bookId) return badRequest("ID buku wajib diisi");

    // Target user: admin bisa pilih, siswa = dirinya sendiri
    const targetUserId = user.role === "admin" && body.user_id
      ? Number(body.user_id)
      : user.id;

    // Cek buku tersedia
    const books = await query<{ id: number; available_stock: number; status: string }>(
      "SELECT id, available_stock, status FROM books WHERE id = ? LIMIT 1",
      [bookId]
    );
    if (!books.length) return badRequest("Buku tidak ditemukan");
    if (books[0].available_stock < 1 || books[0].status !== "available") {
      return badRequest("Buku tidak tersedia untuk dipinjam");
    }

    // Cek user tidak punya peminjaman aktif buku yang sama
    const existing = await query<{ id: number }>(
      "SELECT id FROM loans WHERE user_id = ? AND book_id = ? AND status IN ('pending','active') LIMIT 1",
      [targetUserId, bookId]
    );
    if (existing.length) return badRequest("Kamu sudah meminjam buku ini");

    // Hitung tanggal
    const borrowDate = body.borrow_date ?? new Date().toISOString().split("T")[0];
    const dueDate    = body.due_date ?? (() => {
      const d = new Date(); d.setDate(d.getDate() + 14);
      return d.toISOString().split("T")[0];
    })();

    // Status: admin langsung active, siswa = pending
    const status = user.role === "admin" ? "active" : "pending";

    const result = await execute(
      `INSERT INTO loans (user_id, book_id, borrow_date, due_date, status, fine_amount)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [targetUserId, bookId, borrowDate, dueDate, status]
    );

    // Kurangi available_stock jika langsung active
    if (status === "active") {
      await execute(
        "UPDATE books SET available_stock = available_stock - 1 WHERE id = ? AND available_stock > 0",
        [bookId]
      );
    }

    return created({ id: result.insertId, message: "Pengajuan peminjaman berhasil dikirim" });
  } catch (err) {
    return serverError(err);
  }
}

// ── PATCH /api/loans?id=123 ──────────────────────────────────
// Body: { action: "approve" | "return" | "reject" }
// approve → active (admin only)
// return  → returned, hitung denda
// reject  → rejected (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return unauthorized("Belum login");

    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return badRequest("ID peminjaman wajib disertakan");

    const body = await req.json();
    const { action } = body as { action: "approve" | "return" | "reject" };

    // Ambil data loan
    const loans = await query<{
      id: number; user_id: number; book_id: number;
      status: string; due_date: string;
    }>(
      "SELECT id, user_id, book_id, status, due_date FROM loans WHERE id = ? LIMIT 1",
      [id]
    );
    if (!loans.length) return badRequest("Data peminjaman tidak ditemukan");
    const loan = loans[0];

    // Validasi hak akses: siswa hanya bisa return miliknya sendiri
    if (user.role !== "admin" && action !== "return") {
      return forbidden("Akses ditolak");
    }
    if (user.role !== "admin" && loan.user_id !== user.id) {
      return forbidden("Akses ditolak");
    }

    if (action === "approve") {
      // Admin approve: pending → active
      if (loan.status !== "pending") return badRequest("Peminjaman bukan dalam status pending");
      await execute("UPDATE loans SET status = 'active' WHERE id = ?", [id]);
      await execute(
        "UPDATE books SET available_stock = available_stock - 1 WHERE id = ? AND available_stock > 0",
        [loan.book_id]
      );
      return ok({ message: "Peminjaman disetujui" });
    }

    if (action === "return") {
      // Siswa/admin ajukan pengembalian: active/overdue → returned
      if (!["active", "overdue", "pending"].includes(loan.status)) {
        return badRequest("Buku sudah dikembalikan");
      }
      const returnDate = new Date().toISOString().split("T")[0];
      const fineAmount = await calcFine(loan.due_date, returnDate);

      await execute(
        `UPDATE loans
         SET status = 'returned', return_date = ?, fine_amount = ?
         WHERE id = ?`,
        [returnDate, fineAmount, id]
      );
      // Kembalikan stok
      await execute(
        "UPDATE books SET available_stock = available_stock + 1 WHERE id = ?",
        [loan.book_id]
      );
      return ok({
        message: "Pengembalian berhasil dicatat",
        data: { fine_amount: fineAmount, return_date: returnDate },
      });
    }

    if (action === "reject") {
      // Admin reject: pending → rejected (atau hapus saja)
      if (loan.status !== "pending") return badRequest("Hanya peminjaman pending yang bisa ditolak");
      await execute("UPDATE loans SET status = 'returned', notes = 'Ditolak admin' WHERE id = ?", [id]);
      return ok({ message: "Pengajuan ditolak" });
    }

    return badRequest("Action tidak valid. Gunakan: approve, return, atau reject");
  } catch (err) {
    return serverError(err);
  }
}

// ── PUT /api/loans?id=123 ────────────────────────────────────
// Admin edit data peminjaman. Body: { due_date?, notes?, status? }
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") return forbidden("Akses ditolak");

    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return badRequest("ID peminjaman wajib disertakan");

    const body = await req.json();
    const { due_date, notes, status } = body;

    const result = await execute(
      `UPDATE loans
       SET due_date = COALESCE(?, due_date),
           notes    = COALESCE(?, notes),
           status   = COALESCE(?, status)
       WHERE id = ?`,
      [due_date ?? null, notes ?? null, status ?? null, id]
    );

    if (result.affectedRows === 0) return badRequest("Data peminjaman tidak ditemukan");
    return ok({ message: "Data peminjaman diperbarui" });
  } catch (err) {
    return serverError(err);
  }
}

// ── DELETE /api/loans?id=123 ─────────────────────────────────
// Admin hapus data peminjaman (hanya yang sudah returned)
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") return forbidden("Akses ditolak");

    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return badRequest("ID peminjaman wajib disertakan");

    const loans = await query<{ status: string }>(
      "SELECT status FROM loans WHERE id = ? LIMIT 1", [id]
    );
    if (!loans.length) return badRequest("Data tidak ditemukan");
    if (loans[0].status === "active") {
      return badRequest("Tidak bisa hapus peminjaman yang masih aktif");
    }

    await execute("DELETE FROM loans WHERE id = ?", [id]);
    return ok({ message: "Data peminjaman dihapus" });
  } catch (err) {
    return serverError(err);
  }
}