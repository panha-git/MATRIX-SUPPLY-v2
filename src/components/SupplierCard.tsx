import type { SupplierAccount } from "@/lib/localStorage";
import { Icon } from "./Icon";

export function SupplierCard({
  supplier,
  productCount,
}: {
  supplier: SupplierAccount;
  productCount: number;
}) {
  return (
    <article className="surface-card flex h-full flex-col p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
          <Icon name="store" size={22} />
        </span>
        <div className="min-w-0">
          <h3 className="font-bold">{supplier.businessName}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-ink">
            <Icon name="mapPin" size={12} />
            {supplier.location || "Location not provided"}
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-ink">
        {supplier.description ||
          "This supplier has not added a business description yet."}
      </p>
      <div className="mt-auto border-t border-line pt-4 text-xs text-muted-ink">
        <strong className="text-primary">{productCount}</strong> approved{" "}
        {productCount === 1 ? "product" : "products"} · {supplier.gmail}
      </div>
    </article>
  );
}
