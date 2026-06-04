// app/api/books/[id]/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import { ok, badRequest, notFound, noContent, serverError } from "@/lib/apiResponse";

type Params = { params: { id: string } };

// ── GET /api/books/:id ───────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const rows = await query(
      `SELECT b.*, c.name AS category_name
       FROM books b JOIN categories c ON c.id = b.category_id
       WHERE b.id = ?`,
      [params.id]
    );
    if (!rows.length) return notFound("Buku tidak ditemukan");
    return ok(rows[0]);
  } catch (err) {
    return serverError(err);
  }
}

// ── PUT /api/books/:id ───────────────────────────────────────
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    const { title, author, publisher, isbn, category_id, stock, location, year } = body;

    if (!title || !author || !publisher || !isbn || !category_id || !stock || !location || !year) {
      return badRequest("Semua field wajib diisi");
    }

    // Hitung available_stock: jaga agar tidak negatif
    const existing = await query<{ stock: number; available_stock: number }>(
      "SELECT stock, available_stock FROM books WHERE id = ?",
      [params.id]
    );
    if (!existing.length) return notFound("Buku tidak ditemukan");

    const borrowed     = existing[0].stock - existing[0].available_stock;
    const newAvailable = Math.max(0, Number(stock) - borrowed);
    const newStatus    = newAvailable === 0 ? "borrowed" : "available";

    await execute(
      `UPDATE books SET
        title = ?, author = ?, publisher = ?, isbn = ?,
        category_id = ?, stock = ?, available_stock = ?,
        location = ?, year = ?, status = ?
       WHERE id = ?`,
      [title, author, publisher, isbn, category_id, stock, newAvailable, location, year, newStatus, params.id]
    );

    return ok({ message: "Buku berhasil diperbarui" });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      return badRequest("ISBN sudah digunakan buku lain");
    }
    return serverError(err);
  }
}

// ── DELETE /api/books/:id ─────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    // Cegah hapus buku yang sedang dipinjam
    const active = await query<{ count: number }>(
      "SELECT COUNT(*) AS count FROM loans WHERE book_id = ? AND status IN ('active','overdue','pending')",
      [params.id]
    );
    if (active[0].count > 0) {
      return badRequest("Tidak bisa hapus buku yang sedang dipinjam");
    }

    const result = await execute("DELETE FROM books WHERE id = ?", [params.id]);
    if (result.affectedRows === 0) return notFound("Buku tidak ditemukan");

    return noContent();
  } catch (err) {
    return serverError(err);
  }
}