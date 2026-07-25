"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CAMBODIA_PROVINCES, PRODUCT_CATEGORIES } from "@/lib/cambodia";
import {
  createProduct,
  deleteProduct,
  getOrderRequests,
  getProductsBySupplier,
  PLATFORM_CHANGED_EVENT,
  setOrderStatus,
  setProductStatus,
  type OrderRequest,
  type Product,
} from "@/lib/localStorage";
import { useAuth } from "./AuthProvider";
import { Icon } from "./Icon";
import { useMarketplace } from "./MarketplaceProvider";

type ProductForm = {
  title: string;
  description: string;
  category: string;
  unit: string;
  price: string;
  stockQuantity: string;
  province: string;
  locationDetails: string;
  imageUrl: string;
  status: "active" | "inactive";
};

const empty: ProductForm = {
  title: "",
  description: "",
  category: "",
  unit: "",
  price: "",
  stockQuantity: "",
  province: "",
  locationDetails: "",
  imageUrl: "",
  status: "active",
};

const orderPriority: Record<OrderRequest["status"], number> = {
  new: 0,
  accepted: 1,
  completed: 2,
  rejected: 3,
  cancelled: 4,
};

function money(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function SupplierDashboard() {
  const { user } = useAuth();
  const { notify } = useMarketplace();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [form, setForm] = useState<ProductForm>(empty);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (user?.role !== "supplier") return;
    const sync = () => {
      setProducts(getProductsBySupplier(user.id));
      setOrders(getOrderRequests().filter((order) => order.supplierId === user.id));
    };
    sync();
    window.addEventListener(PLATFORM_CHANGED_EVENT, sync);
    return () => window.removeEventListener(PLATFORM_CHANGED_EVENT, sync);
  }, [user]);

  useEffect(() => {
    if (!modalOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [modalOpen]);

  const metrics = useMemo(() => {
    const activeProducts = products.filter((product) => product.status === "active").length;
    const newOrders = orders.filter((order) => order.status === "new").length;
    const revenue = orders.filter((order) => order.status === "completed").reduce((sum, order) => sum + order.totalAmount, 0);
    const inventory = products.reduce((sum, product) => sum + product.stockQuantity, 0);
    return { activeProducts, newOrders, revenue, inventory };
  }, [products, orders]);

  if (!user || user.role !== "supplier") return null;

  const update = (name: keyof ProductForm, value: string) => setForm((current) => ({ ...current, [name]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    try {
      createProduct(user, {
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
      });
      setForm(empty);
      setModalOpen(false);
      notify("Product posted to the marketplace.");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Unable to post product.");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => orderPriority[a.status] - orderPriority[b.status] || Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const recentActivity = [...orders]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 4);

  return (
    <div className="container-shell page-pad">
      <header className="flex flex-col gap-5 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Supplier Command Center</span>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{user.businessName}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-ink">
            Track product health, respond to buyers, and keep your storefront ready for verified marketplace demand.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setModalOpen(true)} className="primary-btn">
            <Icon name="plus" size={16} />
            Host Product
          </button>
          <a href="#orders" className="secondary-btn">
            Review Orders
          </a>
        </div>
      </header>

      <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Supplier performance metrics">
        <Stat icon="package" label="Active products" value={metrics.activeProducts.toString()} detail={`${products.length} total listings`} />
        <Stat icon="cart" label="New orders" value={metrics.newOrders.toString()} detail="Awaiting supplier review" />
        <Stat icon="creditCard" label="Completed revenue" value={money(metrics.revenue)} detail="From fulfilled requests" />
        <Stat icon="shield" label="Trust score" value={user.trustScore.toString()} detail={`${metrics.inventory.toLocaleString()} units available`} />
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
        <section id="products" className="surface-card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">My Products</h2>
              <p className="mt-1 text-sm text-muted-ink">Manage marketplace visibility, price, and stock at a glance.</p>
            </div>
            <button onClick={() => setModalOpen(true)} className="secondary-btn">
              <Icon name="plus" size={15} />
              Add listing
            </button>
          </div>

          {products.length ? (
            <div className="divide-y divide-line">
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onToggle={() => setProductStatus(product.id, user.id, product.status === "active" ? "inactive" : "active")}
                  onDelete={() => {
                    deleteProduct(product.id, user.id);
                    notify("Product removed from your catalog.");
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyPanel
              icon="package"
              title="No hosted products yet"
              description="Create your first listing to make it available in marketplace search."
              action={<button onClick={() => setModalOpen(true)} className="primary-btn">Host Product</button>}
            />
          )}
        </section>

        <aside className="grid gap-6">
          <section className="surface-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black">Recent Activity</h2>
              <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">{recentActivity.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {recentActivity.length ? (
                recentActivity.map((order) => (
                  <article key={order.id} className="rounded-xl border border-line bg-surface-muted p-3">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="truncate text-sm">{order.customerName}</strong>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-ink">{order.items.map((item) => item.title).join(", ")}</p>
                  </article>
                ))
              ) : (
                <p className="rounded-xl border border-dashed border-line p-5 text-sm text-muted-ink">Buyer activity will appear here once orders arrive.</p>
              )}
            </div>
          </section>

          <section className="surface-card p-5">
            <h2 className="text-lg font-black">Profile Health</h2>
            <p className="mt-2 text-sm leading-6 text-muted-ink">Verified business profile, contact information, and catalog ownership are active.</p>
            <div className="mt-4 grid gap-2 text-sm">
              {["Verified supplier account", "Product hosting enabled", "Marketplace notifications active"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl bg-primary-soft px-3 py-2 font-semibold text-primary">
                  <Icon name="check" size={14} />
                  {item}
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section id="orders" className="mt-8 surface-card overflow-hidden">
        <div className="border-b border-line p-5">
          <h2 className="text-xl font-black">Order Requests</h2>
          <p className="mt-1 text-sm text-muted-ink">Prioritized by status so new buyer requests stay visible.</p>
        </div>
        {sortedOrders.length ? (
          <div className="divide-y divide-line">
            {sortedOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyPanel icon="cart" title="No order requests yet" description="When buyers request products or quotes, they will appear here for supplier review." />
        )}
      </section>

      {modalOpen && (
        <ProductModal
          form={form}
          onSubmit={submit}
          onChange={update}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function Stat({ icon, label, value, detail }: { icon: "package" | "cart" | "creditCard" | "shield"; label: string; value: string; detail: string }) {
  return (
    <article className="surface-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-muted-ink">{label}</p>
          <strong className="mt-3 block text-2xl font-black text-foreground">{value}</strong>
        </div>
        <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
          <Icon name={icon} size={18} />
        </span>
      </div>
      <p className="mt-3 text-xs font-medium text-muted-ink">{detail}</p>
    </article>
  );
}

function ProductRow({ product, onToggle, onDelete }: { product: Product; onToggle: () => void; onDelete: () => void }) {
  return (
    <article className="grid gap-4 p-4 transition hover:bg-primary-soft/45 md:grid-cols-[1fr_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <strong className="truncate">{product.title}</strong>
          <StatusBadge status={product.status} />
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-muted-ink">{product.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-muted-ink">
          <span>{money(product.price)} / {product.unit}</span>
          <span>{product.stockQuantity.toLocaleString()} in stock</span>
          <span>{product.province}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 md:justify-end">
        <button onClick={onToggle} className="secondary-btn px-3 py-2 text-xs">
          Set {product.status === "active" ? "inactive" : "active"}
        </button>
        <button onClick={onDelete} className="secondary-btn px-3 py-2 text-xs text-red-600">
          Delete
        </button>
      </div>
    </article>
  );
}

function OrderRow({ order }: { order: OrderRequest }) {
  return (
    <article className="grid gap-4 p-5 transition hover:bg-primary-soft/40 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <strong>{order.customerName}</strong>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-2 line-clamp-2 text-sm">{order.items.map((item) => `${item.quantity}x ${item.title}`).join(", ")}</p>
        <p className="mt-2 text-sm text-muted-ink">Delivery: {order.deliveryProvince}, {order.deliveryAddressDetails}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <strong className="mr-2 text-sm">{money(order.totalAmount)}</strong>
        {order.status === "new" && (
          <>
            <button onClick={() => setOrderStatus(order.id, "accepted")} className="primary-btn px-3 py-2 text-xs">Accept</button>
            <button onClick={() => setOrderStatus(order.id, "rejected")} className="secondary-btn px-3 py-2 text-xs">Reject</button>
          </>
        )}
        {order.status === "accepted" && <button onClick={() => setOrderStatus(order.id, "completed")} className="primary-btn px-3 py-2 text-xs">Mark Completed</button>}
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: Product["status"] | OrderRequest["status"] }) {
  const tone = status === "active" || status === "accepted" || status === "completed" ? "bg-emerald-50 text-emerald-700" : status === "new" ? "bg-primary-soft text-primary" : "bg-surface-muted text-muted-ink";
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${tone}`}>{status === "new" ? "new request" : status}</span>;
}

function EmptyPanel({ icon, title, description, action }: { icon: "package" | "cart"; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="grid min-h-56 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Icon name={icon} size={22} />
        </span>
        <h3 className="mt-4 text-lg font-black">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-ink">{description}</p>
        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

function ProductModal({
  form,
  onSubmit,
  onChange,
  onClose,
}: {
  form: ProductForm;
  onSubmit: (event: FormEvent) => void;
  onChange: (name: keyof ProductForm, value: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="host-product-title"
      className="fixed inset-0 z-[140] grid place-items-center bg-[#071225]/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id="host-product-title" className="text-xl font-black">Host Product</h2>
            <p className="mt-1 text-sm text-muted-ink">Create a concise listing for verified marketplace buyers.</p>
          </div>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-primary-soft" aria-label="Close product form">
            <Icon name="close" size={17} />
          </button>
        </header>

        <form onSubmit={onSubmit} className="max-h-[calc(92vh-80px)] overflow-y-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Product title *" value={form.title} onChange={(value) => onChange("title", value)} />
            <Select label="Category *" value={form.category} onChange={(value) => onChange("category", value)} options={PRODUCT_CATEGORIES} />
            <Input label="Unit *" value={form.unit} onChange={(value) => onChange("unit", value)} />
            <Input label="Price USD *" value={form.price} type="number" onChange={(value) => onChange("price", value)} />
            <Input label="Stock quantity *" value={form.stockQuantity} type="number" onChange={(value) => onChange("stockQuantity", value)} />
            <Select label="Product province/city *" value={form.province} onChange={(value) => onChange("province", value)} options={CAMBODIA_PROVINCES} />
            <Input label="Product location details *" value={form.locationDetails} onChange={(value) => onChange("locationDetails", value)} />
            <Input label="Image URL (optional)" value={form.imageUrl} onChange={(value) => onChange("imageUrl", value)} required={false} />
            <Select label="Visibility" value={form.status} onChange={(value) => onChange("status", value)} options={["active", "inactive"]} />
            <label className="text-sm font-semibold sm:col-span-2">
              Description *
              <textarea rows={4} required value={form.description} onChange={(event) => onChange("description", event.target.value)} className="form-control py-3" />
            </label>
          </div>
          <footer className="mt-6 flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="secondary-btn justify-center">Cancel</button>
            <button className="primary-btn justify-center">Post Product</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required = true }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="form-control" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[] }) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="form-control" required>
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
