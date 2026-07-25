"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CAMBODIA_PROVINCES, PRODUCT_CATEGORIES } from "@/lib/cambodia";
import { addToCart, createReport, getActiveProducts, PLATFORM_CHANGED_EVENT, startChat, type Product } from "@/lib/localStorage";
import { useMarketplace } from "./MarketplaceProvider";
import { ProductCard } from "./ProductCard";
import { Icon } from "./Icon";

const reasons = ["Misleading product information", "Wrong price", "Suspicious supplier", "Scam or fraud risk", "Inappropriate content", "Bad image", "Other"];

export function ProductsExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const { requireCustomer, notify } = useMarketplace();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [province, setProvince] = useState("");
  const [sort, setSort] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(20);
  const [reporting, setReporting] = useState<Product | null>(null);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const sync = () => setProducts(getActiveProducts());
    sync();
    window.addEventListener(PLATFORM_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PLATFORM_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const visible = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (!search || `${p.title} ${p.supplierName}`.toLowerCase().includes(search.toLowerCase())) &&
            (!category || p.category === category) &&
            (!province || p.province === province)
        )
        .sort((a, b) =>
          sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [products, search, category, province, sort]
  );
  const feed = visible.length ? visible.slice(0, visibleCount) : products.slice(0, 20);
  const hasMore = visible.length > visibleCount;

  useEffect(() => {
    const onScroll = () => {
      if (!hasMore) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 700) setVisibleCount((count) => Math.min(count + 20, visible.length));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, visible.length]);

  const add = (p: Product) =>
    requireCustomer((c) => {
      addToCart(c.id, p);
      notify(`${p.title} added to your cart`);
    });

  const chat = (p: Product) =>
    requireCustomer((c) => router.push(`/chat?room=${startChat(c, p).id}`));

  const openReport = (p: Product) => requireCustomer(() => setReporting(p));

  const submitReport = (e: FormEvent) => {
    e.preventDefault();
    if (!reporting || !reason) return;
    requireCustomer((c) => {
      createReport({ reporterId: c.id, reporterName: c.fullName, targetType: "product", targetId: reporting.id, reason, description });
      setReporting(null);
      setReason("");
      setDescription("");
      notify("Report submitted to marketplace safety");
    });
  };

  return (
    <div className="container-shell page-pad pb-14">
      <div className="mb-6 rounded-[28px] border border-line bg-surface p-4 shadow-[0_8px_30px_rgba(17,43,74,.04)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-accent">NEXXA</p>
            <h1 className="mt-1 text-2xl font-black tracking-[-.03em] text-primary">Marketplace feed</h1>
            <p className="mt-1 text-sm text-muted-ink">Browse live wholesale products from verified suppliers across the supplier network.</p>
          </div>
          <div className="rounded-full border border-line bg-surface-muted px-3 py-1.5 text-sm font-semibold text-primary">
            {visible.length} live listings
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(150px,auto))]">
          <label className="flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3">
            <span className="text-muted-ink">⌕</span>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setVisibleCount(20); }} placeholder="Search products or suppliers" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </label>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setVisibleCount(20); }} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm">
            <option value="">All categories</option>
            {PRODUCT_CATEGORIES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select value={province} onChange={(e) => { setProvince(e.target.value); setVisibleCount(20); }} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm">
            <option value="">All provinces</option>
            {CAMBODIA_PROVINCES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setVisibleCount(20); }} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm">
            <option value="newest">Newest</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-ink">Showing fresh wholesale products with real supplier context.</p>
        {(search || category || province) && (
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              setProvince("");
              setVisibleCount(20);
            }}
            className="text-xs font-bold text-primary"
          >
            Clear filters
          </button>
        )}
      </div>

      {!visible.length && (
        <div className="mb-5 rounded-2xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-primary">Recommended live listings</h2>
              <p className="mt-1 text-sm text-muted-ink">No exact match surfaced, so the feed is showing active buyer favourites from nearby categories.</p>
            </div>
            <button onClick={() => { setSearch(""); setCategory(""); setProvince(""); setVisibleCount(20); }} className="secondary-btn"><Icon name="search" size={14} /> Reset search</button>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {feed.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={add} onRequestQuote={chat} onChat={chat} onReport={openReport} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-2xl border border-line bg-surface" />)}
        </div>
      )}

      {hasMore && <p className="mt-4 text-center text-sm font-semibold text-muted-ink">Loading more active wholesale listings...</p>}

      {reporting && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setReporting(null)}>
          <form onSubmit={submitReport} className="modal-card">
            <span className="eyebrow">Marketplace Safety</span>
            <h2 className="mt-4 text-2xl font-bold">Report Product</h2>
            <p className="mt-2 text-sm text-muted-ink">Tell us what is concerning about {reporting.title}.</p>
            <label className="mt-5 block text-sm font-semibold">
              Reason *
              <select required value={reason} onChange={(e) => setReason(e.target.value)} className="form-control">
                <option value="">Select a reason</option>
                {reasons.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Description (optional)
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="form-control py-3" />
            </label>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setReporting(null)} className="secondary-btn">
                Cancel
              </button>
              <button className="primary-btn">Submit Report</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
