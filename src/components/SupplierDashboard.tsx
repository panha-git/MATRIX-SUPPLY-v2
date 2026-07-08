/* eslint-disable @next/next/no-img-element */
"use client";

import { FormEvent, useEffect, useState } from "react";
import { categories, productUnits } from "@/lib/data";
import {
  createProduct,
  deleteProduct,
  getProductsBySupplier,
  PRODUCTS_CHANGED_EVENT,
  updateProduct,
  type Product,
  type ProductInput,
} from "@/lib/localStorage";
import { useAuth } from "./AuthProvider";
import { Icon } from "./Icon";
import { useMarketplace } from "./MarketplaceProvider";

type FormState = {
  title: string;
  description: string;
  price: string;
  unit: string;
  stockQuantity: string;
  imageUrl: string;
  category: string;
  location: string;
};
const makeEmptyForm = (location = ""): FormState => ({
  title: "",
  description: "",
  price: "",
  unit: productUnits[0],
  stockQuantity: "0",
  imageUrl: "",
  category: categories[0].name,
  location,
});

const emptyProductsClass = [
  "mt-5 grid min-h-[300px] place-items-center rounded-[20px] border",
  "border-dashed border-line bg-white px-6 text-center",
].join(" ");

export function SupplierDashboard() {
  const { user } = useAuth();
  const { notify } = useMarketplace();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>(() =>
    makeEmptyForm(user?.role === "supplier" ? user.location : ""),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "supplier") return;
    const sync = () => setProducts(getProductsBySupplier(user.id));
    sync();
    window.addEventListener(PRODUCTS_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PRODUCTS_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [user]);

  if (!user || user.role !== "supplier") return null;
  const approvedCount = products.filter(
    (product) => product.status === "approved",
  ).length;
  const totalStock = products.reduce(
    (total, product) => total + product.stockQuantity,
    0,
  );

  const resetForm = () => {
    setForm(makeEmptyForm(user.location));
    setEditingId(null);
    setError("");
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const input: ProductInput = {
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
    };
    try {
      if (editingId) {
        const updated = updateProduct(editingId, user.id, input);
        if (!updated) throw new Error("This product could not be updated.");
        notify(`${updated.title} updated`);
      } else {
        const created = createProduct(user, input);
        notify(`${created.title} submitted for admin review`);
      }
      resetForm();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to save this product.",
      );
    }
  };

  const beginEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: String(product.price),
      unit: product.unit,
      stockQuantity: String(product.stockQuantity),
      imageUrl: product.imageUrl,
      category: product.category,
      location: product.location,
    });
    setError("");
    document
      .getElementById("product-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const remove = (product: Product) => {
    if (!window.confirm(`Delete “${product.title}”?`)) return;
    if (deleteProduct(product.id, user.id)) {
      if (editingId === product.id) resetForm();
      notify(`${product.title} deleted`);
    }
  };

  return (
    <div className="bg-[#f8faf9]">
      <div className="container-shell page-pad">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
              Supplier dashboard
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Submit products for review
            </h1>
            <p className="mt-2 text-sm text-muted-ink">
              Track every product submitted by {user.businessName}. Only admin-
              approved products appear publicly.
            </p>
          </div>
          <a
            href="#product-form"
            className="flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
          >
            <Icon name="plus" size={16} />
            Add product
          </a>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_2fr]">
          <div className="surface-card p-5">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon name="store" />
              </span>
              <div>
                <h2 className="text-lg font-bold">{user.businessName}</h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-ink">
                  <Icon name="mapPin" size={14} />
                  {user.location || "Location not provided"}
                </p>
                <p className="mt-1 text-sm text-muted-ink">
                  {user.phoneOrTelegram || "Contact not provided"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-ink">
              {user.description ||
                "Add an about description from your profile page."}
            </p>
            <a
              href="/account"
              className="mt-4 inline-flex text-sm font-bold text-primary"
            >
              Edit supplier profile →
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat value={String(products.length)} label="Total products" />
            <Stat value={String(approvedCount)} label="Approved products" />
            <Stat value={String(totalStock)} label="Units in stock" />
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
          <section id="my-products" className="scroll-mt-32">
            <h2 className="text-2xl font-bold">My products</h2>
            <p className="mt-1 text-sm text-muted-ink">
              Pending, approved, and rejected statuses are controlled by the
              demo admin.
            </p>
            {products.length ? (
              <div className="mt-5 space-y-4">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                  >
                    <img
                      src={product.imageUrl || "/product-placeholder.svg"}
                      alt={product.title}
                      onError={(event) => {
                        event.currentTarget.src = "/product-placeholder.svg";
                      }}
                      className="aspect-[4/3] w-full rounded-xl bg-primary-soft object-cover sm:w-32"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">{product.title}</h3>
                        <span className={getStatusBadgeClass(product.status)}>
                          {product.status}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-ink">
                        {product.description}
                      </p>
                      <p className="mt-3 text-xs text-muted-ink">
                        <strong className="text-foreground">
                          ${product.price.toFixed(2)}
                        </strong>{" "}
                        {product.unit} · {product.stockQuantity} in stock ·{" "}
                        {product.location}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                      <button
                        onClick={() => beginEdit(product)}
                        className="rounded-lg border border-line px-3 py-2 text-xs font-bold text-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(product)}
                        className="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={emptyProductsClass}>
                <div>
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
                    <Icon name="package" />
                  </span>
                  <h3 className="mt-4 font-bold">
                    You have not posted any products yet.
                  </h3>
                  <p className="mt-1 text-sm text-muted-ink">
                    Submit your first product for admin approval.
                  </p>
                  <a
                    href="#product-form"
                    className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Add your first product
                  </a>
                </div>
              </div>
            )}
          </section>

          <section
            id="product-form"
            className="surface-card h-fit scroll-mt-32 p-6 xl:sticky xl:top-32"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit product" : "Add a product"}
                </h2>
                <p className="mt-1 text-xs text-muted-ink">
                  New and edited products return to pending review.
                </p>
              </div>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="text-xs font-bold text-muted-ink"
                >
                  Cancel
                </button>
              )}
            </div>
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <Field label="Product title *">
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="e.g. A4 Copy Paper"
                  className="form-control"
                />
              </Field>
              <Field label="Description *">
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  rows={4}
                  placeholder="Describe the product and its specifications"
                  className="form-control resize-none py-3"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Category *">
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    className="form-control"
                  >
                    {categories.map((category) => (
                      <option key={category.name}>{category.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Unit *">
                  <select
                    value={form.unit}
                    onChange={(event) =>
                      setForm({ ...form, unit: event.target.value })
                    }
                    className="form-control"
                  >
                    {productUnits.map((unit) => (
                      <option key={unit}>{unit}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (USD) *">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    placeholder="0.00"
                    className="form-control"
                  />
                </Field>
                <Field label="Stock quantity *">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stockQuantity}
                    onChange={(event) =>
                      setForm({ ...form, stockQuantity: event.target.value })
                    }
                    className="form-control"
                  />
                </Field>
              </div>
              <Field label="Product location *">
                <input
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                  placeholder="City or province"
                  className="form-control"
                />
              </Field>
              <Field label="Image URL (optional)">
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm({ ...form, imageUrl: event.target.value })
                  }
                  placeholder="https://example.com/product.jpg"
                  className="form-control"
                />
              </Field>
              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error}
                </p>
              )}
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white">
                <Icon name={editingId ? "check" : "plus"} size={16} />
                {editingId ? "Save and resubmit" : "Submit for approval"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="surface-card grid place-items-center p-4 text-center">
      <strong className="text-2xl text-primary">{value}</strong>
      <span className="mt-1 text-xs text-muted-ink">{label}</span>
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}

function getStatusBadgeClass(status: Product["status"]) {
  return [
    "rounded px-2 py-1 text-[10px] font-bold",
    status === "approved"
      ? "bg-primary-soft text-primary"
      : status === "rejected"
        ? "bg-red-50 text-red-700"
        : "bg-amber-50 text-amber-700",
  ].join(" ");
}
