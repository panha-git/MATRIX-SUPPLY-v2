/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  addToCart,
  createReport,
  getActiveProducts,
  getProductById,
  getSuppliers,
  PRODUCTS_CHANGED_EVENT,
  type Product,
  type SupplierAccount,
  startChat,
} from "@/lib/localStorage";
import { getMockProductById } from "@/lib/mock/products";
import { getMockReviews } from "@/lib/mock/reviews";
import { Icon } from "./Icon";
import { useMarketplace } from "./MarketplaceProvider";

export function ProductDetailView({ productId }: { productId: string }) {
  const router = useRouter();
  const { notify, requireCustomer } = useMarketplace();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [supplier, setSupplier] = useState<SupplierAccount | undefined>();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const sync = () => {
      const found = getProductById(productId);
      const visible = found?.status === "active" ? found : null;
      setProduct(visible);
      setProducts(getActiveProducts());
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

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  }, [product, products]);
  const rich = product ? getMockProductById(product.id) : null;
  const reviews = product ? getMockReviews(product.id).slice(0, 5) : [];

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
          className="primary-btn mt-6"
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
        <div>
          <img
            src={product.imageUrl || "/product-placeholder.svg"}
            alt={product.title}
            onError={(event) => {
              event.currentTarget.src = "/product-placeholder.svg";
            }}
            className="aspect-[4/3] w-full rounded-[28px] border border-line bg-surface object-cover shadow-[0_16px_40px_rgba(17,43,74,.08)]"
          />
          {rich && <div className="mt-4 grid grid-cols-3 gap-3">
            {rich.images.slice(1, 4).map((image) => <img key={image} src={image} alt={product.title} className="aspect-[4/3] rounded-2xl border border-line object-cover" />)}
          </div>}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface-muted p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[.08em] text-muted-ink">Lead time</p>
              <p className="mt-2 text-sm font-bold text-primary">{rich?.leadTime || "Ready to ship in 24-48 hours"}</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-muted p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[.08em] text-muted-ink">MOQ</p>
              <p className="mt-2 text-sm font-bold text-primary">MOQ {rich?.MOQ || "flexible"} · {rich?.packagingInformation.split(",")[0] || "wholesale packing"}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-2"><span className="badge">{product.category}</span><span className="verified-badge">✓ Verified NEXXA Supplier</span></div>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">{product.title}</h1>
          <p className="mt-3 text-sm font-semibold text-primary-dark">Supplied by {product.supplierName}</p>
          <div className="mt-5 flex items-baseline gap-2">
            <strong className="text-4xl text-primary">${product.price.toFixed(2)}</strong>
            <span className="text-sm text-muted-ink">{product.unit}</span>
          </div>
          <p className="mt-6 text-base leading-8 text-muted-ink">{product.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <Detail label="Stock quantity" value={String(product.stockQuantity)} />
            <Detail label="Location" value={product.province} />
            <Detail label="Supplier rating" value={rich ? `${rich.rating} / 5 from ${rich.reviewCount} reviews` : supplier?.trustScore ? `${supplier.trustScore}%` : "Verified"} />
            <Detail label="Delivery estimate" value={rich?.estimatedDelivery || "3-5 days"} />
            <Detail label="Warehouse" value={rich?.warehouseLocation || product.locationDetails} />
            <Detail label="Buyer interest" value={`${rich?.views.toLocaleString() || "9,800"} views · ${rich?.favouriteCount || 205} saved`} />
          </dl>
          {rich && <section className="mt-6 rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-bold">Specifications and packing</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {Object.entries(rich.specifications).map(([key, value]) => <Detail key={key} label={key.replaceAll("_", " ")} value={value} />)}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-ink">{rich.packagingInformation}</p>
            <div className="mt-3 flex flex-wrap gap-2">{rich.tags.map((tag) => <span key={tag} className="badge">{tag}</span>)}</div>
          </section>}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={addProduct} disabled={product.stockQuantity === 0} className="primary-btn py-3.5"><Icon name="cart" size={17} /> Add to cart</button>
            <button onClick={requestQuote} className="secondary-btn py-3.5">Chat with Supplier</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/products?search=${encodeURIComponent(product.supplierName)}`} className="text-sm font-semibold text-primary">See more from this supplier →</Link>
            <button onClick={reportProduct} className="danger-btn px-3 py-2 text-xs">Report Product</button>
          </div>
          <section className="mt-7 rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-bold">Supplier profile</h2>
            <p className="mt-2 text-sm font-semibold text-primary-dark">{product.supplierName}</p>
            <p className="mt-1 text-xs text-muted-ink">{product.supplierGmail}</p>
            {supplier?.phoneOrTelegram && <p className="mt-1 text-xs text-muted-ink">{supplier.phoneOrTelegram}</p>}
            {supplier?.description && <p className="mt-3 text-sm leading-6 text-muted-ink">{supplier.description}</p>}
          </section>
        </div>
      </article>

      {relatedProducts.length > 0 && <section className="mt-12">
        <SectionHeading title="Related products" description="Other wholesale options in the same category." />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {relatedProducts.map((item)=><Link key={item.id} href={`/products/${item.id}`} className="rounded-2xl border border-line bg-surface p-4 hover:border-primary/30 hover:shadow-sm"><p className="text-sm font-semibold text-primary">{item.title}</p><p className="mt-2 text-sm text-muted-ink">{item.category}</p><p className="mt-3 text-lg font-black text-primary">${item.price.toFixed(2)}</p></Link>)}
        </div>
      </section>}
      <section className="mt-12">
        <SectionHeading title="Recent buyer reviews" description="Verified procurement notes from restaurants, retailers, and project teams." />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {reviews.map((review) => <article key={`${review.reviewerName}-${review.reviewDate}`} className="rounded-2xl border border-line bg-surface p-5"><div className="flex items-start gap-3"><img src={review.avatar} alt={review.reviewerName} className="size-11 rounded-full object-cover" /><div><h3 className="font-bold">{review.reviewerName}</h3><p className="text-xs text-muted-ink">★ {review.rating} · {new Date(review.reviewDate).toLocaleDateString()} · {review.verifiedPurchase ? "Verified purchase" : "Trade inquiry"}</p></div></div><p className="mt-3 text-sm leading-6 text-muted-ink">{review.comment}</p>{review.supplierReply&&<p className="mt-3 rounded-xl bg-primary-soft p-3 text-xs leading-5 text-primary">Supplier reply: {review.supplierReply}</p>}</article>)}
        </div>
      </section>
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

function SectionHeading({ title, description }: { title: string; description: string }) {
  return <div className="flex flex-col gap-2"><h2 className="text-2xl font-black tracking-[-.025em] text-primary">{title}</h2><p className="text-sm text-muted-ink">{description}</p></div>;
}
