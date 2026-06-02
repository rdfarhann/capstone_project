// ============================================================
// lib/mockData.ts
// Data dummy untuk demo & kalkulasi denda.
// Tanggal disesuaikan relatif terhadap hari ini.
// ============================================================

import type { Book, LibraryUser, Loan, Notification, FineConfig, AdminStats } from "@/types";

// ── Tarif Denda ──────────────────────────────────────────────
export const fineConfig: FineConfig = {
  pricePerDay: 1000, // Rp 1.000 / hari
  updatedAt: "2026-01-01",
  updatedBy: "Admin",
};

/**
 * Menghitung jumlah denda berdasarkan tanggal batas dan tanggal sekarang.
 * @param dueDate    - Tanggal batas pengembalian (ISO string)
 * @param returnDate - Tanggal pengembalian aktual (opsional, default: hari ini)
 * @param pricePerDay - Tarif denda per hari
 * @returns Nominal denda dalam Rupiah (0 jika belum terlambat)
 */
export function calculateFine(
  dueDate: string,
  returnDate?: string,
  pricePerDay: number = fineConfig.pricePerDay
): number {
  const due    = new Date(dueDate);
  const actual = returnDate ? new Date(returnDate) : new Date();
  due.setHours(0, 0, 0, 0);
  actual.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((actual.getTime() - due.getTime()) / 86_400_000);
  return diffDays > 0 ? diffDays * pricePerDay : 0;
}

/**
 * Menghitung sisa hari peminjaman.
 * Nilai negatif = sudah melewati batas.
 */
export function getDaysRemaining(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / 86_400_000);
}

/** Format Rupiah */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(amount);
}

/** Format tanggal ke dd MMM yyyy */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

/** Helper: tanggal relatif dari hari ini */
function daysAgo(n: number)   { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split("T")[0]; }
function daysAhead(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split("T")[0]; }

// ── Mock Books ───────────────────────────────────────────────
export const mockBooks: Book[] = [
  { id: "b1", title: "Pemrograman Web dengan PHP & MySQL", author: "Abdul Kadir",    publisher: "Andi Publisher",   isbn: "978-979-29-1234-5", category: "Teknologi",  stock: 5, availableStock: 3, location: "Rak A-01", year: 2022, status: "available",  createdAt: "2026-01-10" },
  { id: "b2", title: "Algoritma & Pemrograman",            author: "Rinaldi Munir",  publisher: "Informatika",      isbn: "978-602-1234-56-7", category: "Teknologi",  stock: 4, availableStock: 0, location: "Rak A-02", year: 2021, status: "borrowed",   createdAt: "2026-01-10" },
  { id: "b3", title: "Akuntansi Dasar",                    author: "Hendi Somantri", publisher: "Armico",           isbn: "978-979-1234-78-9", category: "Akuntansi", stock: 6, availableStock: 4, location: "Rak B-01", year: 2023, status: "available",  createdAt: "2026-01-11" },
  { id: "b4", title: "Bahasa Indonesia Kelas X",           author: "Kemdikbud",      publisher: "Kemendikbud",      isbn: "978-602-282-123-4", category: "Bahasa",    stock: 10,availableStock: 7, location: "Rak C-01", year: 2023, status: "available",  createdAt: "2026-01-12" },
  { id: "b5", title: "Matematika Teknik",                  author: "Erwin Kreyszig", publisher: "Erlangga",         isbn: "978-979-099-123-5", category: "Matematika",stock: 3, availableStock: 1, location: "Rak C-02", year: 2020, status: "available",  createdAt: "2026-01-12" },
  { id: "b6", title: "Jaringan Komputer",                  author: "Forouzan",       publisher: "Salemba Teknika",  isbn: "978-979-061-234-6", category: "Teknologi",  stock: 4, availableStock: 2, location: "Rak A-03", year: 2022, status: "available",  createdAt: "2026-01-15" },
  { id: "b7", title: "Ekonomi Makro",                      author: "Sadono Sukirno", publisher: "Raja Grafindo",    isbn: "978-979-769-234-5", category: "Ekonomi",   stock: 5, availableStock: 5, location: "Rak B-02", year: 2021, status: "available",  createdAt: "2026-01-15" },
  { id: "b8", title: "Pengantar Bisnis",                   author: "Madura",         publisher: "Salemba Empat",    isbn: "978-979-061-345-6", category: "Bisnis",    stock: 3, availableStock: 0, location: "Rak B-03", year: 2023, status: "borrowed",   createdAt: "2026-01-16" },
];

// ── Mock Users ───────────────────────────────────────────────
export const mockUsers: LibraryUser[] = [
  { id: "u1", nisn: "0012345678", name: "Budi Santoso",  email: "budi@smkn1ga.sch.id",  className: "X TKJ 1",   phone: "081234567890", role: "user",  isActive: true,  createdAt: "2026-07-15", totalLoans: 5,  activeLoans: 1 },
  { id: "u2", nisn: "0023456789", name: "Siti Rahayu",   email: "siti@smkn1ga.sch.id",  className: "XI AK 2",   phone: "082345678901", role: "user",  isActive: true,  createdAt: "2026-07-15", totalLoans: 8,  activeLoans: 2 },
  { id: "u3", nisn: "0034567890", name: "Andi Wijaya",   email: "andi@smkn1ga.sch.id",  className: "XII TKJ 1", phone: "083456789012", role: "user",  isActive: true,  createdAt: "2026-07-15", totalLoans: 12, activeLoans: 0 },
  { id: "u4", nisn: "0045678901", name: "Dewi Lestari",  email: "dewi@smkn1ga.sch.id",  className: "X AK 1",    phone: "084567890123", role: "user",  isActive: false, createdAt: "2026-07-16", totalLoans: 3,  activeLoans: 0 },
  { id: "u5", nisn: "0056789012", name: "Rizki Pratama", email: "rizki@smkn1ga.sch.id", className: "XI TKJ 2",  phone: "085678901234", role: "user",  isActive: true,  createdAt: "2026-07-16", totalLoans: 7,  activeLoans: 1 },
  { id: "u6", nisn: "0067890123", name: "Nur Hidayah",   email: "nur@smkn1ga.sch.id",   className: "XII AK 1",  phone: "086789012345", role: "user",  isActive: true,  createdAt: "2026-07-17", totalLoans: 15, activeLoans: 1 },
  { id: "a1", nisn: "ADMIN001",   name: "Pak Surya",     email: "admin@smkn1ga.sch.id", className: "Staff",                            role: "admin", isActive: true,  createdAt: "2026-01-01", totalLoans: 0,  activeLoans: 0 },
];

