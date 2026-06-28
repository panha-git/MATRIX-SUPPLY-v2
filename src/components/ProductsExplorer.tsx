"use client";

import { useMemo, useState } from "react";
import { categories, products } from "@/lib/data";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";

export function ProductsExplorer({ initialSearch = "", initialCategory = "All Products" }: { initialSearch?: string; initialCategory?: string }) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("Featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visible = useMemo(() => {
    const query = search.toLowerCase();
    const result = products.filter((product) => (category === "All Products" || product.category === category) && (!query || `${product.name} ${product.supplier} ${product.category}`.toLowerCase().includes(query)));
    return [...result].sort((a, b) => sort === "Price: Low" ? a.price - b.price : sort === "Price: High" ? b.price - a.price : a.id - b.id);
  }, [search, category, sort]);

  return (
    <div className="container-shell page-pad">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="mb-2 text-sm text-muted-ink">Home <span className="mx-2">›</span> All products</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">All products</h1><p className="mt-2 text-sm text-muted-ink">1,240 products from verified Cambodian suppliers</p></div>
        <div className="flex gap-2"><button onClick={() => setFiltersOpen(!filtersOpen)} className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold lg:hidden">Filters</button><select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm"><option>Featured</option><option>Price: Low</option><option>Price: High</option></select></div>
      </div>
      <div className="grid gap-7 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className={`${filtersOpen ? "block" : "hidden"} h-fit rounded-2xl border border-line p-5 lg:block`}>
          <div className="flex items-center justify-between"><h2 className="font-bold">Filters</h2><button onClick={() => { setCategory("All Products"); setSearch(""); }} className="text-xs font-semibold text-accent">Clear all</button></div>
          <label className="mt-5 flex h-11 items-center gap-2 rounded-xl border border-line bg-[#f7f9f7] px-3"><Icon name="search" size={16} className="text-muted-ink" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
          <div className="mt-7 border-t border-line pt-5"><h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-ink">Category</h3><div className="space-y-1"><FilterButton active={category === "All Products"} onClick={() => setCategory("All Products")} label="All Products" count={1240} />{categories.map((item, index) => <FilterButton key={item.name} active={category === item.name} onClick={() => setCategory(item.name)} label={item.name} count={[342, 198, 87, 215, 163, 94, 76, 63][index]} />)}</div></div>
          <div className="mt-7 border-t border-line pt-5"><h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-muted-ink">Certifications</h3>{["Organic", "Halal", "Free-range", "Non-GMO"].map((item, index) => <label key={item} className="mb-3 flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={index < 2} className="accent-primary" />{item}</label>)}</div>
          <div className="mt-7 border-t border-line pt-5"><h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-ink">Price range</h3><input type="range" min="0" max="50" defaultValue="20" className="w-full accent-primary" /><div className="flex justify-between text-[11px] text-muted-ink"><span>$0</span><b className="text-foreground">$0 – $20</b><span>$50+</span></div></div>
        </aside>
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-ink">Showing <strong className="text-foreground">{visible.length}</strong> products</p><div className="flex gap-2">{category !== "All Products" && <button onClick={() => setCategory("All Products")} className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">{category} ×</button>}{search && <button onClick={() => setSearch("")} className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">“{search}” ×</button>}</div></div>
          {visible.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="grid min-h-[360px] place-items-center rounded-2xl border border-dashed border-line bg-[#fafbfa] text-center"><div><div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary"><Icon name="search" /></div><h2 className="mt-4 font-bold">No products found</h2><p className="mt-1 text-sm text-muted-ink">Try another search or category.</p></div></div>}
          <div className="mt-10 flex justify-center gap-2">{["‹", "1", "2", "3", "…", "52", "›"].map((item) => <button key={item} className={`grid size-10 place-items-center rounded-lg border text-sm ${item === "1" ? "border-primary bg-primary text-white" : "border-line bg-white hover:border-primary/40"}`}>{item}</button>)}</div>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return <button onClick={onClick} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${active ? "bg-primary-soft font-semibold text-primary" : "hover:bg-[#f7f8f7]"}`}><span>{label}</span><span className="text-[11px] text-muted-ink">{count}</span></button>;
}
