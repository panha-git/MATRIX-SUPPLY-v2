/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { suppliers } from "@/lib/data";
import { Icon } from "./Icon";
import { SupplierCard } from "./SupplierCard";

export function SupplierExplorer() {
  const [search, setSearch] = useState("");
  const visible = useMemo(() => suppliers.filter((supplier) => `${supplier.name} ${supplier.type} ${supplier.location} ${supplier.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase())), [search]);
  return (
    <>
      <section className="bg-primary-soft py-10 sm:py-14">
        <div className="container-shell flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div><p className="text-sm text-muted-ink">Home <span className="mx-2">›</span> Suppliers</p><h1 className="mt-3 text-4xl font-black tracking-tight">Our suppliers</h1><p className="mt-3 max-w-2xl text-muted-ink">Browse verified local farms, importers, and specialty producers supplying fresh food and beverages across Cambodia.</p><div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-4 sm:flex">{[["120+", "Active suppliers"], ["1,240+", "Products listed"], ["18", "Provinces covered"], ["98%", "Fulfilment rate"]].map(([number, label]) => <div key={label} className="sm:border-r sm:border-primary/15 sm:pr-8 last:border-0"><strong className="block text-xl text-primary">{number}</strong><span className="text-xs text-muted-ink">{label}</span></div>)}</div></div>
          <label className="flex h-12 w-full max-w-sm items-center gap-3 rounded-2xl border border-line bg-white px-4 shadow-sm"><Icon name="search" size={18} className="text-muted-ink" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suppliers..." className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
        </div>
      </section>
      <div className="container-shell py-14">
        <div className="mb-10"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold">Featured suppliers</h2><span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-accent">Editor&apos;s pick</span></div><div className="grid gap-4 md:grid-cols-3">{suppliers.slice(0, 3).map((supplier, index) => <FeaturedSupplier key={supplier.name} supplier={supplier} index={index} />)}</div></div>
        <div className="grid gap-8 lg:grid-cols-[210px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-line p-5"><h2 className="font-bold">Filter suppliers</h2><h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-muted-ink">Supplier type</h3>{["All types", "Local farm", "Wholesale importer", "Beverage supplier"].map((item, index) => <label key={item} className="mt-3 flex items-center gap-2 text-sm"><input name="supplier-type" type="radio" defaultChecked={index === 0} className="accent-primary" />{item}</label>)}<h3 className="mt-7 border-t border-line pt-5 text-xs font-bold uppercase tracking-wide text-muted-ink">Verified only</h3><label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="accent-primary" />Show verified</label></aside>
          <div><div className="mb-5 flex items-center justify-between"><p className="text-sm text-muted-ink">Showing <strong className="text-foreground">{visible.length}</strong> suppliers</p><select className="rounded-xl border border-line bg-white px-4 py-2 text-sm"><option>Top rated</option><option>Most products</option></select></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((supplier) => <SupplierCard key={supplier.name} supplier={supplier} />)}</div></div>
        </div>
      </div>
    </>
  );
}

function FeaturedSupplier({ supplier, index }: { supplier: (typeof suppliers)[number]; index: number }) {
  const images = ["Cambodian vegetable farm aerial green fields", "lush rice terraces farm Cambodia", "Kampot pepper plantation mountains Cambodia"];
  return <article className="relative min-h-[230px] overflow-hidden rounded-[22px] bg-primary-dark p-6 text-white"><img src={`https://app.banani.co/api/flow-image/${encodeURIComponent(`16:7\n${images[index]}`)}`} alt="" className="absolute inset-0 size-full object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-t from-[#092f1e] via-transparent to-transparent" /><div className="relative flex h-full flex-col justify-end"><span className="w-fit rounded-md bg-primary px-2 py-1 text-[10px] font-bold">Verified · ★ {supplier.rating}</span><h3 className="mt-3 text-lg font-bold">{supplier.name}</h3><p className="text-xs text-white/70">{supplier.type} · {supplier.location}</p><button className="mt-4 flex w-fit items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold text-primary-dark">Visit store <Icon name="arrowRight" size={13} /></button></div></article>;
}
