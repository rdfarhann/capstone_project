// app/api/books/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import { ok, created, badRequest, serverError } from "@/lib/apiResponse";

// ── GET /api/books ───────────────────────────────────────────
// Query params: ?search=&category=&status=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search   = searchParams.get("search")   ?? "";
    const category = searchParams.get("category") ?? "";
    const status   = searchParams.get("status")   ?? "";

    // Bangun query dinamis
    let sql = `
      SELECT
        b.id, b.title, b.author, b.publisher, b.isbn,
        b.stock, b.available_stock, b.location,
        b.cover_url, b.year, b.status, b.created_at,
        c.id   AS category_id,
        c.name AS category_name
      FROM  books b
      JOIN  categories c ON c.id = b.category_id
      WHERE 1=1
    `;
    
    // PERBAIKAN: Menggunakan Union Type manual yang aman dari ESLint (no-any) dan TypeScript
    const params: (string | number | boolean | Date | null)[] = [];

    if (search) {
      sql += " AND (b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (category) {
      sql += " AND c.name = ?";
      params.push(category);
    }
    if (status) {
      sql += " AND b.status = ?";
      params.push(status);
    }

    sql += " ORDER BY b.title ASC";

    const books = await query(sql, params);
    return ok(books);
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/books ──────────────────────────────────────────
// Body: { title, author, publisher, isbn, category_id, stock, location, year }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, author, publisher, isbn, category_id, stock, location, year } = body;

    // Validasi field wajib
    if (!title || !author || !publisher || !isbn || !category_id || !stock || !location || !year) {
      return badRequest("Semua field wajib diisi");
    }

    const result = await execute(
      `INSERT INTO books
        (title, author, publisher, isbn, category_id, stock, available_stock, location, year, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
      [title, author, publisher, isbn, category_id, stock, stock, location, year]
    );

    return created({ id: result.insertId, message: "Buku berhasil ditambahkan" });
  } catch (err: unknown) {
    // Duplicate ISBN
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      return badRequest("ISBN sudah terdaftar");
    }
    return serverError(err);
  }
}
// ── PUT /api/books?id=123 ────────────────────────────────────
// Body: { title, author, publisher, isbn, category_id, stock, location, year }
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return badRequest("ID buku wajib disertakan");

    const body = await req.json();
    const { title, author, publisher, isbn, category_id, stock, location, year } = body;

    if (!title || !author || !publisher || !isbn || !category_id || !stock || !location || !year) {
      return badRequest("Semua field wajib diisi");
    }

    // Ambil data lama untuk hitung available_stock
    const existing = await query<{ stock: number; available_stock: number }>(
      "SELECT stock, available_stock FROM books WHERE id = ?",
      [id]
    );
    if (!existing.length) return badRequest("Buku tidak ditemukan");

    // Hitung selisih stok yang sedang dipinjam
    const borrowed = existing[0].stock - existing[0].available_stock;
    const newAvailable = Math.max(Number(stock) - borrowed, 0);

    const result = await execute(
      `UPDATE books SET
        title          = ?,
        author         = ?,
        publisher      = ?,
        isbn           = ?,
        category_id    = ?,
        stock          = ?,
        available_stock = ?,
        location       = ?,
        year           = ?
       WHERE id = ?`,
      [title, author, publisher, isbn, category_id, stock, newAvailable, location, year, id]
    );

    if (result.affectedRows === 0) return badRequest("Buku tidak ditemukan");
    return ok({ message: "Buku berhasil diperbarui" });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      return badRequest("ISBN sudah terdaftar di buku lain");
    }
    return serverError(err);
  }
}

// ── DELETE /api/books?id=123 ─────────────────────────────────
// Soft delete: set status = 'maintenance' agar data historis tetap ada
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return badRequest("ID buku wajib disertakan");

    // Cek apakah buku sedang dipinjam
    const loans = await query<{ count: number }>(
      "SELECT COUNT(*) AS count FROM loans WHERE book_id = ? AND status IN ('active', 'pending')",
      [id]
    );
    if (loans[0].count > 0) {
      return badRequest("Buku tidak dapat dihapus karena sedang dipinjam");
    }

    const result = await execute(
      "UPDATE books SET status = 'maintenance' WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) return badRequest("Buku tidak ditemukan");
    return ok({ message: "Buku berhasil dinonaktifkan" });
  } catch (err) {
    return serverError(err);
  }
}