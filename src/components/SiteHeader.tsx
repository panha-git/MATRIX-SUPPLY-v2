"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "./AuthProvider";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const customerNav = [["Marketplace", "/products"], ["Browse products", "/products#catalog"], ["Profile", "/account"]];
const supplierNav = [["Dashboard", "/dashboard"], ["My Products", "/dashboard#my-products"], ["Add Product", "/dashboard#product-form"], ["Profile", "/account"]];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const isCustomer = user?.role === "customer";
  const nav = isCustomer ? customerNav : supplierNav;
  const submitSearch = (event: FormEvent) => { event.preventDefault(); router.push(`/products${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`); setOpen(false); };

  return <header className="sticky top-0 z-50 bg-white/95 shadow-[0_1px_0_rgba(20,45,27,.08)] backdrop-blur-xl">
    <div className="bg-primary-dark text-white"><div className="container-shell flex h-7 items-center justify-between text-[11px] text-white/75"><span>{isCustomer ? "Customer marketplace · Active supplier products" : "Supplier workspace · Your products and profile"}</span><span className="hidden items-center gap-4 sm:flex"><span className="max-w-60 truncate">{user?.gmail}</span><span className="capitalize">{user?.role}</span></span></div></div>
    <div className="container-shell flex h-[72px] items-center gap-5"><Logo/>{isCustomer && <form onSubmit={submitSearch} className="hidden min-w-[240px] max-w-xl flex-1 lg:flex"><div className="flex h-11 w-full items-center rounded-xl border border-line bg-[#f7f9f7] px-3"><Icon name="search" size={17} className="text-muted-ink"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product name..." aria-label="Search products" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"/><button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white">Search</button></div></form>}
      <nav className="ml-auto hidden items-center gap-1 xl:flex" aria-label="Main navigation">{nav.map(([label, href]) => <Link key={href} href={href} className={`rounded-lg px-3 py-2 text-sm font-medium ${!href.includes("#") && pathname === href ? "bg-primary-soft text-primary" : "text-[#303832] hover:bg-[#f4f7f5]"}`}>{label}</Link>)}</nav>
      <div className="ml-auto flex items-center gap-2 xl:ml-0"><button onClick={logout} className="hidden rounded-xl border border-line px-3 py-2 text-xs font-bold text-muted-ink hover:border-primary/30 hover:text-primary sm:block">Logout</button><button onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-xl xl:hidden" aria-label="Toggle navigation" aria-expanded={open}><Icon name={open ? "close" : "menu"}/></button></div>
    </div>
    {open && <div className="border-t border-line bg-white px-5 pb-5 pt-3 xl:hidden">{isCustomer && <form onSubmit={submitSearch} className="mb-3 flex rounded-xl border border-line bg-[#f7f9f7] p-2 lg:hidden"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product name..." className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"/><button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">Search</button></form>}<nav className="grid gap-1">{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-2.5 text-sm font-medium ${!href.includes("#") && pathname === href ? "bg-primary-soft text-primary" : "hover:bg-[#f5f7f5]"}`}>{label}</Link>)}<button onClick={logout} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">Logout</button></nav></div>}
  </header>;
}
