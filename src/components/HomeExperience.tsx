"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addToCart, getActiveProducts, getSuppliers, PLATFORM_CHANGED_EVENT, startChat, type Product, type SupplierAccount } from "@/lib/localStorage";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";
import { SectionHeader, VerifiedBadge } from "./ui";
import { useMarketplace } from "./MarketplaceProvider";
import { useRouter } from "next/navigation";

const categories=["Food & Beverage","Agriculture","Electronics","Construction Materials","Office Supplies","Packaging Supplies"];
const spotlightStats=[{label:"Verified suppliers",value:"1.2k+",detail:"active across the network"},{label:"Daily RFQs",value:"3.4k",detail:"from local buyers"},{label:"Lead times",value:"< 48h",detail:"on priority products"}];
const heroHighlights=[{title:"Fast-moving products",detail:"Coffee, rice, packaging, office essentials"},{title:"Live supplier chats",detail:"Response rates remain high after business hours"},{title:"Wholesale-ready stock",detail:"MOQ and shipment details are visible before you contact a seller"}];

export function HomeExperience(){
  const [products,setProducts]=useState<Product[]>([]);
  const [suppliers,setSuppliers]=useState<SupplierAccount[]>([]);
  const {requireCustomer,notify}=useMarketplace();
  const router=useRouter();

  useEffect(()=>{const sync=()=>{setProducts(getActiveProducts());setSuppliers(getSuppliers())};sync();window.addEventListener(PLATFORM_CHANGED_EVENT,sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener(PLATFORM_CHANGED_EVENT,sync);window.removeEventListener("storage",sync)}},[]);

  const featuredProducts=useMemo(()=>products.slice(0,8),[products]);
  const freshProducts=useMemo(()=>[...products].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,8),[products]);
  const supplierHighlights=useMemo(()=>suppliers.slice(0,6),[suppliers]);

  const add=(p:Product)=>requireCustomer(c=>{addToCart(c.id,p);notify("Product added to your cart")});
  const chat=(p:Product)=>requireCustomer(c=>router.push(`/chat?room=${startChat(c,p).id}`));

  return <>
    <section className="overflow-hidden border-b border-line bg-surface">
      <div className="container-shell py-10 lg:py-14">
        <div className="rounded-[32px] border border-line bg-surface p-6 shadow-[0_24px_60px_rgba(17,43,74,.08)] lg:p-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((item)=><span key={item} className="rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[.08em] text-muted-ink">{item}</span>)}
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <VerifiedBadge>NEXXA structured supplier network</VerifiedBadge>
              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-[-.045em] text-primary sm:text-6xl">Move through a structured marketplace of trusted suppliers</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-ink">Browse wholesale products, compare supplier performance, and discover fast-moving goods from verified supplier businesses.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/products" className="primary-btn px-6 py-3.5">Browse marketplace <Icon name="arrowRight" size={16}/></Link>
                <Link href="/suppliers" className="secondary-btn px-6 py-3.5">Explore suppliers</Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {spotlightStats.map((stat)=><div key={stat.label} className="rounded-2xl border border-line bg-surface-muted p-4"><p className="text-[11px] font-semibold uppercase tracking-[.08em] text-muted-ink">{stat.label}</p><strong className="mt-2 block text-xl font-black text-primary">{stat.value}</strong><p className="mt-1 text-sm text-muted-ink">{stat.detail}</p></div>)}
              </div>
            </div>
            <div className="rounded-[28px] border border-line bg-surface-muted p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">Live marketplace pulse</p>
                  <p className="mt-1 text-sm text-muted-ink">Fresh movement from today’s top trade activity</p>
                </div>
                <VerifiedBadge>Live</VerifiedBadge>
              </div>
              <div className="mt-5 grid gap-3">
                {heroHighlights.map((item)=><div key={item.title} className="rounded-2xl border border-line bg-surface p-4 shadow-sm"><p className="text-sm font-bold text-primary">{item.title}</p><p className="mt-1 text-sm leading-6 text-muted-ink">{item.detail}</p></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="container-shell py-10">
      <SectionHeader title="Trending today" description="A mix of high-volume products and reliable suppliers that buyers are exploring now." action={<Link href="/products" className="text-sm font-bold text-primary">View all products →</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {featuredProducts.map((product)=><ProductCard key={product.id} product={product} onAddToCart={add} onRequestQuote={chat} onChat={chat}/>)}
      </div>
    </section>

    <section className="border-y border-line bg-surface">
      <div className="container-shell py-12">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-line bg-surface p-6">
            <SectionHeader title="Popular suppliers right now" description="Businesses that are seeing steady demand from retailers, hotels, and project buyers." />
            <div className="mt-4 grid gap-3">
              {supplierHighlights.map((supplier)=><Link key={supplier.id} href={`/products?search=${encodeURIComponent(supplier.businessName)}`} className="flex items-start justify-between gap-4 rounded-2xl border border-line bg-surface p-4 hover:border-primary/30 hover:shadow-sm">
                <div>
                  <p className="font-bold text-primary">{supplier.businessName}</p>
                  <p className="mt-1 text-sm text-muted-ink">{supplier.businessCategory} · {supplier.location}</p>
                </div>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-[11px] font-bold text-accent">{supplier.trustScore}% trust</span>
              </Link>)}
            </div>
          </div>
          <div className="rounded-[28px] bg-primary p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[.12em] text-emerald-300">Wholesale-ready experience</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-.03em]">Move from discovery to quote in a few clicks</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">Every listing surfaces pricing, MOQ, capacity, and supplier trust details so buyers can make confident decisions without jumping through channels.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[["Fast response","Chat and RFQ flows are built into the experience"],["Verified trust","Profiles are rich enough to feel like real local businesses"]].map(([title,detail])=><div key={title} className="rounded-2xl border border-white/15 bg-surface/10 p-4"><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-white/70">{detail}</p></div>)}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="container-shell py-12">
      <SectionHeader title="Recently added" description="Fresh listings that keep the marketplace feeling active and newly updated." action={<Link href="/products" className="text-sm font-bold text-primary">Browse fresh inventory →</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {freshProducts.map((product)=><ProductCard key={product.id} product={product} onAddToCart={add} onRequestQuote={chat} onChat={chat}/>) }
      </div>
    </section>

    <section className="container-shell pb-16">
      <div className="grid gap-4 rounded-[28px] border border-line bg-surface p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.12em] text-accent">Why buyers stay on the platform</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-.02em] text-primary">A marketplace that feels like a living, active trade hub</h2>
          <p className="mt-3 text-sm leading-7 text-muted-ink">The experience is designed for curiosity, comparison, and repeated exploration so every page pushes the next click.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[["Fast delivery","Priority suppliers are marked with quick dispatch and infrastructure-ready fulfillment"],["Strong discovery","Search, categories and recommendations keep conversations moving forward"],["Reliable sourcing","Detailed supplier profiles reduce friction before a buyer ever chats"],["No dead ends","Every section leads naturally to more products, suppliers, or quotes"]].map(([title,detail])=><div key={title} className="rounded-2xl border border-line bg-surface-muted p-4"><p className="font-semibold text-primary">{title}</p><p className="mt-2 text-sm leading-6 text-muted-ink">{detail}</p></div>)}
        </div>
      </div>
    </section>
  </>;
}
