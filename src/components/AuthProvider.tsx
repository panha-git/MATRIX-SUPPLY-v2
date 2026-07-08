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

const customerOnlyRoutes = ["/cart", "/checkout"];
const supplierOnlyRoutes = ["/dashboard"];
const adminOnlyRoutes = ["/admin"];
const signedInRoutes = ["/account"];

function isWithin(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function homeForRole(role: UserRole) {
  if (role === "supplier") return "/dashboard";
  if (role === "admin") return "/admin";
  return "/products";
}

function getRedirect(pathname: string, user: LocalAccount | null) {
  const protectedRoute = isWithin(pathname, [
    ...customerOnlyRoutes,
    ...supplierOnlyRoutes,
    ...adminOnlyRoutes,
    ...signedInRoutes,
  ]);

  if (!user) return protectedRoute ? "/login" : null;
  if (pathname === "/login") return homeForRole(user.role);
  if (isWithin(pathname, customerOnlyRoutes) && user.role !== "customer") {
    return homeForRole(user.role);
  }
  if (isWithin(pathname, supplierOnlyRoutes) && user.role !== "supplier") {
    return homeForRole(user.role);
  }
  if (isWithin(pathname, adminOnlyRoutes) && user.role !== "admin") {
    return homeForRole(user.role);
  }
  return null;
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

  const redirectTo = user === undefined ? null : getRedirect(pathname, user);

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

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
        router.push("/");
      },
    };
  }, [router, user]);

  if (!value || redirectTo) {
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
