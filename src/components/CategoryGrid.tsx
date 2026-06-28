import Link from "next/link";
import { categories } from "@/lib/data";
import { Icon } from "./Icon";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {categories.map((category, index) => (
        <Link key={category.name} href={`/products?category=${encodeURIComponent(category.name)}`} className="group rounded-2xl border border-line bg-white p-4 text-center hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          <span className={`mx-auto grid size-11 place-items-center rounded-xl ${["bg-emerald-50 text-emerald-700", "bg-rose-50 text-rose-600", "bg-amber-50 text-amber-700", "bg-orange-50 text-orange-700"][index % 4]}`}><Icon name={category.icon} size={21} /></span>
          <strong className="mt-3 block text-xs leading-4">{category.name}</strong>
          <span className="mt-1 block text-[10px] text-muted-ink">{category.detail}</span>
        </Link>
      ))}
    </div>
  );
}
