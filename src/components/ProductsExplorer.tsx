"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/data";
import {
  addToCart,
  getApprovedProducts,
  getSuppliers,
  PRODUCTS_CHANGED_EVENT,
  type Product,
  type SupplierAccount,
} from "@/lib/localStorage";
import { Icon } from "./Icon";
import { useMarketplace } from "./MarketplaceProvider";
import { ProductCard } from "./ProductCard";

export function ProductsExplorer({
  initialSearch = "",
  initialCategory = "All Products",
}: {
  initialSearch?: string;
  initialCategory?: string;
}) {
  const router = useRouter();
  const { notify, requireCustomer } = useMarketplace();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierAccount[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort] = useState("Newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setProducts(getApprovedProducts());
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

  const addProduct = (product: Product) => {
    requireCustomer((customer) => {
      addToCart(customer.id, product);
      notify(`${product.title} added to your cart`);
    });
  };

  const requestQuote = (product: Product) => {
    requireCustomer(() => {
      router.push(`/checkout?mode=quote&productId=${product.id}`);
    });
  };

  return (
    <div id="catalog" className="container-shell page-pad scroll-mt-28">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-sm text-muted-ink">
            Home <span className="mx-2">›</span> Marketplace
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Supplier marketplace
          </h1>
          <p className="mt-2 text-sm text-muted-ink">
            Browse products approved by the MATRIX SUPPLY demo admin.
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
              approved products
            </p>
          </div>
          {visible.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {visible.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addProduct}
                  onRequestQuote={requestQuote}
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
    : "Approved supplier products will appear here after admin review.";
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
