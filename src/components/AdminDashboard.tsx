"use client";

import { useEffect, useState } from "react";
import {
  CARTS_CHANGED_EVENT,
  getCartSummary,
  getOrderRequests,
  getProducts,
  ORDERS_CHANGED_EVENT,
  PRODUCTS_CHANGED_EVENT,
  resetDemoData,
  seedDemoData,
  setOrderStatus,
  setProductApproval,
  type OrderRequest,
  type OrderStatus,
  type Product,
  type ProductStatus,
} from "@/lib/localStorage";
import { useAuth } from "./AuthProvider";
import { Icon } from "./Icon";
import { useMarketplace } from "./MarketplaceProvider";

export function AdminDashboard() {
  const { user } = useAuth();
  const { notify } = useMarketplace();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [cartSummary, setCartSummary] = useState({
    customerCarts: 0,
    itemQuantity: 0,
  });

  useEffect(() => {
    const sync = () => {
      setProducts(getProducts());
      setOrders(getOrderRequests());
      setCartSummary(getCartSummary());
    };
    sync();
    const events = [
      PRODUCTS_CHANGED_EVENT,
      ORDERS_CHANGED_EVENT,
      CARTS_CHANGED_EVENT,
      "storage",
    ];
    events.forEach((event) => window.addEventListener(event, sync));
    return () =>
      events.forEach((event) => window.removeEventListener(event, sync));
  }, []);

  if (!user || user.role !== "admin") return null;
  const pending = products.filter((product) => product.status === "pending");
  const approved = products.filter((product) => product.status === "approved");

  const updateProductStatus = (product: Product, status: ProductStatus) => {
    if (setProductApproval(product.id, status)) {
      notify(`${product.title} marked ${status}`);
    }
  };

  const updateOrderStatus = (order: OrderRequest, status: OrderStatus) => {
    if (setOrderStatus(order.id, status)) {
      notify(`${order.id} marked ${status}`);
    }
  };

  const seed = () => {
    if (
      window.confirm(
        "Replace current MATRIX SUPPLY browser data with the demo dataset?",
      )
    ) {
      seedDemoData();
      notify("Demo data seeded");
    }
  };

  const reset = () => {
    if (
      window.confirm(
        "Remove all MATRIX SUPPLY accounts, products, carts, and requests from this browser?",
      )
    ) {
      resetDemoData();
    }
  };

  return (
    <div className="bg-[#f8faf9]">
      <div className="container-shell page-pad">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
              Admin demo dashboard
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Review marketplace activity
            </h1>
            <p className="mt-2 text-sm text-muted-ink">
              Approve supplier submissions and review customer requests stored
              in this browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={seed}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
            >
              Seed Demo Data
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600"
            >
              Reset Demo Data
            </button>
          </div>
        </div>

        <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Stat label="Pending products" value={pending.length} />
          <Stat label="Approved products" value={approved.length} />
          <Stat label="Customer requests" value={orders.length} />
          <Stat label="Active carts" value={cartSummary.customerCarts} />
          <Stat label="Items in carts" value={cartSummary.itemQuantity} />
        </section>

        <section className="mt-10">
          <SectionHeading
            title="Pending supplier product requests"
            detail="Products remain private until you approve them."
          />
          {pending.length ? (
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {pending.map((product) => (
                <ProductReview
                  key={product.id}
                  product={product}
                  onStatus={updateProductStatus}
                />
              ))}
            </div>
          ) : (
            <Empty text="No supplier products are waiting for review." />
          )}
        </section>

        <section className="mt-10">
          <SectionHeading
            title="Approved products"
            detail="These products are visible in the public marketplace."
          />
          {approved.length ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {approved.map((product) => (
                <article key={product.id} className="surface-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{product.title}</h3>
                      <p className="mt-1 text-xs text-muted-ink">
                        {product.supplierName}
                      </p>
                    </div>
                    <span className="rounded bg-primary-soft px-2 py-1 text-[10px] font-bold text-primary">
                      approved
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-bold text-primary">
                    ${product.price.toFixed(2)} {product.unit}
                  </p>
                  <button
                    onClick={() => updateProductStatus(product, "rejected")}
                    className="mt-4 text-xs font-bold text-red-600"
                  >
                    Remove approval
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <Empty text="No products have been approved yet." />
          )}
        </section>

        <section className="mt-10">
          <SectionHeading
            title="Customer Order Requests"
            detail="Order and quote requests are inquiries only; no payment is collected."
          />
          {orders.length ? (
            <div className="mt-5 space-y-4">
              {orders.map((order) => (
                <OrderReview
                  key={order.id}
                  order={order}
                  onStatus={updateOrderStatus}
                />
              ))}
            </div>
          ) : (
            <Empty text="No customer order or quote requests yet." />
          )}
        </section>
      </div>
    </div>
  );
}

function ProductReview({
  product,
  onStatus,
}: {
  product: Product;
  onStatus: (product: Product, status: ProductStatus) => void;
}) {
  return (
    <article className="surface-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">{product.title}</h3>
          <p className="mt-1 text-xs text-muted-ink">
            {product.supplierName} · {product.supplierGmail}
          </p>
        </div>
        <span className="rounded bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
          pending
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-ink">
        {product.description}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <Info
          label="Price"
          value={`$${product.price.toFixed(2)} ${product.unit}`}
        />
        <Info label="Stock" value={String(product.stockQuantity)} />
        <Info label="Category" value={product.category} />
        <Info label="Location" value={product.location} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={() => onStatus(product, "approved")}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
        >
          Approve product
        </button>
        <button
          onClick={() => onStatus(product, "rejected")}
          className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600"
        >
          Reject
        </button>
      </div>
    </article>
  );
}

function OrderReview({
  order,
  onStatus,
}: {
  order: OrderRequest;
  onStatus: (order: OrderRequest, status: OrderStatus) => void;
}) {
  return (
    <article className="surface-card p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold">{order.id}</h3>
            <span className="rounded bg-primary-soft px-2 py-1 text-[10px] font-bold uppercase text-primary">
              {order.requestType}
            </span>
            <span className={orderStatusClass(order.status)}>
              {order.status}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold">{order.customerName}</p>
          <p className="mt-1 text-xs text-muted-ink">
            {order.customerGmail} · {order.phoneOrTelegram}
          </p>
          <p className="mt-1 text-xs text-muted-ink">
            Delivery: {order.deliveryLocation}
          </p>
          <p className="mt-1 text-xs text-muted-ink">
            Created: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <strong className="text-xl text-primary">
          ${order.totalAmount.toFixed(2)}
        </strong>
      </div>
      <div className="mt-4 rounded-xl bg-[#f8faf9] p-4">
        <h4 className="text-xs font-bold uppercase tracking-wide text-muted-ink">
          Items
        </h4>
        <ul className="mt-2 space-y-1 text-sm">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3">
              <span>
                {item.title} · {item.supplierName}
              </span>
              <span>
                {item.quantity} × ${item.price.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-ink">
          <strong>Notes:</strong> {order.notes || "No notes"}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusButton
          label="Mark reviewed"
          onClick={() => onStatus(order, "reviewed")}
        />
        <StatusButton
          label="Approve request"
          onClick={() => onStatus(order, "approved")}
        />
        <StatusButton
          label="Reject request"
          danger
          onClick={() => onStatus(order, "rejected")}
        />
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="surface-card p-4 text-center">
      <strong className="block text-2xl text-primary">{value}</strong>
      <span className="mt-1 block text-xs text-muted-ink">{label}</span>
    </div>
  );
}

function SectionHeading({ title, detail }: { title: string; detail: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted-ink">{detail}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line p-2.5">
      <span className="block text-[10px] uppercase text-muted-ink">
        {label}
      </span>
      <strong className="mt-1 block">{value}</strong>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-muted-ink">
      <Icon name="package" className="mx-auto mb-3 text-primary" />
      {text}
    </div>
  );
}

function StatusButton({
  label,
  onClick,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-xs font-bold ${
        danger ? "border-red-200 text-red-600" : "border-line text-primary"
      }`}
    >
      {label}
    </button>
  );
}

function orderStatusClass(status: OrderStatus) {
  return [
    "rounded px-2 py-1 text-[10px] font-bold",
    status === "approved"
      ? "bg-primary-soft text-primary"
      : status === "rejected"
        ? "bg-red-50 text-red-700"
        : status === "reviewed"
          ? "bg-blue-50 text-blue-700"
          : "bg-amber-50 text-amber-700",
  ].join(" ");
}
