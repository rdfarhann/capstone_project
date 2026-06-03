"use client";
// app/dashboard/user/notifications/page.tsx
import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Clock, Info, Check, Trash2, BookOpen, X } from "lucide-react";
import { UserNavbar } from "@/components/user/Navbar";
import { Button } from "@/components/ui/button";
import { formatDate, formatRupiah, mockNotifications } from "@/lib/mockData";
import type { Notification, NotificationType } from "@/types";

const MY_USER_ID = "u1";

const NOTIF_CFG: Record<NotificationType, {
  Icon: React.ElementType;
  bg: string;
  iconBg: string;
  border: string;
  label: string;
  textColor: string;
}> = {
  warning:  { Icon: Clock,         bg:"bg-amber-50",  iconBg:"bg-amber-100",  border:"border-amber-200",  label:"Peringatan",  textColor:"text-amber-700"  },
  overdue:  { Icon: AlertTriangle, bg:"bg-red-50",    iconBg:"bg-red-100",    border:"border-red-200",    label:"Terlambat",   textColor:"text-red-700"    },
  approved: { Icon: CheckCircle,   bg:"bg-green-50",  iconBg:"bg-green-100",  border:"border-green-200",  label:"Disetujui",   textColor:"text-green-700"  },
  info:     { Icon: Info,          bg:"bg-blue-50",   iconBg:"bg-blue-100",   border:"border-blue-200",   label:"Informasi",   textColor:"text-blue-700"   },
};

export default function UserNotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>(
    mockNotifications.filter(n => n.userId === MY_USER_ID)
  );

  const unread    = notifs.filter(n => !n.isRead).length;
  const markRead  = (id: string) => setNotifs(p => p.map(n => n.id === id ? { ...n, isRead:true } : n));
  const markAll   = () => setNotifs(p => p.map(n => ({ ...n, isRead:true })));
  const deleteOne = (id: string) => setNotifs(p => p.filter(n => n.id !== id));

  return (
    <>
      <UserNavbar title="Notifikasi" subtitle={unread > 0 ? `${unread} belum dibaca` : "Semua sudah dibaca"} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8 space-y-5">

          {/* Header action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5E9]">
                <Bell size={18} className="text-[#1B5E20]" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {notifs.length} notifikasi
                </p>
                <p className="text-xs text-muted-foreground">{unread} belum dibaca</p>
              </div>
            </div>
            {unread > 0 && (
              <Button variant="outline" size="sm" onClick={markAll} className="gap-1.5 text-xs">
                <Check size={13} /> Tandai Semua Dibaca
              </Button>
            )}
          </div>

          {/* List */}
          {notifs.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card py-24 text-center">
              <Bell size={44} className="mx-auto mb-3 text-muted-foreground/20" />
              <p className="font-medium text-muted-foreground">Tidak ada notifikasi</p>
              <p className="mt-1 text-xs text-muted-foreground/60">Kamu sudah up to date!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {notifs.map(notif => {
                const cfg = NOTIF_CFG[notif.type];
                const { Icon } = cfg;

                return (
                  <div
                    key={notif.id}
                    className={`relative rounded-2xl border p-4 transition-all ${
                      notif.isRead
                        ? "border-border bg-card"
                        : `${cfg.border} ${cfg.bg}`
                    }`}
                  >
                    {/* Unread dot */}
                    {!notif.isRead && (
                      <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#1B5E20]" />
                    )}

                    <div className="flex items-start gap-3 pr-5">
                      {/* Icon */}
                      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        notif.isRead ? "bg-muted" : cfg.iconBg
                      }`}>
                        <Icon size={16} className={notif.isRead ? "text-muted-foreground" : cfg.textColor} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                            notif.isRead
                              ? "border-border bg-muted text-muted-foreground"
                              : `${cfg.border} ${cfg.iconBg} ${cfg.textColor}`
                          }`}>
                            {cfg.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {formatDate(notif.createdAt)}
                          </span>
                        </div>

                        <p className={`text-sm font-semibold leading-snug ${notif.isRead ? "text-muted-foreground" : "text-foreground"}`}>
                          {notif.title}
                        </p>
                        <p className={`mt-0.5 text-sm leading-relaxed ${notif.isRead ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                          {notif.message}
                        </p>

                        {/* Denda chip */}
                        {notif.fineAmount && notif.fineAmount > 0 && (
                          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-100 px-3 py-0.5 text-xs font-bold text-red-700">
                            <AlertTriangle size={10} />
                            Denda berjalan: {formatRupiah(notif.fineAmount)}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {!notif.isRead && (
                            <Button
                              size="sm"
                              className="h-7 gap-1 text-xs bg-[#1B5E20] hover:bg-[#2E7D32] text-white"
                              onClick={() => markRead(notif.id)}
                            >
                              <Check size={11} /> Tandai Dibaca
                            </Button>
                          )}
                          {notif.loanId && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 gap-1 text-xs"
                              asChild
                            >
                              <a href="/dashboard/user/history">
                                <BookOpen size={11} /> Lihat Peminjaman
                              </a>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 gap-1 text-xs text-muted-foreground hover:text-red-500 hover:bg-red-50"
                            onClick={() => deleteOne(notif.id)}
                          >
                            <Trash2 size={11} /> Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}