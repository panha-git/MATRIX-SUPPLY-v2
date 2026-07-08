"use client";

import {
  createContext,
  FormEvent,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getAccountByGmail,
  isValidGmail,
  type CustomerAccount,
} from "@/lib/localStorage";
import { useAuth } from "./AuthProvider";
import { Icon } from "./Icon";

type MarketplaceContextValue = {
  notify: (message: string) => void;
  requireCustomer: (action: (customer: CustomerAccount) => void) => void;
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [toast, setToast] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const pendingAction = useRef<((customer: CustomerAccount) => void) | null>(
    null,
  );

  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }, []);

  const value = useMemo<MarketplaceContextValue>(
    () => ({
      notify,
      requireCustomer: (action) => {
        if (user?.role === "customer") {
          action(user);
          return;
        }
        if (user) {
          notify("Log out of this role and use a customer account first.");
          return;
        }
        pendingAction.current = action;
        setLoginOpen(true);
      },
    }),
    [notify, user],
  );

  const toastClass = [
    "fixed bottom-5 left-1/2 z-[110] -translate-x-1/2 rounded-full",
    "bg-[#17201a] px-5 py-3 text-sm font-semibold text-white shadow-2xl",
    "transition-all",
    toast
      ? "translate-y-0 opacity-100"
      : "pointer-events-none translate-y-3 opacity-0",
  ].join(" ");

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
      {loginOpen && (
        <CustomerLoginModal
          onClose={() => {
            pendingAction.current = null;
            setLoginOpen(false);
          }}
          onSuccess={(customer) => {
            const action = pendingAction.current;
            pendingAction.current = null;
            setLoginOpen(false);
            action?.(customer);
          }}
        />
      )}
      <div role="status" aria-live="polite" className={toastClass}>
        {toast}
      </div>
    </MarketplaceContext.Provider>
  );
}

function CustomerLoginModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (customer: CustomerAccount) => void;
}) {
  const { login } = useAuth();
  const [gmail, setGmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneOrTelegram, setPhoneOrTelegram] = useState("");
  const [error, setError] = useState("");

  const loadSavedCustomer = (value: string) => {
    if (!isValidGmail(value)) return;
    const account = getAccountByGmail(value);
    if (account?.role === "customer") {
      setFullName(account.fullName);
      setPhoneOrTelegram(account.phoneOrTelegram);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      const existing = getAccountByGmail(gmail);
      if (existing && existing.role !== "customer") {
        throw new Error(
          "This Gmail belongs to a different role. Use a customer Gmail.",
        );
      }
      const account = login(gmail, {
        role: "customer",
        fullName,
        phoneOrTelegram,
      });
      if (account.role !== "customer")
        throw new Error("Customer login failed.");
      onSuccess(account);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to continue.",
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-login-title"
      className="fixed inset-0 z-[100] grid place-items-center bg-[#07150d]/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-primary">
              Customer account required
            </span>
            <h2 id="customer-login-title" className="mt-2 text-2xl font-black">
              Continue your request
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-ink">
              No password is needed. Existing Gmail accounts keep their saved
              cart and details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login"
            className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-[#f3f5f3]"
          >
            <Icon name="close" />
          </button>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <label className="block text-sm font-semibold">
            Gmail *
            <input
              type="email"
              value={gmail}
              onChange={(event) => {
                setGmail(event.target.value);
                setError("");
              }}
              onBlur={(event) => loadSavedCustomer(event.target.value)}
              placeholder="customer@gmail.com"
              autoFocus
              className="form-control"
            />
          </label>
          <label className="block text-sm font-semibold">
            Full name *
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your full name"
              className="form-control"
            />
          </label>
          <label className="block text-sm font-semibold">
            Phone or Telegram *
            <input
              value={phoneOrTelegram}
              onChange={(event) => setPhoneOrTelegram(event.target.value)}
              placeholder="+855... or @telegram"
              className="form-control"
            />
          </label>
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <button className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark">
            Login or register and continue
          </button>
        </form>
      </section>
    </div>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used inside MarketplaceProvider");
  }
  return context;
}
