"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { CustomerAccount } from "@/lib/localStorage";
import { useAuth } from "./AuthProvider";
import { Icon } from "./Icon";

type Value = {
  notify: (message: string) => void;
  requireCustomer: (action: (customer: CustomerAccount) => void) => void;
};

type FloatingNotification = {
  id: number;
  message: string;
  leaving: boolean;
};

const Context = createContext<Value | null>(null);
const NOTIFICATION_DURATION = 4200;
const NOTIFICATION_EXIT_DURATION = 180;

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notification, setNotification] = useState<FloatingNotification | null>(null);
  const [open, setOpen] = useState(false);
  const pending = useRef<((customer: CustomerAccount) => void) | null>(null);
  const notificationId = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearNotificationTimers = useCallback(() => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    if (removeTimer.current) window.clearTimeout(removeTimer.current);
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification((current) => (current ? { ...current, leaving: true } : null));
    removeTimer.current = setTimeout(() => setNotification(null), NOTIFICATION_EXIT_DURATION);
  }, []);

  const notify = useCallback(
    (message: string) => {
      clearNotificationTimers();
      const id = notificationId.current + 1;
      notificationId.current = id;
      setNotification({ id, message, leaving: false });
      hideTimer.current = setTimeout(dismissNotification, NOTIFICATION_DURATION);
    },
    [clearNotificationTimers, dismissNotification],
  );

  const value = useMemo<Value>(
    () => ({
      notify,
      requireCustomer: (action) => {
        if (user?.role === "customer") {
          action(user);
          return;
        }

        if (user) {
          notify("Use a Verified Customer account for this action.");
          return;
        }

        pending.current = action;
        setOpen(true);
      },
    }),
    [user, notify],
  );

  return (
    <Context.Provider value={value}>
      {children}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-[#071225]/75 p-4"
          onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
        >
          <section className="w-full max-w-md rounded-3xl bg-surface p-7 shadow-2xl">
            <span className="eyebrow">Verified Account Required</span>
            <h2 className="mt-4 text-2xl font-black">Continue securely</h2>
            <p className="mt-2 text-sm leading-6 text-muted-ink">
              Register or log in before adding products, ordering, chatting, or submitting a marketplace report.
            </p>
            <div className="mt-6 grid gap-3">
              <Link href="/login" className="primary-btn" onClick={() => setOpen(false)}>
                Secure Registration or Login
              </Link>
              <button onClick={() => setOpen(false)} className="secondary-btn">
                Continue Browsing
              </button>
            </div>
            <p className="mt-5 text-xs leading-5 text-muted-ink">
              Customers must complete verified registration before ordering or chatting.
            </p>
          </section>
        </div>
      )}

      <div className="pointer-events-none fixed right-4 top-24 z-[120] flex w-[min(420px,calc(100vw-2rem))] justify-end sm:right-6">
        {notification && (
          <section
            key={notification.id}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-line border-l-4 border-l-primary bg-surface p-4 text-foreground shadow-2xl transition duration-200 ${
              notification.leaving ? "translate-y-[-6px] opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
              <Icon name="bell" size={16} />
            </span>
            <p className="flex-1 text-sm font-semibold leading-6">{notification.message}</p>
            <button
              type="button"
              onClick={dismissNotification}
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted-ink hover:bg-primary-soft hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Dismiss notification"
            >
              <Icon name="close" size={16} />
            </button>
          </section>
        )}
      </div>
    </Context.Provider>
  );
}

export function useMarketplace() {
  const value = useContext(Context);
  if (!value) throw Error("useMarketplace must be used inside MarketplaceProvider");
  return value;
}
