import { Icon } from "./Icon";

export type Supplier = { name: string; type: string; location: string; rating: number; reviews: number; tags: string[] };

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <article className="surface-card flex h-full flex-col p-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><Icon name="store" size={22} /></div>
        <div className="min-w-0"><h3 className="truncate font-bold">{supplier.name} <span className="text-primary">●</span></h3><p className="text-sm text-muted-ink">{supplier.type}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-ink"><Icon name="mapPin" size={12} />{supplier.location}</p></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">{supplier.tags.map((tag) => <span key={tag} className="rounded-md bg-[#f3f5f3] px-2 py-1 text-[10px] text-muted-ink">{tag}</span>)}</div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm"><span className="flex items-center gap-1 font-semibold"><Icon name="star" size={14} className="text-[#d89210]" fill="currentColor" />{supplier.rating} <span className="font-normal text-muted-ink">({supplier.reviews})</span></span><button className="flex items-center gap-1 font-semibold text-primary">View <Icon name="arrowRight" size={14} /></button></div>
    </article>
  );
}
