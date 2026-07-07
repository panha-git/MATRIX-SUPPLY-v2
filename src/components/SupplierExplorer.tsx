"use client";

import { useEffect, useMemo, useState } from "react";
import { AUTH_CHANGED_EVENT, getActiveProducts, getSuppliers, PRODUCTS_CHANGED_EVENT, type Product, type SupplierAccount } from "@/lib/localStorage";
import { Icon } from "./Icon";
import { SupplierCard } from "./SupplierCard";

export function SupplierExplorer() {
  const [suppliers, setSuppliers] = useState<SupplierAccount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const sync = () => { setSuppliers(getSuppliers()); setProducts(getActiveProducts()); };
    sync();
    window.addEventListener(AUTH_CHANGED_EVENT, sync);
    window.addEventListener(PRODUCTS_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(AUTH_CHANGED_EVENT, sync); window.removeEventListener(PRODUCTS_CHANGED_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const visible = useMemo(() => suppliers.filter((supplier) => `${supplier.businessName} ${supplier.location} ${supplier.description}`.toLowerCase().includes(search.toLowerCase())), [suppliers, search]);
  const locations = new Set(suppliers.map((supplier) => supplier.location).filter(Boolean)).size;
  return <><section className="bg-primary-soft py-12"><div className="container-shell flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><p className="text-sm text-muted-ink">Marketplace <span className="mx-2">›</span> Suppliers</p><h1 className="mt-3 text-4xl font-black tracking-tight">Registered suppliers</h1><p className="mt-3 max-w-2xl text-muted-ink">Every business below is a local supplier account. Counts are calculated from localStorage.</p><div className="mt-6 flex gap-7 text-sm"><span><strong className="block text-xl text-primary">{suppliers.length}</strong>Suppliers</span><span><strong className="block text-xl text-primary">{products.length}</strong>Active products</span><span><strong className="block text-xl text-primary">{locations}</strong>Locations</span></div></div><label className="flex h-12 w-full max-w-sm items-center gap-3 rounded-2xl border border-line bg-white px-4"><Icon name="search" size={18} className="text-muted-ink"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search suppliers..." className="min-w-0 flex-1 bg-transparent text-sm outline-none"/></label></div></section><div className="container-shell py-14">{visible.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((supplier) => <SupplierCard key={supplier.id} supplier={supplier} productCount={products.filter((product) => product.supplierId === supplier.id).length}/>)}</div> : <div className="grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-line text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary"><Icon name="store"/></span><h2 className="mt-4 font-bold">{suppliers.length ? "No suppliers match your search" : "No suppliers have registered yet"}</h2><p className="mt-1 text-sm text-muted-ink">Supplier business profiles will appear here.</p></div></div>}</div></>;
}
