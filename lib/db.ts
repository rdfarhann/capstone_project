// lib/db.ts
// ============================================================
// Koneksi MySQL menggunakan mysql2/promise dengan connection
// pool agar efisien — tidak buat koneksi baru setiap request.
// Singleton pattern: pool dibuat sekali, dipakai ulang.
// ============================================================

import mysql from "mysql2/promise";

// Tipe hasil query generic
export type QueryResult<T> = T[];

// Singleton pool — disimpan di global agar tidak dibuat ulang
// saat Next.js hot-reload di development
declare global {
  // Diturunkan ke var karena global scoping di Node.js membutuhkan 'var'
  var _mysqlPool: mysql.Pool | undefined;
}

function createPool(): mysql.Pool {
  return mysql.createPool({
    host:               process.env.DB_HOST     ?? "localhost",
    port:               Number(process.env.DB_PORT ?? 3306),
    user:               process.env.DB_USER     ?? "root",
    password:           process.env.DB_PASSWORD ?? "",
    database:           process.env.DB_NAME     ?? "perpustakaan_smkn1ga",
    waitForConnections: true,
    connectionLimit:    10,       // maks 10 koneksi paralel
    queueLimit:         0,        // antrian tidak terbatas
    timezone:           "+07:00", // WIB
    charset:            "utf8mb4",
  });
}

// Gunakan pool yang sudah ada, atau buat baru
const pool: mysql.Pool =
  globalThis._mysqlPool ?? (globalThis._mysqlPool = createPool());

export default pool;

// Definisi tipe parameter yang diterima oleh mysql2 secara internal
type QueryValues = string | number | boolean | Date | null | Buffer | QueryValues[];

// ── Helper: jalankan query dengan parameter ──────────────────
/**
 * Eksekusi SELECT query, return array of rows.
 * @example
 * const books = await query<Book>("SELECT * FROM books WHERE id = ?", [id]);
 */
export async function query<T>(
  sql: string,
  params?: QueryValues[]
): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

/**
 * Eksekusi INSERT / UPDATE / DELETE.
 * Return ResultSetHeader (insertId, affectedRows, dll).
 */
export async function execute(
  sql: string,
  params?: QueryValues[]
): Promise<mysql.ResultSetHeader> {
  const [result] = await pool.execute(sql, params);
  return result as mysql.ResultSetHeader;
}

/**
 * Eksekusi stored procedure.
 * @example
 * const result = await callProcedure("CALL approve_loan(?, ?)", [loanId, adminId]);
 */
export async function callProcedure(
  sql: string,
  params?: QueryValues[]
): Promise<unknown[][]> {
  const [results] = await pool.execute(sql, params);
  return results as unknown[][];
}