import Link from "next/link";
import { Icon } from "./Icon";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2"
      aria-label="MATRIX SUPPLY home"
    >
      <span
        className={`grid size-9 place-items-center rounded-xl ${inverted ? "bg-primary" : "bg-primary text-white"}`}
      >
        <Icon name="leaf" size={20} />
      </span>
      <span className="leading-none">
        <span
          className={`block text-[15px] font-extrabold tracking-tight ${inverted ? "text-white" : "text-primary-dark"}`}
        >
          MATRIX
        </span>
        <span className="block text-[10px] font-extrabold tracking-[0.12em] text-accent">
          SUPPLY
        </span>
      </span>
    </Link>
  );
}
