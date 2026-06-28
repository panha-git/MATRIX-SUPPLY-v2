import Link from "next/link";
import { Icon } from "./Icon";

export function SectionHeading({ title, eyebrow, href, linkLabel = "View all" }: { title: string; eyebrow?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-5">
      <div><h2 className="text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h2>{eyebrow && <p className="mt-1 text-sm text-muted-ink">{eyebrow}</p>}</div>
      {href && <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark">{linkLabel}<Icon name="arrowRight" size={15} /></Link>}
    </div>
  );
}
