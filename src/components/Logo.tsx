import Link from "next/link";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-3"
      aria-label="NEXXA home"
    >
      <span className={`grid size-10 place-items-center rounded-xl ${inverted ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-primary-soft text-primary"}`}>
        <svg viewBox="0 0 48 48" aria-hidden="true" className="size-8">
          <path
            d="M24 4.8 40.7 14.4v19.2L24 43.2 7.3 33.6V14.4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M16 31.2V16.8l16 10.3V16.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 17.2 32 27.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity={0.22}
          />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`block text-[17px] font-black tracking-[0.26em] ${inverted ? "text-white" : "text-foreground"}`}
        >
          NEXXA
        </span>
        <span className="block text-[9px] font-extrabold tracking-[0.16em] text-primary">
          STRUCTURED TRADE
        </span>
      </span>
    </Link>
  );
}
