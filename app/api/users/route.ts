// app/api/users/route.ts
import { NextRequest } from "next/server";
import { query, execute } from "@/lib/db";
import bcrypt from "bcryptjs";
import { ok, created, badRequest, serverError } from "@/lib/apiResponse";

// ── GET /api/users ───────────────────────────────────────────
// Query params: ?search=&role=&class=&active=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") ?? "";
    const role   = searchParams.get("role")   ?? "";
    const cls    = searchParams.get("class")  ?? "";
    const active = searchParams.get("active") ?? "";

    let sql = `
      SELECT
        u.id, u.nisn, u.name, u.email,
        u.class_name, u.phone, u.role,
        u.is_active, u.avatar_url, u.created_at,
        COUNT(DISTINCT l.id)                                        AS total_loans,
        COUNT(DISTINCT CASE WHEN l.status IN ('active','pending')
                            THEN l.id END)                          AS active_loans
      FROM users u
      LEFT JOIN loans l ON l.user_id = u.id
      WHERE 1=1
    `;
    const params: (string | number | boolean | null)[] = [];

    if (search) {
      sql += " AND (u.name LIKE ? OR u.nisn LIKE ? OR u.email LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (role)   { sql += " AND u.role = ?";      params.push(role); }
    if (cls)    { sql += " AND u.class_name = ?"; params.push(cls); }
    if (active !== "") { sql += " AND u.is_active = ?"; params.push(Number(active)); }

    sql += " GROUP BY u.id ORDER BY u.name ASC";

    const users = await query(sql, params);
    return ok(users);
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/users ──────────────────────────────────────────
// Body: { nisn, name, email, class_name, phone?, role, password }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nisn, name, email, class_name, phone, role, password } = body;

    if (!nisn || !name || !email || !class_name || !password) {
      return badRequest("NISN, nama, email, kelas, dan password wajib diisi");
    }
    if (password.length < 8) {
      return badRequest("Password minimal 8 karakter");
    }

    // Cek duplikat NISN / email
    const existing = await query<{ id: number }>(
      "SELECT id FROM users WHERE nisn = ? OR email = ? LIMIT 1",
      [nisn, email]
    );
    if (existing.length) return badRequest("NISN atau email sudah terdaftar");

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await execute(
      `INSERT INTO users
        (nisn, name, email, class_name, phone, role, password, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [nisn, name, email.toLowerCase(), class_name, phone ?? null, role ?? "user", hashedPassword]
    );

    return created({ id: result.insertId, message: "Anggota berhasil ditambahkan" });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      return badRequest("NISN atau email sudah terdaftar");
    }
    return serverError(err);
  }
}

// ── PUT /api/users?id=123 ────────────────────────────────────
// Body: { nisn, name, email, class_name, phone?, role, password? }
// password opsional — hanya diupdate jika dikirim dan tidak kosong
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return badRequest("ID user wajib disertakan");

    const body = await req.json();
    const { nisn, name, email, class_name, phone, role, password } = body;

    if (!nisn || !name || !email || !class_name) {
      return badRequest("NISN, nama, email, dan kelas wajib diisi");
    }

    // Cek duplikat NISN / email di user LAIN
    const existing = await query<{ id: number }>(
      "SELECT id FROM users WHERE (nisn = ? OR email = ?) AND id != ? LIMIT 1",
      [nisn, email, id]
    );
    if (existing.length) return badRequest("NISN atau email sudah dipakai user lain");

    // Update dengan atau tanpa password
    if (password && password.trim() !== "") {
      if (password.length < 8) return badRequest("Password minimal 8 karakter");
      const hashedPassword = await bcrypt.hash(password, 10);
      await execute(
        `UPDATE users SET
          nisn = ?, name = ?, email = ?, class_name = ?,
          phone = ?, role = ?, password = ?
         WHERE id = ?`,
        [nisn, name, email.toLowerCase(), class_name, phone ?? null, role ?? "user", hashedPassword, id]
      );
    } else {
      await execute(
        `UPDATE users SET
          nisn = ?, name = ?, email = ?, class_name = ?,
          phone = ?, role = ?
         WHERE id = ?`,
        [nisn, name, email.toLowerCase(), class_name, phone ?? null, role ?? "user", id]
      );
    }

    return ok({ message: "Data anggota berhasil diperbarui" });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      return badRequest("NISN atau email sudah dipakai user lain");
    }
    return serverError(err);
  }
}

// ── PATCH /api/users?id=123 ──────────────────────────────────
// Body: { is_active: 0 | 1 }
// Toggle status aktif/nonaktif user
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return badRequest("ID user wajib disertakan");

    const body = await req.json();
    const { is_active } = body;

    if (is_active === undefined || (is_active !== 0 && is_active !== 1)) {
      return badRequest("Nilai is_active harus 0 atau 1");
    }

    const result = await execute(
      "UPDATE users SET is_active = ? WHERE id = ?",
      [is_active, id]
    );

    if (result.affectedRows === 0) return badRequest("User tidak ditemukan");

    return ok({
      message: is_active === 1 ? "Akun berhasil diaktifkan" : "Akun berhasil dinonaktifkan",
    });
  } catch (err) {
    return serverError(err);
  }
}

// ── DELETE /api/users?id=123 ─────────────────────────────────
// Hard delete — hanya jika tidak punya peminjaman aktif
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return badRequest("ID user wajib disertakan");

    // Cek peminjaman aktif
    const loans = await query<{ count: number }>(
      "SELECT COUNT(*) AS count FROM loans WHERE user_id = ? AND status IN ('active','pending')",
      [id]
    );
    if (loans[0].count > 0) {
      return badRequest("User tidak dapat dihapus karena masih memiliki peminjaman aktif");
    }

    const result = await execute("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) return badRequest("User tidak ditemukan");

    return ok({ message: "Anggota berhasil dihapus" });
  } catch (err) {
    return serverError(err);
  }
}