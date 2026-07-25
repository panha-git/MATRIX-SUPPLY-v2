/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import type { Product } from "@/lib/localStorage";
import { getMockProductById } from "@/lib/mock/products";
import { Icon } from "./Icon";
import { VerifiedBadge } from "./ui";

export function ProductCard({
  product,
  onAddToCart,
  onRequestQuote,
  onChat,
  onReport,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
  onChat?: (product: Product) => void;
  onReport?: (product: Product) => void;
}) {
  const rich = getMockProductById(product.id);
  const out = product.stockQuantity === 0;
  const low = product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <article className="card hover-card group flex h-full min-w-0 flex-col overflow-hidden">
      <Link href={`/products/${product.id}`} className="relative block h-28 overflow-hidden bg-surface-muted min-[390px]:h-32 sm:h-44 lg:h-52">
        <img
          src={product.imageUrl || "/product-placeholder.svg"}
          alt={product.title}
          onError={(event) => {
            event.currentTarget.src = "/product-placeholder.svg";
          }}
          className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-1.5 top-1.5 max-w-[calc(100%-12px)] truncate rounded-full bg-surface/95 px-1.5 py-0.5 text-[8px] font-bold text-primary shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
          {rich?.subcategory || product.category}
        </span>
        <span className="absolute bottom-1.5 right-1.5 rounded-full bg-[#071225]/85 px-1.5 py-0.5 text-[8px] font-bold text-white sm:bottom-3 sm:right-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
          {rich?.rating || 4.8}★
          <span className="hidden min-[390px]:inline"> · {rich?.soldCount.toLocaleString() || "840"} sold</span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4 lg:p-5">
        <div className="hidden sm:block">
          <VerifiedBadge>Verified Supplier</VerifiedBadge>
        </div>
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 text-[12px] font-bold leading-4 text-foreground hover:text-primary sm:mt-3 sm:text-[15px] sm:leading-5"
        >
          {product.title}
        </Link>
        <p className="mt-1.5 hidden line-clamp-2 text-[11px] leading-4 text-muted-ink sm:mt-2 sm:block sm:text-xs sm:leading-5">
          {rich?.shortDescription || product.description}
        </p>
        <p className="mt-1.5 truncate text-[10px] font-semibold text-muted-ink sm:mt-2 sm:text-xs">{product.supplierName}</p>

        <div className="mt-1.5 flex items-center justify-between gap-1.5 sm:mt-3 sm:gap-2">
          <p className="flex min-w-0 items-center gap-1 truncate text-[10px] text-muted-ink sm:text-xs">
            <Icon name="mapPin" size={11} />
            <span className="truncate">{product.province}</span>
          </p>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold sm:px-2 sm:py-1 sm:text-[10px] ${
              out ? "bg-red-50 text-red-600" : low ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {out ? "Out" : low ? `${product.stockQuantity} left` : "In stock"}
          </span>
        </div>

        <div className="mt-2 hidden grid-cols-3 gap-1.5 text-center text-[10px] text-muted-ink sm:mt-3 sm:grid sm:gap-2 sm:text-[11px]">
          <span className="rounded-lg bg-surface-muted px-1 py-1.5">MOQ {rich?.MOQ || 10}</span>
          <span className="rounded-lg bg-surface-muted px-1 py-1.5">{rich?.leadTime || "48h"}</span>
          <span className="rounded-lg bg-surface-muted px-1 py-1.5">{rich?.estimatedDelivery || "3-5d"}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-1.5 pt-2.5 sm:gap-2 sm:pt-5">
          <div className="min-w-0">
            <strong className="text-[15px] text-primary sm:text-xl">${product.price.toFixed(2)}</strong>
            <span className="ml-0.5 text-[9px] text-muted-ink sm:ml-1 sm:text-xs">{product.unit}</span>
            {rich && <p className="hidden text-[10px] text-muted-ink sm:block sm:text-[11px]">Retail ${rich.retailPrice.toFixed(2)}</p>}
          </div>
          <Link href={`/products/${product.id}`} className="shrink-0 text-[10px] font-bold text-primary sm:text-xs">
            Details
          </Link>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:mt-4 sm:gap-2">
          <button
            disabled={out}
            onClick={() => onAddToCart(product)}
            className="primary-btn min-h-11 px-1.5 py-2 text-[11px] disabled:cursor-not-allowed sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <Icon name="cart" size={14} /> Add
          </button>
          <button
            onClick={() => (onChat ? onChat(product) : onRequestQuote(product))}
            className="secondary-btn min-h-11 px-1.5 py-2 text-[11px] sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <Icon name="headset" size={14} /> Chat
          </button>
        </div>

        {onReport && (
          <button onClick={() => onReport(product)} className="danger-btn mt-1.5 min-h-9 justify-start px-2 py-1.5 text-[10px] sm:mt-3 sm:min-h-0 sm:text-[11px]">
            Report Product
          </button>
        )}
      </div>
    </article>
  );
}
