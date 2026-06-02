// ============================================================
// types/index.ts
// Definisi interface untuk seluruh entitas aplikasi.
// Dirancang agar mudah diintegrasikan dengan MySQL nantinya.
// ============================================================

export type UserRole = "admin" | "user";
export type LoanStatus = "pending" | "active" | "returned" | "overdue";
export type BookStatus = "available" | "borrowed" | "maintenance";
export type NotificationType = "warning" | "overdue" | "approved" | "info";

// ── Buku ────────────────────────────────────────────────────
export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  stock: number;
  availableStock: number;
  location: string; // rak/lokasi
  coverUrl?: string;
  description?: string;
  year: number;
  status: BookStatus;
  createdAt: string;
}

// ── User/Anggota ─────────────────────────────────────────────
export interface LibraryUser {
  id: string;
  nisn: string;
  name: string;
  email: string;
  className: string; // kelas, misal "X TKJ 1"
  phone?: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  totalLoans: number;
  activeLoans: number;
}

// ── Peminjaman ───────────────────────────────────────────────
export interface Loan {
  id: string;
  userId: string;
  userName: string;
  userClass: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  borrowDate: string;       // ISO date string
  dueDate: string;          // batas pengembalian
  returnDate?: string;      // diisi saat dikembalikan
  status: LoanStatus;
  fineAmount: number;       // total denda (Rp)
  finePerDay: number;       // tarif denda per hari
  notes?: string;
}

// ── Denda ────────────────────────────────────────────────────
export interface FineConfig {
  pricePerDay: number;      // tarif denda per hari (Rp)
  updatedAt: string;
  updatedBy: string;
}

// ── Notifikasi ───────────────────────────────────────────────
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  loanId?: string;          // relasi ke peminjaman terkait
  fineAmount?: number;
}

// ── Statistik Admin ──────────────────────────────────────────
export interface AdminStats {
  totalBooks: number;
  totalUsers: number;
  activeLoans: number;
  totalFinesCollected: number;
  pendingLoans: number;
  overdueLoans: number;
}

// ── Mock Session ─────────────────────────────────────────────
export interface Session {
  user: LibraryUser;
  role: UserRole;
}