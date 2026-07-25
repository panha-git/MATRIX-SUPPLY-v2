"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCart, getNotifications, PLATFORM_CHANGED_EVENT } from "@/lib/localStorage";
import { useAuth } from "./AuthProvider";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

const guestLinks = [
  ["Search", "/products"],
  ["Cart", "/cart"],
  ["Chat", "/chat"],
  ["Alerts", "/notifications"],
];

export function SiteHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [counts, setCounts] = useState({ cart: 0, notifications: 0 });

  useEffect(() => {
    const sync = () =>
      setCounts({
        cart: user?.role === "customer" ? getCart(user.id).items.reduce((n, x) => n + x.quantity, 0) : 0,
        notifications: user ? getNotifications(user.id).filter((n) => !n.read).length : 0,
      });
    sync();
    window.addEventListener(PLATFORM_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PLATFORM_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [user]);

  const links = !user
    ? guestLinks
    : user.role === "customer"
      ? [["Search", "/products"], ["Cart", "/cart"], ["Chat", "/chat"], ["Alerts", "/notifications"]]
      : [["Dashboard", "/dashboard"], ["Orders", "/orders"], ["Chat", "/chat"]];

  const active = (href: string) => href !== "/" && !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 shadow-[0_1px_12px_rgba(15,23,42,.04)] backdrop-blur-xl">
      <div className="container-shell flex h-[72px] items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
        </Link>

        <div className="ml-2 flex flex-1 items-center gap-2 rounded-full border border-line bg-surface-muted px-3 py-2 shadow-sm">
          <Icon name="search" size={16} />
          <Link href="/products" className="flex-1 text-sm text-muted-ink">
            Search products, suppliers, categories
          </Link>
        </div>

        <nav className="ml-auto hidden items-center gap-1 xl:flex">
          {links.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className={`rounded-full px-3 py-2 text-[13px] font-semibold ${active(href) ? "bg-primary-soft text-primary" : "text-muted-ink hover:bg-primary-soft hover:text-primary"}`}
            >
              {label}
              {label === "Cart" && counts.cart > 0 && <span className="ml-1 text-accent">{counts.cart}</span>}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-2">
          <ThemeToggle />
          {user ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setNoticeOpen(!noticeOpen)}
                  className="relative grid size-10 place-items-center rounded-full border border-line text-primary hover:bg-primary-soft"
                  aria-label="Notifications"
                >
                  <Icon name="bell" size={18} />
                  {counts.notifications > 0 && (
                    <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">
                      {counts.notifications > 9 ? "9+" : counts.notifications}
                    </span>
                  )}
                </button>
                {noticeOpen && (
                  <div className="absolute right-0 top-12 w-72 rounded-2xl border border-line bg-surface p-3 shadow-2xl">
                    <p className="px-2 py-2 text-sm font-bold">Notifications</p>
                    {getNotifications(user.id).slice(0, 3).map((n) => (
                      <Link key={n.id} href={n.link || "/notifications"} onClick={() => setNoticeOpen(false)} className="block rounded-xl px-3 py-2.5 hover:bg-primary-soft">
                        <strong className="block text-xs">{n.title}</strong>
                        <span className="mt-1 line-clamp-2 text-[11px] text-muted-ink">{n.message}</span>
                      </Link>
                    ))}
                    <Link href="/notifications" className="mt-2 block rounded-xl bg-primary-soft px-3 py-2 text-center text-xs font-bold text-primary">
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/account" className="hidden size-10 place-items-center rounded-full bg-primary text-xs font-bold text-white sm:grid">
                {(user.role === "supplier" ? user.businessName : user.fullName).slice(0, 2).toUpperCase()}
              </Link>
              <button onClick={logout} className="hidden text-xs font-semibold text-muted-ink hover:text-red-600 lg:block">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hidden text-sm font-semibold text-primary sm:block">
              Sign in
            </Link>
          )}

          <button onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full border border-line xl:hidden" aria-label="Toggle navigation">
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="container-shell grid gap-1 border-t border-line py-3 xl:hidden">
          {links.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-primary-soft">
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/notifications" className="rounded-xl px-3 py-2.5 text-sm font-semibold">Notifications</Link>
              <Link href="/account" className="rounded-xl px-3 py-2.5 text-sm font-semibold">Profile</Link>
              <button onClick={logout} className="px-3 py-2.5 text-left text-sm font-semibold text-red-600">Logout</button>
            </>
          ) : (
            <Link href="/login" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-primary">Sign in</Link>
          )}
        </nav>
      )}
    </header>
  );
}
