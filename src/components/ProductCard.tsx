"use client";

import type { Product } from "@/lib/localStorage";
import { Icon } from "./Icon";

export function ProductCard({ product, onView }: { product: Product; onView: (product: Product) => void }) {
  const stockLabel = product.stockQuantity === 0 ? "Out of stock" : product.stockQuantity <= 5 ? `Low stock: ${product.stockQuantity}` : `${product.stockQuantity} in stock`;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_8px_rgba(24,32,25,.025)] hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#edf2ee]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.imageUrl || "/product-placeholder.svg"} alt={product.title} className="size-full object-cover transition duration-500 group-hover:scale-105" onError={(event) => { event.currentTarget.src = "/product-placeholder.svg"; }} />
        <span className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-[10px] font-bold text-white">{product.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-5">{product.title}</h3>
        <p className="mt-2 truncate text-xs font-semibold text-primary-dark">{product.supplierName}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-ink"><Icon name="mapPin" size={12}/>{product.location}</p>
        <div className="mt-auto pt-5"><div className="flex items-baseline gap-1"><span className="text-xl font-extrabold tracking-tight">${product.price.toFixed(2)}</span><span className="text-xs text-muted-ink">{product.unit}</span></div><p className={`mt-1 text-[11px] font-semibold ${product.stockQuantity === 0 ? "text-red-600" : product.stockQuantity <= 5 ? "text-amber-700" : "text-primary"}`}>● {stockLabel}</p><button type="button" onClick={() => onView(product)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary-dark">View details <Icon name="arrowRight" size={14}/></button></div>
      </div>
    </article>
  );
}
