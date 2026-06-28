"use client";

import { useState } from "react";
import type { Product } from "@/lib/data";
import { Icon } from "./Icon";
import { useMarketplace } from "./MarketplaceProvider";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [saved, setSaved] = useState(false);
  const { addToCart, toggleSaved } = useMarketplace();
  const stock = product.stock ?? "In stock";

  const handleSaved = () => {
    const next = !saved;
    setSaved(next);
    toggleSaved(next);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_8px_rgba(24,32,25,.025)] hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <div className={`relative overflow-hidden bg-[#edf2ee] ${compact ? "aspect-[4/2.7]" : "aspect-[4/3]"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className="size-full object-cover transition duration-500 group-hover:scale-105" />
        {product.discount && <span className="absolute left-3 top-3 rounded-md bg-accent px-2 py-1 text-[10px] font-bold text-white">{product.discount}</span>}
        <button type="button" onClick={handleSaved} aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`} className={`absolute right-3 top-3 grid size-8 place-items-center rounded-full border border-white/50 bg-white/90 shadow-sm ${saved ? "text-accent" : "text-[#68726b] hover:text-accent"}`}>
          <Icon name="heart" size={16} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.badge && <span className="mb-2 w-fit rounded bg-primary-soft px-2 py-1 text-[10px] font-semibold capitalize text-primary">{product.badge}</span>}
        <h3 className="line-clamp-2 text-[15px] font-bold leading-5">{product.name}</h3>
        <p className="mt-1 text-xs text-muted-ink">{product.supplier} · {product.pack}</p>
        <div className="mt-auto pt-5">
          <div className="flex items-baseline gap-2"><span className="text-xl font-extrabold tracking-tight">${product.price.toFixed(2)}</span>{product.oldPrice && <span className="text-xs text-muted-ink line-through">${product.oldPrice.toFixed(2)}</span>}</div>
          <p className={`mt-1 text-[11px] font-medium ${stock === "Low stock" ? "text-[#a26a00]" : "text-primary"}`}>● {stock}</p>
          <button onClick={() => addToCart(product.name)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary-dark active:scale-[.98]"><Icon name="plus" size={14} />Add to cart</button>
        </div>
      </div>
    </article>
  );
}
