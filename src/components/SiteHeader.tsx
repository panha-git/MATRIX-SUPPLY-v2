"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useMarketplace } from "./MarketplaceProvider";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const nav = [
  ["Products", "/products"],
  ["Suppliers", "/suppliers"],
  ["Promotions", "/promotions"],
  ["Orders", "/orders"],
  ["Support", "/support"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, savedCount } = useMarketplace();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    router.push(`/products${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-[0_1px_0_rgba(20,45,27,.08)] backdrop-blur-xl">
      <div className="bg-primary-dark text-white">
        <div className="container-shell flex h-7 items-center justify-between text-[11px] text-white/75">
          <span>Free delivery on orders over $30 · KHQR accepted</span>
          <span className="hidden items-center gap-4 sm:flex"><span>1 USD = 4,100 KHR</span><span>EN</span></span>
        </div>
      </div>
      <div className="container-shell flex h-[72px] items-center gap-5">
        <Logo />
        <form onSubmit={submitSearch} className="hidden min-w-[240px] max-w-xl flex-1 lg:flex">
          <div className="flex h-11 w-full items-center rounded-xl border border-line bg-[#f7f9f7] px-3 focus-within:border-primary/40 focus-within:bg-white focus-within:shadow-sm">
            <Icon name="search" size={17} className="text-muted-ink" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands, suppliers..." aria-label="Search products" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#89918b]" />
            <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark">Search</button>
          </div>
        </form>
        <nav className="ml-auto hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className={`rounded-lg px-3 py-2 text-sm font-medium ${pathname === href ? "bg-primary-soft text-primary" : "text-[#303832] hover:bg-[#f4f7f5]"}`}>{label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 xl:ml-0">
          <Link href="/products" aria-label="Saved products" className="relative grid size-10 place-items-center rounded-xl text-[#4d5750] hover:bg-primary-soft hover:text-primary">
            <Icon name="heart" size={20} />
            {savedCount > 0 && <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-white">{savedCount}</span>}
          </Link>
          <button aria-label={`Cart with ${cartCount} items`} className="relative grid size-10 place-items-center rounded-xl text-[#4d5750] hover:bg-primary-soft hover:text-primary">
            <Icon name="cart" size={21} />
            <span className="absolute right-0 top-0 grid size-[18px] place-items-center rounded-full bg-accent text-[10px] font-bold text-white">{cartCount}</span>
          </button>
          <Link href="/account" aria-label="Account" className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary hover:bg-[#dcf4e5]"><Icon name="user" size={19} /></Link>
          <button onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-xl xl:hidden" aria-label="Toggle navigation" aria-expanded={open}><Icon name={open ? "close" : "menu"} /></button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-white px-5 pb-5 pt-3 xl:hidden">
          <form onSubmit={submitSearch} className="mb-3 flex rounded-xl border border-line bg-[#f7f9f7] p-2 lg:hidden">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
            <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">Search</button>
          </form>
          <nav className="grid gap-1">
            {nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-2.5 text-sm font-medium ${pathname === href ? "bg-primary-soft text-primary" : "hover:bg-[#f5f7f5]"}`}>{label}</Link>)}
          </nav>
        </div>
      )}
    </header>
  );
}
