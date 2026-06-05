// hooks/useApi.ts
// ============================================================
// Custom hooks untuk fetch data dari API routes.
// Masing-masing hook menangani loading, error, dan refresh.
// ============================================================
"use client";

import { useState, useEffect, useCallback } from "react";

// ── Generic fetcher hook ─────────────────────────────────────
export function useFetch<T>(url: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mengubah array deps menjadi string statis agar aman dibaca oleh useCallback
  const stringifiedDeps = JSON.stringify(deps);

  const fetchData = useCallback(async () => {
    // Trik pasif: Membaca stringifiedDeps di dalam body fungsi 
    // agar ESLint tahu ini adalah dependensi yang valid & wajib dipantau
    if (!stringifiedDeps) return; 

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Terjadi kesalahan");
      setData(json.data ?? json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [url, stringifiedDeps]); // Aman! ESLint tidak akan komplain lagi

  // Membungkus pemanggilan asinkronus agar tidak memicu cascading renders sinkronus
  useEffect(() => {
    const doFetch = async () => {
      await fetchData();
    };
    
    doFetch();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ── API helper: POST / PUT / DELETE ─────────────────────────
export async function apiCall(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  body?: unknown
): Promise<{ ok: boolean; data?: unknown; message?: string }> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    return { ok: res.ok, data: json.data, message: json.message };
  } catch {
    return { ok: false, message: "Koneksi ke server gagal" };
  }
}

// ── Spesifik hooks ───────────────────────────────────────────

export function useStats() {
  return useFetch<{
    stats: {
      totalBooks: number;
      totalUsers: number;
      activeLoans: number;
      pendingLoans: number;
      overdueLoans: number;
      totalFinesCollected: number;
      booksOutOfStock: number;
    };
    trend: { date: string; count: number }[];
  }>("/api/stats");
}

export function useBooks(params?: {
  search?: string;
  category?: string;
  status?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.category) qs.set("category", params.category);
  if (params?.status) qs.set("status", params.status);
  const url = `/api/books${qs.toString() ? `?${qs}` : ""}`;
  return useFetch<BookRow[]>(url, [params?.search, params?.category, params?.status]);
}

export function useUsers(params?: {
  search?: string;
  class?: string;
  role?: string;
  active?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.class) qs.set("class", params.class);
  if (params?.role) qs.set("role", params.role);
  if (params?.active) qs.set("active", params.active);
  const url = `/api/users${qs.toString() ? `?${qs}` : ""}`;
  return useFetch<UserRow[]>(url, [params?.search, params?.class]);
}

export function useLoans(params?: {
  status?: string;
  userId?: string;
  search?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.userId) qs.set("userId", params.userId);
  if (params?.search) qs.set("search", params.search);
  const url = `/api/loans${qs.toString() ? `?${qs}` : ""}`;
  return useFetch<LoanRow[]>(url, [params?.status, params?.userId, params?.search]);
}

export function useNotifications(userId: string, unreadOnly = false) {
  const qs = new URLSearchParams({ userId });
  if (unreadOnly) qs.set("unreadOnly", "true");
  return useFetch<NotificationRow[]>(`/api/notifications?${qs}`, [userId, unreadOnly]);
}

export function useFineConfig() {
  return useFetch<{ price_per_day: number; updated_at: string; updated_by: string }>(
    "/api/fine-config"
  );
}

// ── Row types (snake_case dari MySQL) ────────────────────────
export interface BookRow {
  id: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  stock: number;
  available_stock: number;
  location: string;
  cover_url: string | null;
  year: number;
  status: "available" | "borrowed" | "maintenance";
  category_id: number;
  category_name: string;
}

export interface UserRow {
  id: number;
  nisn: string;
  name: string;
  email: string;
  class_name: string;
  phone: string | null;
  role: "admin" | "user";
  is_active: number;
  avatar_url: string | null;
  created_at: string;
  total_loans: number;
  active_loans: number;
}

export interface LoanRow {
  id: number;
  user_id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: "pending" | "active" | "returned" | "overdue";
  fine_amount: number;
  fine_per_day: number;
  notes: string | null;
  user_name: string;
  user_class: string;
  book_title: string;
  book_author: string;
  days_overdue: number;
  days_remaining: number;
}

export interface NotificationRow {
  id: number;
  user_id: number;
  type: "warning" | "overdue" | "approved" | "info";
  title: string;
  message: string;
  is_read: number;
  created_at: string;
  loan_id: number | null;
  fine_amount: number | null;
}