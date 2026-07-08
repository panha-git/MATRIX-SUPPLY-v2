"use client";

import { createContext, useContext, useMemo, useState } from "react";

type MarketplaceContextValue = {
  notify: (message: string) => void;
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState("");
  const value = useMemo(
    () => ({
      notify: (message: string) => {
        setToast(message);
        window.setTimeout(() => setToast(""), 2200);
      },
    }),
    [],
  );
  const toastClass = [
    "fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full",
    "bg-[#17201a] px-5 py-3 text-sm font-semibold text-white shadow-2xl",
    "transition-all",
    toast
      ? "translate-y-0 opacity-100"
      : "pointer-events-none translate-y-3 opacity-0",
  ].join(" ");

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" className={toastClass}>
        {toast}
      </div>
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context)
    throw new Error("useMarketplace must be used inside MarketplaceProvider");
  return context;
}
