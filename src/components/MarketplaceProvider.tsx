"use client";

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

        notify("Please sign in or create an account before using cart, chat, quotes, or reports.");
      },
    }),
    [user, notify],
  );

  return (
    <Context.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-3 top-20 z-[120] flex w-[min(360px,calc(100vw-1.5rem))] justify-end sm:right-6 sm:top-24">
        {notification && (
          <section
            key={notification.id}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={`pointer-events-auto flex w-full items-start gap-2.5 rounded-xl border border-line border-l-4 border-l-primary bg-surface px-3.5 py-3 text-foreground shadow-2xl transition duration-200 sm:gap-3 sm:p-4 ${
              notification.leaving ? "translate-y-[-6px] opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary sm:size-8">
              <Icon name="bell" size={15} />
            </span>
            <p className="flex-1 text-xs font-semibold leading-5 sm:text-sm sm:leading-6">{notification.message}</p>
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
