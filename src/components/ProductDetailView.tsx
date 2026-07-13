/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  addToCart,
  createReport,
  getProductById,
  getSuppliers,
  PRODUCTS_CHANGED_EVENT,
  type Product,
  type SupplierAccount,
  startChat,
} from "@/lib/localStorage";
import { Icon } from "./Icon";
import { useMarketplace } from "./MarketplaceProvider";

export function ProductDetailView({ productId }: { productId: string }) {
  const router = useRouter();
  const { notify, requireCustomer } = useMarketplace();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [supplier, setSupplier] = useState<SupplierAccount | undefined>();

  useEffect(() => {
    const sync = () => {
      const found = getProductById(productId);
      const visible = found?.status === "active" ? found : null;
      setProduct(visible);
      setSupplier(
        visible
          ? getSuppliers().find((item) => item.id === visible.supplierId)
          : undefined,
      );
    };
    sync();
    window.addEventListener(PRODUCTS_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PRODUCTS_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [productId]);

  if (product === undefined) {
    return <div className="container-shell page-pad"><div className="loading-state"><i/><p>Loading product information…</p></div></div>;
  }

  if (!product) {
    return (
      <div className="container-shell page-pad text-center">
        <h1 className="text-3xl font-black">Product not available</h1>
        <p className="mt-3 text-muted-ink">
          It may be inactive or no longer available.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
        >
          Back to marketplace
        </Link>
      </div>
    );
  }

  const addProduct = () => {
    requireCustomer((customer) => {
      addToCart(customer.id, product);
      notify(`${product.title} added to your cart`);
    });
  };

  const requestQuote = () => {
    requireCustomer((customer) => {
      router.push(`/chat?room=${startChat(customer, product).id}`);
    });
  };

  const reportProduct = () => requireCustomer((customer) => {
    const reason = window.prompt("Please enter your report reason.");
    if (!reason) return;
    createReport({ reporterId: customer.id, reporterName: customer.fullName, targetType: "product", targetId: product.id, reason });
    notify("Report submitted to marketplace safety");
  });

  return (
    <div className="container-shell page-pad">
      <p className="text-sm text-muted-ink">
        <Link href="/products">Marketplace</Link>{" "}
        <span className="mx-2">›</span> {product.title}
      </p>
      <article className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)]">
        <img
          src={product.imageUrl || "/product-placeholder.svg"}
          alt={product.title}
          onError={(event) => {
            event.currentTarget.src = "/product-placeholder.svg";
          }}
          className="aspect-[4/3] w-full rounded-[28px] border border-line bg-white object-cover shadow-[0_16px_40px_rgba(17,43,74,.08)]"
        />
        <div>
          <div className="flex flex-wrap gap-2"><span className="badge">{product.category}</span><span className="verified-badge">✓ Verified Cambodian Supplier</span></div>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-3 text-sm font-semibold text-primary-dark">
            Supplied by {product.supplierName}
          </p>
          <div className="mt-5 flex items-baseline gap-2">
            <strong className="text-4xl text-primary">
              ${product.price.toFixed(2)}
            </strong>
            <span className="text-sm text-muted-ink">{product.unit}</span>
          </div>
          <p className="mt-6 text-base leading-8 text-muted-ink">
            {product.description}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <Detail
              label="Stock quantity"
              value={String(product.stockQuantity)}
            />
            <Detail label="Location" value={product.province} />
          </dl>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={addProduct}
              disabled={product.stockQuantity === 0}
              className="primary-btn py-3.5 disabled:bg-slate-300"
            >
              <Icon name="cart" size={17} /> Add to cart
            </button>
            <button
              onClick={requestQuote}
              className="secondary-btn py-3.5"
            >
              Chat with Supplier
            </button>
          </div>
          <button onClick={reportProduct} className="mt-4 text-xs font-semibold text-slate-400 hover:text-red-600">Report Product</button>
          <section className="mt-7 rounded-2xl border border-line bg-[#f8faf9] p-5">
            <h2 className="font-bold">Supplier information</h2>
            <p className="mt-2 text-sm font-semibold text-primary-dark">
              {product.supplierName}
            </p>
            <p className="mt-1 text-xs text-muted-ink">
              {product.supplierGmail}
            </p>
            {supplier?.phoneOrTelegram && (
              <p className="mt-1 text-xs text-muted-ink">
                {supplier.phoneOrTelegram}
              </p>
            )}
            {supplier?.description && (
              <p className="mt-3 text-sm leading-6 text-muted-ink">
                {supplier.description}
              </p>
            )}
          </section>
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
