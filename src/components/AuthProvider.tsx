"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AUTH_CHANGED_EVENT,
  getCurrentUser,
  loginOrCreateUser,
  logout as clearSession,
  type LocalAccount,
  type RegistrationProfile,
  type UserRole,
} from "@/lib/localStorage";

type AuthContextValue = {
  user: LocalAccount | null;
  login: (gmail: string, profile?: RegistrationProfile) => LocalAccount;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const customerOnlyRoutes = [
  "/products",
  "/suppliers",
  "/promotions",
  "/orders",
];
const supplierOnlyRoutes = ["/dashboard"];

function isWithin(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function homeForRole(role: UserRole) {
  return role === "supplier" ? "/dashboard" : "/products";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<LocalAccount | null | undefined>(undefined);

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    syncUser();
    window.addEventListener(AUTH_CHANGED_EVENT, syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    if (user === undefined) return;

    if (!user && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    if (!user) return;
    const home = homeForRole(user.role);
    if (pathname === "/" || pathname === "/login") {
      router.replace(home);
    } else if (
      user.role === "customer" &&
      isWithin(pathname, supplierOnlyRoutes)
    ) {
      router.replace(home);
    } else if (
      user.role === "supplier" &&
      isWithin(pathname, customerOnlyRoutes)
    ) {
      router.replace(home);
    }
  }, [pathname, router, user]);

  const value = useMemo<AuthContextValue | null>(() => {
    if (user === undefined) return null;
    return {
      user,
      login: (gmail, profile) => {
        const account = loginOrCreateUser(gmail, profile);
        setUser(account);
        return account;
      },
      logout: () => {
        clearSession();
        setUser(null);
        router.replace("/login");
      },
    };
  }, [router, user]);

  const isRedirecting =
    user === undefined ||
    (!user && pathname !== "/login") ||
    Boolean(user && (pathname === "/" || pathname === "/login")) ||
    Boolean(
      user?.role === "customer" && isWithin(pathname, supplierOnlyRoutes),
    ) ||
    Boolean(
      user?.role === "supplier" && isWithin(pathname, customerOnlyRoutes),
    );

  if (!value || isRedirecting) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7faf8]">
        <div className="text-center">
          <span className="mx-auto block size-9 animate-pulse rounded-xl bg-primary" />
          <p className="mt-3 text-sm font-medium text-muted-ink">
            Loading MATRIX SUPPLY…
          </p>
        </div>
      </main>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