// ── Mock Loans (tanggal relatif terhadap hari ini) ────────────
export const mockLoans: Loan[] = [
  // Aktif — batas 5 hari ke depan
  { id: "l1", userId: "u1", userName: "Budi Santoso",  userClass: "X TKJ 1",   bookId: "b1", bookTitle: "Pemrograman Web dengan PHP & MySQL", bookAuthor: "Abdul Kadir",    borrowDate: daysAgo(9),  dueDate: daysAhead(5),  status: "active",   fineAmount: 0, finePerDay: 1000 },
  // Terlambat — sudah lewat 3 hari
  { id: "l2", userId: "u2", userName: "Siti Rahayu",   userClass: "XI AK 2",   bookId: "b2", bookTitle: "Algoritma & Pemrograman",            bookAuthor: "Rinaldi Munir",  borrowDate: daysAgo(17), dueDate: daysAgo(3),    status: "overdue",  fineAmount: 0, finePerDay: 1000 },
  // Aktif — batas 2 hari ke depan (hampir habis)
  { id: "l3", userId: "u2", userName: "Siti Rahayu",   userClass: "XI AK 2",   bookId: "b8", bookTitle: "Pengantar Bisnis",                   bookAuthor: "Madura",         borrowDate: daysAgo(12), dueDate: daysAhead(2),  status: "active",   fineAmount: 0, finePerDay: 1000 },
  // Dikembalikan tepat waktu
  { id: "l4", userId: "u3", userName: "Andi Wijaya",   userClass: "XII TKJ 1", bookId: "b3", bookTitle: "Akuntansi Dasar",                    bookAuthor: "Hendi Somantri", borrowDate: daysAgo(20), dueDate: daysAgo(6),    returnDate: daysAgo(6), status: "returned", fineAmount: 0, finePerDay: 1000 },
  // Terlambat — sudah lewat 5 hari
  { id: "l5", userId: "u5", userName: "Rizki Pratama", userClass: "XI TKJ 2",  bookId: "b6", bookTitle: "Jaringan Komputer",                  bookAuthor: "Forouzan",       borrowDate: daysAgo(19), dueDate: daysAgo(5),    status: "overdue",  fineAmount: 0, finePerDay: 1000 },
  // Pending — menunggu approval
  { id: "l6", userId: "u6", userName: "Nur Hidayah",   userClass: "XII AK 1",  bookId: "b5", bookTitle: "Matematika Teknik",                  bookAuthor: "Erwin Kreyszig", borrowDate: daysAgo(1),  dueDate: daysAhead(13), status: "pending",  fineAmount: 0, finePerDay: 1000 },
];

// ── Mock Notifications ────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: "n1", userId: "u1", type: "warning",  title: "Batas Pengembalian Dekat",   message: "Buku 'Pemrograman Web dengan PHP & MySQL' harus dikembalikan dalam 5 hari.", isRead: false, createdAt: new Date().toISOString(), loanId: "l1" },
  { id: "n2", userId: "u2", type: "overdue",  title: "Buku Terlambat!",            message: "Buku 'Algoritma & Pemrograman' sudah 3 hari melewati batas. Denda berjalan Rp 3.000.", isRead: false, createdAt: new Date().toISOString(), loanId: "l2", fineAmount: 3000 },
  { id: "n3", userId: "u5", type: "overdue",  title: "Buku Terlambat!",            message: "Buku 'Jaringan Komputer' sudah 5 hari melewati batas. Segera kembalikan.", isRead: true,  createdAt: new Date().toISOString(), loanId: "l5", fineAmount: 5000 },
  { id: "n4", userId: "u6", type: "approved", title: "Pengajuan Disetujui",        message: "Pengajuan pinjam 'Matematika Teknik' telah disetujui. Silakan ambil di perpustakaan.", isRead: false, createdAt: new Date().toISOString(), loanId: "l6" },
];

// ── Admin Stats ───────────────────────────────────────────────
export const mockAdminStats: AdminStats = {
  totalBooks:           mockBooks.length,
  totalUsers:           mockUsers.filter(u => u.role === "user").length,
  activeLoans:          mockLoans.filter(l => l.status === "active" || l.status === "overdue").length,
  totalFinesCollected:  8000, // denda yang sudah dibayar (mock)
  pendingLoans:         mockLoans.filter(l => l.status === "pending").length,
  overdueLoans:         mockLoans.filter(l => l.status === "overdue").length,
};

// ── Trend Data (mock chart) ───────────────────────────────────
export const loanTrendData = [
  { month: "Jan", loans: 24 },
  { month: "Feb", loans: 31 },
  { month: "Mar", loans: 28 },
  { month: "Apr", loans: 45 },
  { month: "Mei", loans: 38 },
  { month: "Jun", loans: 52 },
];