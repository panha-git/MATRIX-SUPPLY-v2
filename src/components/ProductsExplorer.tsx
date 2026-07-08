/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "@/lib/data";
import {
  getActiveProducts,
  getSuppliers,
  PRODUCTS_CHANGED_EVENT,
  type Product,
  type SupplierAccount,
} from "@/lib/localStorage";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";

export function ProductsExplorer({
  initialSearch = "",
  initialCategory = "All Products",
}: {
  initialSearch?: string;
  initialCategory?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierAccount[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort] = useState("Newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    const sync = () => {
      setProducts(getActiveProducts());
      setSuppliers(getSuppliers());
    };
    sync();
    window.addEventListener(PRODUCTS_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PRODUCTS_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const locations = useMemo(
    () => [...new Set(products.map((product) => product.location))].sort(),
    [products],
  );
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = products.filter(
      (product) =>
        (category === "All Products" || product.category === category) &&
        (location === "All Locations" || product.location === location) &&
        (!query || product.title.toLowerCase().includes(query)),
    );
    return [...result].sort((a, b) =>
      sort === "Price: Low"
        ? a.price - b.price
        : sort === "Price: High"
          ? b.price - a.price
          : Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
  }, [products, search, category, location, sort]);

  const clearFilters = () => {
    setCategory("All Products");
    setLocation("All Locations");
    setSearch("");
  };

  return (
    <div id="catalog" className="container-shell page-pad scroll-mt-28">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-ink">
            Customer <span className="mx-2">›</span> Marketplace
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Supplier marketplace
          </h1>
          <p className="mt-2 text-sm text-muted-ink">
            Browse active products posted by registered local suppliers.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold lg:hidden"
          >
            Filters
          </button>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
          >
            <option>Newest</option>
            <option>Price: Low</option>
            <option>Price: High</option>
          </select>
        </div>
      </div>
      <div className="grid gap-7 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside
          className={`${filtersOpen ? "block" : "hidden"} h-fit rounded-2xl border border-line p-5 lg:block`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-accent"
            >
              Clear all
            </button>
          </div>
          <label className="mt-5 flex h-11 items-center gap-2 rounded-xl border border-line bg-[#f7f9f7] px-3">
            <Icon name="search" size={16} className="text-muted-ink" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product name"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
          <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-muted-ink">
            Location
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-normal normal-case text-foreground"
            >
              <option>All Locations</option>
              {locations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <div className="mt-6 border-t border-line pt-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-ink">
              Category
            </h3>
            <div className="space-y-1">
              <FilterButton
                active={category === "All Products"}
                onClick={() => setCategory("All Products")}
                label="All Products"
                count={products.length}
              />
              {categories.map((item) => (
                <FilterButton
                  key={item.name}
                  active={category === item.name}
                  onClick={() => setCategory(item.name)}
                  label={item.name}
                  count={
                    products.filter((product) => product.category === item.name)
                      .length
                  }
                />
              ))}
            </div>
          </div>
        </aside>
        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-ink">
              Showing{" "}
              <strong className="text-foreground">{visible.length}</strong>{" "}
              active products
            </p>
          </div>
          {visible.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {visible.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={setSelected}
                />
              ))}
            </div>
          ) : (
            <EmptyMarketplace
              hasSuppliers={suppliers.length > 0}
              hasProducts={products.length > 0}
            />
          )}
        </div>
      </div>
      {selected && (
        <ProductDetail
          product={selected}
          supplier={suppliers.find((item) => item.id === selected.supplierId)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function EmptyMarketplace({
  hasSuppliers,
  hasProducts,
}: {
  hasSuppliers: boolean;
  hasProducts: boolean;
}) {
  const title = !hasSuppliers
    ? "No suppliers have posted products yet"
    : !hasProducts
      ? "No products available yet"
      : "No products match your filters";
  const detail = hasProducts
    ? "Try another product name, category, or location."
    : "Active supplier products will appear here when they are published.";
  return (
    <div className="grid min-h-[360px] place-items-center rounded-2xl border border-dashed border-line bg-[#fafbfa] px-6 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
          <Icon name="store" />
        </span>
        <h2 className="mt-4 font-bold">{title}</h2>
        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-ink">
          {detail}
        </p>
      </div>
    </div>
  );
}

function ProductDetail({
  product,
  supplier,
  onClose,
}: {
  product: Product;
  supplier?: SupplierAccount;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${product.title} details`}
      className="fixed inset-0 z-[90] grid place-items-center bg-[#07150d]/65 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[24px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <span className="text-sm font-bold">Product details</span>
          <button
            onClick={onClose}
            aria-label="Close product details"
            className="grid size-9 place-items-center rounded-full hover:bg-[#f3f5f3]"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-[280px_minmax(0,1fr)]">
          <img
            src={product.imageUrl || "/product-placeholder.svg"}
            alt={product.title}
            onError={(event) => {
              event.currentTarget.src = "/product-placeholder.svg";
            }}
            className="aspect-[4/3] w-full rounded-2xl bg-primary-soft object-cover"
          />
          <div>
            <span className="rounded bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
              {product.category}
            </span>
            <h2 className="mt-3 text-2xl font-black">{product.title}</h2>
            <div className="mt-3 flex items-baseline gap-2">
              <strong className="text-2xl text-primary">
                ${product.price.toFixed(2)}
              </strong>
              <span className="text-sm text-muted-ink">{product.unit}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-ink">
              {product.description}
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Detail
                label="Available stock"
                value={`${product.stockQuantity}`}
              />
              <Detail label="Product location" value={product.location} />
            </dl>
            <section className="mt-6 rounded-2xl border border-line bg-[#f8faf9] p-4">
              <h3 className="font-bold">Supplier information</h3>
              <p className="mt-2 text-sm font-semibold text-primary-dark">
                {product.supplierName}
              </p>
              <p className="mt-1 text-xs text-muted-ink">
                {product.supplierGmail}
              </p>
              {supplier?.phoneNumber && (
                <p className="mt-1 text-xs text-muted-ink">
                  {supplier.phoneNumber}
                </p>
              )}
              {supplier?.description && (
                <p className="mt-3 text-sm leading-6 text-muted-ink">
                  {supplier.description}
                </p>
              )}
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line p-3">
      <dt className="text-xs text-muted-ink">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  const buttonClass = [
    "flex w-full items-center justify-between rounded-lg px-3 py-2",
    "text-left text-sm",
    active
      ? "bg-primary-soft font-semibold text-primary"
      : "hover:bg-[#f7f8f7]",
  ].join(" ");

  return (
    <button onClick={onClick} className={buttonClass}>
      <span>{label}</span>
      <span className="text-[11px] text-muted-ink">{count}</span>
    </button>
  );
}
