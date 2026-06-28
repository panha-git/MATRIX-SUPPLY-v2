/* eslint-disable @next/next/no-img-element */
import { Icon } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { imageUrl, products } from "@/lib/data";

export default function PromotionsPage() {
  return (
    <PageShell>
      <section className="bg-primary-soft py-10"><div className="container-shell flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="text-sm text-muted-ink">Home <span className="mx-2">›</span> Promotions</p><h1 className="mt-3 text-4xl font-black tracking-tight">Deals & promotions</h1><p className="mt-2 text-sm text-muted-ink">Exclusive discounts, flash sales, and multi-buy offers—updated weekly.</p></div><div className="flex flex-wrap gap-2">{["All deals", "Flash sales", "Weekly deals", "Multi-buy", "Clearance"].map((item, index) => <button key={item} className={`rounded-full px-4 py-2 text-xs font-semibold ${index === 0 ? "bg-accent text-white" : "border border-line bg-white text-muted-ink"}`}>{item}</button>)}</div></div></section>
      <div className="container-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="relative min-h-[300px] overflow-hidden rounded-[24px] bg-accent p-8 text-white sm:p-10"><img src={imageUrl("grand sale fresh market tomatoes produce orange red vibrant", "16:7")} alt="Fresh produce flash sale" className="absolute inset-0 size-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-r from-[#b53d0b]/90 to-transparent" /><div className="relative max-w-lg"><span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-accent">Flash sale · Today only</span><h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">Up to 40% off<br />fresh produce</h2><p className="mt-3 text-sm text-white/80">Limited stock from GreenFarm Cambodia.</p><button className="mt-6 flex items-center gap-1 rounded-xl bg-white px-5 py-3 text-xs font-bold text-accent">Shop flash sale <Icon name="arrowRight" size={14} /></button></div></div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-1"><MiniPromo image={imageUrl("premium cambodian coffee beans green background", "16:7")} title="Free shipping on coffee & teas" /><MiniPromo image={imageUrl("tropical dragon fruit purple colorful arrangement", "16:7")} title="Tropical fruit bundles from $8" /></div>
        </div>
        <DealSection title="Flash deals" note="Today only" products={products.slice(0, 4)} />
        <DealSection title="Weekly deals" note="Refreshed every Monday" products={products.slice(4, 8)} />
        <DealSection title="Clearance" note="Up to 30% off" products={products.slice(8, 12)} />
        <section className="mt-14 flex flex-col items-start justify-between gap-5 rounded-[22px] bg-[#dff8e8] p-7 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-xl bg-primary text-white"><Icon name="sparkles" /></span><div><h2 className="font-bold">Never miss a deal</h2><p className="text-sm text-muted-ink">Get flash sale alerts and exclusive offers.</p></div></div><form className="flex w-full max-w-md gap-2"><input type="email" placeholder="Your email address" className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 text-sm outline-none" /><button className="rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white">Subscribe</button></form></section>
      </div>
    </PageShell>
  );
}

function MiniPromo({ image, title }: { image: string; title: string }) { return <div className="relative min-h-[140px] overflow-hidden rounded-[22px] bg-primary-dark p-6 text-white"><img src={image} alt="" className="absolute inset-0 size-full object-cover opacity-60" /><span className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-transparent" /><div className="relative flex h-full max-w-xs flex-col justify-end"><h3 className="font-bold">{title}</h3><span className="mt-2 text-xs underline">Shop now</span></div></div>; }

function DealSection({ title, note, products: items }: { title: string; note: string; products: typeof products }) { return <section className="mt-14"><div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-3"><span className="h-6 w-1 rounded-full bg-accent"/><h2 className="text-xl font-bold">{title}</h2><span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-semibold text-accent">{note}</span></div><button className="text-xs font-semibold text-primary">View all →</button></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{items.map((product) => <ProductCard key={`${title}-${product.id}`} product={product} />)}</div></section>; }
