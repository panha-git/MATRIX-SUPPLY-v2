"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  createOrderRequest,
  getCart,
  getProductById,
  type CartItem,
} from "@/lib/localStorage";
import { useAuth } from "./AuthProvider";
import { Icon } from "./Icon";

export function CheckoutView({
  mode,
  productId,
}: {
  mode: "order" | "quote";
  productId?: string;
}) {
  const { user } = useAuth();
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submittedId, setSubmittedId] = useState("");
  const [cartItems] = useState<CartItem[]>(() =>
    user?.role === "customer" ? getCart(user.id).items : [],
  );

  const items = useMemo(() => {
    if (mode === "order") return cartItems;
    const product = productId ? getProductById(productId) : null;
    if (!product || product.status !== "active") return [];
    return [
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        unit: product.unit,
        supplierId: product.supplierId,
        supplierName: product.supplierName,
        quantity: 1,
        imageUrl: product.imageUrl,
      },
    ];
  }, [cartItems, mode, productId]);

  if (!user || user.role !== "customer") return null;
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      const request = createOrderRequest({
        customer: user,
        deliveryLocation,
        notes,
        items,
        requestType: mode,
      });
      setSubmittedId(request.id);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to submit request.",
      );
    }
  };

  if (submittedId) {
    return (
      <div className="container-shell grid min-h-[580px] place-items-center py-16 text-center">
        <div className="max-w-lg">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary-soft text-primary">
            <Icon name="check" size={30} />
          </span>
          <h1 className="mt-5 text-3xl font-black">
            {mode === "quote"
              ? "Quote request submitted successfully."
              : "Order request submitted successfully."}
          </h1>
          <p className="mt-3 leading-7 text-muted-ink">
            Admin will review and contact you. Your request ID is {submittedId}.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
          >
            Return to marketplace
          </Link>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container-shell page-pad text-center">
        <h1 className="text-3xl font-black">No products in this request</h1>
        <p className="mt-2 text-muted-ink">
          Add a product to your cart or choose Request Quote on a product.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
        >
          Browse marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="container-shell page-pad">
      <p className="text-sm text-muted-ink">
        Marketplace <span className="mx-2">›</span>{" "}
        {mode === "quote" ? "Quote request" : "Checkout"}
      </p>
      <h1 className="mt-3 text-3xl font-black sm:text-4xl">
        {mode === "quote" ? "Submit Quote Request" : "Submit Order Request"}
      </h1>
      <p className="mt-2 text-sm text-muted-ink">
        No payment is collected. Admin will review the request and contact you.
      </p>
      <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={submit} className="surface-card p-6" noValidate>
          <h2 className="text-xl font-bold">Contact and delivery details</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <ReadOnly label="Customer name" value={user.fullName} />
            <ReadOnly label="Gmail" value={user.gmail} />
            <ReadOnly label="Phone" value={user.phoneNumber} />
            <label className="block text-sm font-semibold">
              Delivery location *
              <input
                value={deliveryLocation}
                onChange={(event) => setDeliveryLocation(event.target.value)}
                placeholder="Address, city, or province"
                className="form-control"
              />
            </label>
          </div>
          <label className="mt-5 block text-sm font-semibold">
            Notes (optional)
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Quantity details, timing, or contact preference"
              className="form-control resize-none py-3"
            />
          </label>
          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <button className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white">
            {mode === "quote" ? "Submit Quote Request" : "Submit Order Request"}
          </button>
        </form>
        <aside className="surface-card h-fit p-6">
          <h2 className="font-bold">Request items</h2>
          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="border-b border-line pb-4 text-sm"
              >
                <div className="flex justify-between gap-4">
                  <span className="font-semibold">{item.title}</span>
                  <span>x{item.quantity}</span>
                </div>
                <p className="mt-1 text-xs text-muted-ink">
                  {item.supplierName}
                </p>
                <p className="mt-1 text-xs font-semibold text-primary">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between">
            <strong>Estimated total</strong>
            <strong className="text-primary">${total.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input readOnly value={value} className="form-control text-muted-ink" />
    </label>
  );
}
