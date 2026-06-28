import Link from "next/link";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Icon } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SupplierCard } from "@/components/SupplierCard";
import { imageUrl, products, suppliers } from "@/lib/data";

const trustItems = [
  ["truck", "Next-day delivery", "Phnom Penh & Siem Reap"],
  ["shield", "Verified suppliers", "Quality guaranteed"],
  ["refresh", "Easy returns", "7-day return policy"],
  ["headset", "Live support", "Mon–Sat, 7AM–9PM"],
  ["creditCard", "KHQR payments", "Safe & convenient"],
] as const;

export default function HomePage() {
  const hero = imageUrl("lush colorful cambodian street market fresh produce vegetables fruits overhead shot vibrant", "16:7");

  return (
    <PageShell>
      <section className="bg-[#f4fbf6] py-8 sm:py-10">
        <div className="container-shell grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(270px,1fr)]">
          <div className="relative min-h-[460px] overflow-hidden rounded-[26px] bg-primary-dark p-7 text-white sm:p-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero} alt="Fresh produce at a Cambodian market" className="absolute inset-0 size-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#082f1e]/95 via-[#0e4d2b]/70 to-transparent" />
            <div className="relative z-10 flex h-full max-w-[620px] flex-col justify-center">
              <div className="mb-5 flex flex-wrap items-center gap-3"><span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold">Grand opening sale</span><span className="text-xs text-white/65">Limited time offer</span></div>
              <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-6xl">Fresh food.<br />Better sourcing.</h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/75">Shop fresh produce, quality meats, and local beverages from verified Cambodian suppliers.</p>
              <form action="/products" className="mt-7 flex max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 text-[#172019] shadow-2xl sm:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-2 px-3"><Icon name="search" size={18} className="text-muted-ink" /><input name="search" placeholder="Search products or brands..." className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" /></div>
                <button className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-[#d95613]">Search</button>
              </form>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/60"><span>Popular:</span>{["Organic", "Rice", "Coffee", "Seafood"].map((item) => <Link key={item} href={`/products?search=${item}`} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-white/85 hover:bg-white/20">{item}</Link>)}</div>
            </div>
          </div>
          <div className="grid min-h-[300px] grid-cols-2 gap-5 lg:grid-cols-1">
            <PromoTile image={imageUrl("colorful fresh tropical fruits mango rambutan dragon fruit arrangement cambodia")} title="Tropical picks" kicker="30% off" />
            <PromoTile image={imageUrl("artisan coffee beans tea leaves ceramic cups styled flat lay warm tones")} title="Local coffee" kicker="Free shipping" />
          </div>
        </div>
      </section>

      <section className="border-b border-primary/10 bg-primary-soft py-5">
        <div className="container-shell grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {trustItems.map(([icon, title, detail]) => <div key={title} className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-primary"><Icon name={icon} size={18} /></span><span><strong className="block text-xs">{title}</strong><span className="text-[10px] text-muted-ink">{detail}</span></span></div>)}
        </div>
      </section>

      <section className="container-shell page-pad">
        <SectionHeading title="Shop by category" href="/products" linkLabel="View all categories" />
        <CategoryGrid />
      </section>

      <section className="container-shell pb-16">
        <div className="grid gap-5 md:grid-cols-2">
          <WidePromo image={imageUrl("fresh colorful vegetables overhead flat lay cambodian market vibrant green", "16:7")} badge="Weekend deal" title="40% off fresh vegetables" action="Shop now" />
          <WidePromo image={imageUrl("premium coffee beans and brewing equipment flat lay artisan", "16:7")} badge="New arrivals" title="Kampot coffee & teas" action="Explore" />
        </div>
      </section>

      <section className="bg-[#f7f9f7] py-16">
        <div className="container-shell">
          <SectionHeading title="Featured products" eyebrow="Hand-picked fresh arrivals and bestsellers" href="/products" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="container-shell py-16">
        <SectionHeading title="Top suppliers" eyebrow="Trusted and verified local Cambodian suppliers" href="/suppliers" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{suppliers.slice(0, 4).map((supplier) => <SupplierCard key={supplier.name} supplier={supplier} />)}</div>
      </section>

      <section className="container-shell pb-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[24px] bg-[#dff8e8] p-7 sm:flex-row sm:items-center sm:p-9">
          <div className="flex items-center gap-5"><span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-white"><Icon name="cart" size={25} /></span><div><h2 className="text-xl font-bold">Get the SUPPY-MATRIX app</h2><p className="mt-1 text-sm text-muted-ink">Order on the go, track deliveries, and get app-only deals.</p></div></div>
          <div className="flex gap-3"><button className="rounded-xl bg-[#181b19] px-5 py-3 text-xs font-bold text-white"> App Store</button><button className="rounded-xl bg-[#181b19] px-5 py-3 text-xs font-bold text-white">▷ Google Play</button></div>
        </div>
      </section>
    </PageShell>
  );
}

function PromoTile({ image, title, kicker }: { image: string; title: string; kicker: string }) {
  return (
    <Link href="/promotions" className="group relative min-h-[170px] overflow-hidden rounded-[22px] bg-primary-dark p-6 text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="absolute inset-0 size-full object-cover opacity-65 transition duration-500 group-hover:scale-105" />
      <span className="absolute inset-0 bg-gradient-to-t from-[#082f1e]/90 to-transparent" />
      <span className="relative flex h-full flex-col justify-end"><span className="text-lg font-bold">{title}</span><span className="text-sm text-white/80">{kicker}</span><span className="mt-3 flex items-center gap-1 text-xs font-semibold">Shop now <Icon name="arrowRight" size={14} /></span></span>
    </Link>
  );
}

function WidePromo({ image, badge, title, action }: { image: string; badge: string; title: string; action: string }) {
  return (
    <div className="relative min-h-[220px] overflow-hidden rounded-[24px] bg-primary-dark p-7 text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="absolute inset-0 size-full object-cover opacity-65" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a3c25]/95 via-[#0a3c25]/50 to-transparent" />
      <div className="relative flex h-full max-w-sm flex-col justify-center"><span className="w-fit rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wide">{badge}</span><h3 className="mt-4 text-2xl font-bold capitalize sm:text-3xl">{title}</h3><Link href="/promotions" className="mt-5 flex w-fit items-center gap-1 rounded-lg bg-accent px-4 py-2.5 text-xs font-bold">{action}<Icon name="arrowRight" size={14} /></Link></div>
    </div>
  );
}
