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