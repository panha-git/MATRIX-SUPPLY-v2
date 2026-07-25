"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import type { Notification } from "@/lib/localStorage";
import { markNotificationRead } from "@/lib/localStorage";
import { Icon } from "./Icon";

const icons: Record<Notification["type"], "cart" | "headset" | "package" | "shield" | "user"> = {
  order: "cart",
  chat: "headset",
  product: "package",
  system: "shield",
  report: "shield",
  account: "user",
};

function relativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
}

export function NotificationPopover({
  items,
  open,
  onClose,
}: {
  items: Notification[];
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const unread = useMemo(() => items.filter((item) => !item.read).length, [items]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const markAll = () => {
    items.filter((item) => !item.read).forEach((item) => markNotificationRead(item.id));
  };

  return (
    <div
      ref={panelRef}
      className={`absolute right-0 top-12 z-[130] w-[min(420px,calc(100vw-1.5rem))] origin-top-right overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-[0_22px_70px_rgba(15,23,42,.22)] backdrop-blur-xl transition duration-150 sm:w-[400px] ${
        open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[.98] opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <h2 className="text-sm font-black">Notifications</h2>
          <p className="mt-0.5 text-xs text-muted-ink">{unread ? `${unread} unread updates` : "Everything is read"}</p>
        </div>
        <button
          type="button"
          onClick={markAll}
          disabled={!unread}
          className="rounded-full px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-soft disabled:cursor-not-allowed disabled:text-muted-ink disabled:hover:bg-transparent"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto p-2">
        {items.length ? (
          items.map((item) => (
            <article
              key={item.id}
              className={`flex gap-3 rounded-xl p-3 transition hover:bg-primary-soft/70 ${item.read ? "" : "bg-primary-soft/40"}`}
            >
              <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${item.read ? "bg-surface-muted text-muted-ink" : "bg-primary text-white"}`}>
                <Icon name={icons[item.type]} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 text-sm font-bold">{item.title}</h3>
                  {!item.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />}
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-ink">{item.message}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold text-muted-ink">{relativeTime(item.createdAt)}</span>
                  {!item.read && (
                    <button type="button" onClick={() => markNotificationRead(item.id)} className="ghost-btn px-2 py-1 text-[11px]">
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="grid min-h-36 place-items-center px-6 py-8 text-center">
            <div>
              <span className="mx-auto grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon name="bell" size={18} />
              </span>
              <p className="mt-3 text-sm font-bold">No notifications yet</p>
              <p className="mt-1 text-xs leading-5 text-muted-ink">New order, chat, and account updates will appear here.</p>
            </div>
          </div>
        )}
      </div>

      <Link
        href="/notifications"
        onClick={onClose}
        className="block border-t border-line bg-surface-muted px-4 py-3 text-center text-xs font-black text-primary hover:bg-primary-soft"
      >
        View all notifications
      </Link>
    </div>
  );
}
