"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { CARTS_CHANGED_EVENT, getCart } from "@/lib/localStorage";
import { useAuth } from "./AuthProvider";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const publicNav = [
  ["Home", "/"],
  ["Marketplace", "/products"],
  ["Suppliers", "/suppliers"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() =>
    user?.role === "customer"
      ? getCart(user.id).items.reduce((total, item) => total + item.quantity, 0)
      : 0,
  );

  useEffect(() => {
    if (user?.role !== "customer") {
      return;
    }
    const sync = () =>
      setCartCount(
        getCart(user.id).items.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
      );
    const timer = window.setTimeout(sync, 0);
    window.addEventListener(CARTS_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(CARTS_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [user]);
  const visibleCartCount = user?.role === "customer" ? cartCount : 0;

  const roleNav =
    user?.role === "supplier"
      ? [
          ["Dashboard", "/dashboard"],
          ["Submit product", "/dashboard#product-form"],
          ["Profile", "/account"],
        ]
      : user?.role === "admin"
        ? [
            ["Admin dashboard", "/admin"],
            ["Marketplace", "/products"],
          ]
        : publicNav;
  const isActive = (href: string) =>
    !href.includes("#") &&
    (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)));
  const linkClass = (href: string) =>
    [
      "rounded-lg px-3 py-2 text-sm font-medium",
      isActive(href)
        ? "bg-primary-soft text-primary"
        : "text-[#303832] hover:bg-[#f4f7f5]",
    ].join(" ");

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    router.push(
      `/products${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`,
    );
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-[0_1px_0_rgba(20,45,27,.08)] backdrop-blur-xl">
      <div className="bg-primary-dark px-4 py-2 text-center text-[11px] leading-4 text-white/80">
        <strong className="text-white">Demo Mode:</strong> Data is saved in this
        browser only. Different computers will not sync until a real
        database/API is added.
      </div>
      <div className="container-shell flex h-[72px] items-center gap-5">
        <Logo />
        {(user?.role === "customer" || !user) && (
          <form
            onSubmit={submitSearch}
            className="hidden min-w-[220px] max-w-lg flex-1 lg:flex"
          >
            <div className="flex h-11 w-full items-center rounded-xl border border-line bg-[#f7f9f7] px-3">
              <Icon name="search" size={17} className="text-muted-ink" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
              />
              <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white">
                Search
              </button>
            </div>
          </form>
        )}
        <nav className="ml-auto hidden items-center gap-1 xl:flex">
          {roleNav.map(([label, href]) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          {user?.role === "customer" && (
            <Link
              href="/cart"
              className="relative grid size-10 place-items-center rounded-xl border border-line text-primary"
              aria-label={`Cart with ${visibleCartCount} items`}
            >
              <Icon name="cart" size={19} />
              {visibleCartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {visibleCartCount > 9 ? "9+" : visibleCartCount}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <>
              {user.role === "customer" && (
                <Link
                  href="/account"
                  className="hidden rounded-xl border border-line px-3 py-2 text-xs font-bold text-muted-ink sm:block"
                >
                  {user.fullName}
                </Link>
              )}
              <button
                onClick={logout}
                className="hidden rounded-xl border border-line px-3 py-2 text-xs font-bold text-red-600 sm:block"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white sm:block"
            >
              Demo login
            </Link>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-xl xl:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-white px-5 pb-5 pt-3 xl:hidden">
          {(user?.role === "customer" || !user) && (
            <form
              onSubmit={submitSearch}
              className="mb-3 flex rounded-xl border border-line bg-[#f7f9f7] p-2 lg:hidden"
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products..."
                className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
              />
              <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">
                Search
              </button>
            </form>
          )}
          <nav className="grid gap-1">
            {roleNav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={linkClass(href)}
              >
                {label}
              </Link>
            ))}
            {user?.role === "customer" && (
              <Link href="/cart" className={linkClass("/cart")}>
                Cart ({visibleCartCount})
              </Link>
            )}
            {user ? (
              <button
                onClick={logout}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className={linkClass("/login")}>
                Demo login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
