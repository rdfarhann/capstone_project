"use client";
// app/dashboard/user/page.tsx — Beranda User
import { BookOpen, Clock, AlertTriangle, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import { UserNavbar } from "@/components/user/Navbar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  mockLoans, mockNotifications, mockBooks,
  calculateFine, getDaysRemaining, formatRupiah, formatDate,
} from "@/lib/mockData";

const MY_USER_ID = "u1";
const MY_NAME    = "Budi Santoso";

export default function UserHomePage() {
  const myLoans         = mockLoans.filter(l => l.userId === MY_USER_ID);
  const activeLoans     = myLoans.filter(l => l.status === "active" || l.status === "overdue");
  const overdueLoans    = myLoans.filter(l => l.status === "overdue");
  const myNotifs        = mockNotifications.filter(n => n.userId === MY_USER_ID && !n.isRead);
  const availableBooks  = mockBooks.filter(b => b.availableStock > 0).length;

  return (
    <>
      <UserNavbar title="Beranda" subtitle={`Halo, ${MY_NAME}! 👋`} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-8 space-y-6">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:"Sedang Dipinjam",  value: activeLoans.length,    icon: BookOpen,       color:"text-[#1B5E20]",   bg:"bg-[#E8F5E9]",    ring:"ring-[#1B5E20]/10"  },
              { label:"Buku Terlambat",   value: overdueLoans.length,   icon: AlertTriangle,  color:"text-red-600",     bg:"bg-red-50",        ring:"ring-red-100"        },
              { label:"Notif Belum Dibaca",value: myNotifs.length,      icon: Bell,           color:"text-amber-600",   bg:"bg-amber-50",      ring:"ring-amber-100"      },
              { label:"Buku Tersedia",    value: availableBooks,        icon: BookOpen,        color:"text-blue-700",    bg:"bg-blue-50",       ring:"ring-blue-100"       },
            ].map(({ label, value, icon: Icon, color, bg, ring }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-xs hover:shadow-sm transition-shadow">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${bg} ${ring}`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium truncate">{label}</p>
                  <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Alert terlambat ── */}
          {overdueLoans.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-700">
                  {overdueLoans.length} buku terlambat dikembalikan!
                </p>
                <p className="text-xs text-red-600/80 mt-0.5">
                  Segera kembalikan untuk menghindari denda lebih besar.
                </p>
              </div>
              <Link href="/dashboard/user/history"
                className="shrink-0 text-xs font-semibold text-red-700 hover:underline underline-offset-2">
                Lihat →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* ── Buku aktif dipinjam ── */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h3 className="font-bold text-foreground">Buku Sedang Dipinjam</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeLoans.length} buku aktif</p>
                </div>
                <Link href="/dashboard/user/history"
                  className="text-xs font-semibold text-[#1B5E20] hover:underline underline-offset-2 flex items-center gap-1 shrink-0">
                  Semua <ArrowRight size={12} />
                </Link>
              </div>

              {activeLoans.length === 0 ? (
                <div className="py-14 text-center text-muted-foreground">
                  <BookOpen size={36} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Tidak ada buku yang sedang dipinjam</p>
                  <Link href="/dashboard/user/books"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#1B5E20] hover:underline">
                    Cari buku <ArrowRight size={11} />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {activeLoans.map(loan => {
                    const daysLeft = getDaysRemaining(loan.dueDate);
                    const fine     = calculateFine(loan.dueDate);
                    const isLate   = daysLeft < 0;
                    const isWarn   = daysLeft >= 0 && daysLeft <= 3;

                    return (
                      <div key={loan.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                        {/* Icon */}
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isLate ? "bg-red-100" : "bg-[#E8F5E9]"}`}>
                          <BookOpen size={18} className={isLate ? "text-red-600" : "text-[#1B5E20]"} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{loan.bookTitle}</p>
                          <p className="text-xs text-muted-foreground">{loan.bookAuthor}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-xs text-muted-foreground">
                              Kembali: <span className={isLate ? "text-red-600 font-semibold" : "text-foreground font-medium"}>
                                {formatDate(loan.dueDate)}
                              </span>
                            </span>
                            {fine > 0 && (
                              <span className="text-xs font-semibold text-red-600">
                                Denda: {formatRupiah(fine)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status + sisa hari */}
                        <div className="shrink-0 text-right space-y-1">
                          <StatusBadge status={loan.status} />
                          <p className={`text-[11px] font-semibold ${isLate ? "text-red-600" : isWarn ? "text-amber-600" : "text-green-600"}`}>
                            {isLate
                              ? `${Math.abs(daysLeft)} hari terlambat`
                              : `${daysLeft} hari lagi`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Notifikasi terbaru ── */}
            <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-bold text-foreground">Notifikasi</h3>
                <Link href="/dashboard/user/notifications"
                  className="text-xs font-semibold text-[#1B5E20] hover:underline underline-offset-2 shrink-0">
                  Semua →
                </Link>
              </div>

              {myNotifs.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  <Bell size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Tidak ada notifikasi baru</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {myNotifs.slice(0, 4).map(notif => {
                    const isOverdue  = notif.type === "overdue";
                    const isWarning  = notif.type === "warning";
                    const isApproved = notif.type === "approved";
                    return (
                      <div key={notif.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors">
                        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          isOverdue  ? "bg-red-100" :
                          isWarning  ? "bg-amber-100" :
                          isApproved ? "bg-green-100" : "bg-blue-100"
                        }`}>
                          {isOverdue  && <AlertTriangle size={13} className="text-red-600" />}
                          {isWarning  && <Clock         size={13} className="text-amber-600" />}
                          {isApproved && <BookOpen      size={13} className="text-green-700" />}
                          {!isOverdue && !isWarning && !isApproved && <Bell size={13} className="text-blue-700" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground leading-snug">{notif.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Buku rekomendasi ── */}
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h3 className="font-bold text-foreground">Buku Tersedia</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Buku yang bisa dipinjam sekarang</p>
              </div>
              <Link href="/dashboard/user/books"
                className="text-xs font-semibold text-[#1B5E20] hover:underline underline-offset-2 flex items-center gap-1 shrink-0">
                Lihat Semua <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-border">
              {mockBooks.filter(b => b.availableStock > 0).slice(0, 4).map(book => (
                <div key={book.id} className="p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5E9] mb-3">
                    <BookOpen size={18} className="text-[#1B5E20]" />
                  </div>
                  <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{book.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-semibold text-[#1B5E20]">
                      {book.availableStock}/{book.stock} tersedia
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}