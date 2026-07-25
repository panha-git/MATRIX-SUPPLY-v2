import Link from "next/link";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2.5"
      aria-label="NEXXA home"
    >
      <span className="grid size-10 place-items-center">
        <svg viewBox="0 0 48 48" aria-hidden="true" className="size-10">
          <path
            d="M24 3.5 41.8 13.8v20.4L24 44.5 6.2 34.2V13.8Z"
            fill="none"
            stroke={inverted ? "#ffffff" : "#2563eb"}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M15.2 30.8V16.5L32.8 27.7V17.2"
            fill="none"
            stroke={inverted ? "#ffffff" : "#2563eb"}
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.2 17.1 32.8 28.3"
            fill="none"
            stroke={inverted ? "#ffffff" : "#0f172a"}
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity={inverted ? 0.45 : 0.18}
          />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`block text-[17px] font-black tracking-[0.28em] ${inverted ? "text-white" : "text-primary-dark"}`}
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
