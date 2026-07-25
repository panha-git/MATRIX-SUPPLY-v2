"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCart, getNotifications, PLATFORM_CHANGED_EVENT } from "@/lib/localStorage";
import { useAuth } from "./AuthProvider";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationPopover } from "./NotificationPopover";

const guestLinks = [["Search", "/products"], ["Cart", "/cart"], ["Chat", "/chat"]];

export function SiteHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [counts, setCounts] = useState({ cart: 0, notifications: 0 });
  const [notifications, setNotifications] = useState<ReturnType<typeof getNotifications>>([]);

  useEffect(() => {
    const sync = () => {
      const nextNotifications = user ? getNotifications(user.id) : [];
      setNotifications(nextNotifications);
      setCounts({
        cart: user?.role === "customer" ? getCart(user.id).items.reduce((n, x) => n + x.quantity, 0) : 0,
        notifications: nextNotifications.filter((n) => !n.read).length,
      });
    };
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
      ? [["Search", "/products"], ["Cart", "/cart"], ["Chat", "/chat"]]
      : [["Dashboard", "/dashboard"], ["Orders", "/orders"], ["Chat", "/chat"]];

  const active = (href: string) => href !== "/" && !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 shadow-[0_1px_12px_rgba(15,23,42,.04)] backdrop-blur-xl">
      <div className="container-shell flex h-[72px] items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
        </Link>

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
          <Link
            href="/products"
            className="icon-btn sm:inline-flex sm:w-auto sm:px-3 sm:text-xs sm:font-bold xl:hidden"
            aria-label="Search products"
          >
            <Icon name="search" size={15} />
            <span className="hidden sm:inline">Products</span>
          </Link>
          <ThemeToggle />
          {user ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setNoticeOpen(!noticeOpen)}
                  className="icon-btn relative"
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
                  <NotificationPopover items={notifications} open={noticeOpen} onClose={() => setNoticeOpen(false)} />
                )}
              </div>
              <Link href="/account" className="hidden size-10 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground sm:grid">
                {(user.role === "supplier" ? user.businessName : user.fullName).slice(0, 2).toUpperCase()}
              </Link>
              <button onClick={logout} className="ghost-btn hidden px-3 py-2 text-xs text-destructive lg:inline-flex">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hidden text-sm font-semibold text-primary sm:block">
              Sign in
            </Link>
          )}

          <button onClick={() => setOpen(!open)} className="icon-btn xl:hidden" aria-label="Toggle navigation">
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
              <Link href="/account" className="rounded-xl px-3 py-2.5 text-sm font-semibold">Profile</Link>
              <button onClick={logout} className="danger-btn justify-start px-3 py-2.5 text-sm">Logout</button>
            </>
          ) : (
            <Link href="/login" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-primary">Sign in</Link>
          )}
        </nav>
      )}
    </header>
  );
}
