// app/dashboard/user/notifications/page.tsx
"use client";

import { useState } from "react";
import { useNotifications, apiCall, type NotificationRow } from "@/hooks/useApi";
import {
  Bell, AlertTriangle, CheckCircle,
  Info, RefreshCw, Megaphone, BookMarked,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// ── Config tipe notifikasi ───────────────────────────────────
const TYPE_CONFIG: Record<
  NotificationRow["type"],
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  overdue: {
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-100",
    label: "Keterlambatan",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    label: "Peringatan",
  },
  approved: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100",
    label: "Disetujui",
  },
  info: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-100",
    label: "Informasi",
  },
};

// ── Helpers ──────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7)  return `${days} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n);
}

// ── Notif Item ───────────────────────────────────────────────
function NotifItem({
  notif,
  onMarkRead,
}: {
  notif: NotificationRow;
  onMarkRead: (id: number) => void;
}) {
  const config = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.info;
  const Icon = config.icon;
  const unread = notif.is_read === 0;

  return (
    <div
      className={`rounded-xl border transition-all ${
        unread
          ? "border-l-4 border-l-[#2E7D32] bg-[#F1F8F1] shadow-sm"
          : "bg-white hover:shadow-sm"
      }`}
    >
      <div className="p-4 flex gap-3 items-start">
        {/* Icon */}
        <div className={`rounded-full p-2 ${config.bg} flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={`text-sm ${unread ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                {notif.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>

              {/* Denda jika ada */}
              {notif.fine_amount && notif.fine_amount > 0 && (
                <p className="text-xs text-red-600 font-semibold mt-1.5">
                  💰 Denda: {formatRupiah(notif.fine_amount)}
                </p>
              )}
            </div>

            {/* Unread dot */}
            {unread && (
              <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] flex-shrink-0 mt-1" />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
              >
                {config.label}
              </span>
              <span className="text-xs text-gray-400">{timeAgo(notif.created_at)}</span>
            </div>
            {unread && (
              <button
                onClick={() => onMarkRead(notif.id)}
                className="text-xs text-[#2E7D32] hover:text-[#1B5E20] font-medium transition-colors"
              >
                Tandai dibaca
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
// userId harus diisi dari session/auth — sesuaikan dengan
// implementasi auth di proyekmu (misal: useSession, useAuth, dll.)
const CURRENT_USER_ID = "1"; // TODO: ganti dengan userId dari session

export default function UserNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [markingAll, setMarkingAll] = useState(false);

  const { data: notifications, loading, error, refetch } =
    useNotifications(CURRENT_USER_ID, filter === "unread");

  const allNotifs = notifications ?? [];

  const filtered = allNotifs.filter((n) => {
    if (filter === "unread") return n.is_read === 0;
    if (filter === "read")   return n.is_read === 1;
    return true;
  });

  const unreadCount = allNotifs.filter((n) => n.is_read === 0).length;

  // Tandai satu notif sebagai dibaca
  async function markRead(id: number) {
    await apiCall(`/api/notifications?id=${id}`, "PATCH", { is_read: 1 });
    refetch();
  }

  // Tandai semua dibaca
  async function markAllRead() {
    setMarkingAll(true);
    await apiCall("/api/notifications/mark-all-read", "POST", { userId: CURRENT_USER_ID });
    await refetch();
    setMarkingAll(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="flex items-center gap-3 px-6 py-4 border-b bg-white flex-shrink-0">
        <SidebarTrigger className="text-gray-500 hover:text-gray-700" />
        <Separator orientation="vertical" className="h-5" />
        <Bell className="w-4 h-4 text-[#2E7D32]" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-800">Notifikasi</h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">Pembaruan dan pengingat untuk kamu</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              disabled={markingAll}
              className="flex items-center gap-1.5 text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium disabled:opacity-50 transition-colors border border-[#2E7D32] rounded-lg px-3 py-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {markingAll ? "Memproses..." : "Tandai Semua Dibaca"}
            </button>
          )}
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 bg-[#F9FBF9]">
        {/* Filter tabs */}
        <div className="flex gap-1 mb-5 bg-white border rounded-lg p-1 w-fit">
          {([
            { value: "all",    label: "Semua" },
            { value: "unread", label: "Belum Dibaca" },
            { value: "read",   label: "Sudah Dibaca" },
          ] as const).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === tab.value
                  ? "bg-[#2E7D32] text-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {tab.value === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            Gagal memuat notifikasi: {error}
          </div>
        )}

        {/* List notifikasi */}
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-white p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border bg-white py-14 text-center text-gray-400">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-gray-500">Tidak ada notifikasi</p>
              <p className="text-sm mt-1">
                {filter === "unread"
                  ? "Semua notifikasi sudah kamu baca 👍"
                  : "Belum ada notifikasi untuk kamu"}
              </p>
            </div>
          ) : (
            filtered.map((notif) => (
              <NotifItem key={notif.id} notif={notif} onMarkRead={markRead} />
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 text-center mt-4">
            Menampilkan {filtered.length} notifikasi
          </p>
        )}
      </main>
    </div>
  );
}