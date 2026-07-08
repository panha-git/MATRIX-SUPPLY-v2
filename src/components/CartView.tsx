/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CARTS_CHANGED_EVENT,
  getCart,
  removeCartItem,
  setCartItemQuantity,
  type CartItem,
} from "@/lib/localStorage";
import { useAuth } from "./AuthProvider";
import { Icon } from "./Icon";
import { useMarketplace } from "./MarketplaceProvider";

export function CartView() {
  const { user } = useAuth();
  const { notify } = useMarketplace();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (user?.role !== "customer") return;
    const sync = () => setItems(getCart(user.id).items);
    sync();
    window.addEventListener(CARTS_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CARTS_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [user]);

  if (!user || user.role !== "customer") return null;
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const changeQuantity = (item: CartItem, quantity: number) => {
    setCartItemQuantity(user.id, item.productId, quantity);
  };

  const remove = (item: CartItem) => {
    removeCartItem(user.id, item.productId);
    notify(`${item.title} removed from your cart`);
  };

  return (
    <div className="container-shell page-pad">
      <p className="text-sm text-muted-ink">
        Marketplace <span className="mx-2">›</span> Cart
      </p>
      <h1 className="mt-3 text-3xl font-black sm:text-4xl">Your cart</h1>
      <p className="mt-2 text-sm text-muted-ink">
        Review quantities before submitting an order request. No payment is
        collected.
      </p>

      {!items.length ? (
        <div className="mt-8 grid min-h-[340px] place-items-center rounded-2xl border border-dashed border-line bg-[#fafbfa] px-6 text-center">
          <div>
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
              <Icon name="cart" />
            </span>
            <h2 className="mt-4 font-bold">Your cart is empty.</h2>
            <p className="mt-1 text-sm text-muted-ink">
              Browse the marketplace to add products.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Browse marketplace
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-4">
            {items.map((item) => (
              <article
                key={item.productId}
                className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <img
                  src={item.imageUrl || "/product-placeholder.svg"}
                  alt={item.title}
                  onError={(event) => {
                    event.currentTarget.src = "/product-placeholder.svg";
                  }}
                  className="aspect-[4/3] w-full rounded-xl bg-primary-soft object-cover sm:w-32"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="mt-1 text-xs text-muted-ink">
                    {item.supplierName}
                  </p>
                  <p className="mt-3 text-sm font-bold text-primary">
                    ${item.price.toFixed(2)} {item.unit}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                  <div className="inline-flex items-center rounded-xl border border-line">
                    <button
                      onClick={() => changeQuantity(item, item.quantity - 1)}
                      className="grid size-9 place-items-center text-lg"
                      aria-label={`Decrease ${item.title} quantity`}
                    >
                      −
                    </button>
                    <span className="min-w-9 text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => changeQuantity(item, item.quantity + 1)}
                      className="grid size-9 place-items-center text-lg"
                      aria-label={`Increase ${item.title} quantity`}
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-2 text-sm font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => remove(item)}
                    className="mt-2 text-xs font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>
          <aside className="surface-card h-fit p-6 lg:sticky lg:top-32">
            <h2 className="text-lg font-bold">Request summary</h2>
            <div className="mt-5 flex justify-between border-b border-line pb-4 text-sm text-muted-ink">
              <span>Total items</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between py-5">
              <strong>Cart total</strong>
              <strong className="text-xl text-primary">
                ${total.toFixed(2)}
              </strong>
            </div>
            <Link
              href="/checkout"
              className="block rounded-xl bg-primary px-5 py-3.5 text-center text-sm font-bold text-white"
            >
              Continue to order request
            </Link>
            <p className="mt-3 text-center text-[11px] leading-5 text-muted-ink">
              This is not a payment. Admin will review your request and contact
              you.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
