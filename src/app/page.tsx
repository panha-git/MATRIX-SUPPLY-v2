import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <section className="soft-grid overflow-hidden bg-primary-soft">
        <div className="container-shell grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
          <div>
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-primary shadow-sm">
              Local supplier marketplace demo
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Find local supplies. Request what your business needs.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-ink sm:text-lg">
              Browse approved products without an account. Sign in only when you
              add to cart, request a quote, or submit an order request.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white"
              >
                Browse marketplace <Icon name="arrowRight" size={16} />
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-primary/20 bg-white px-6 py-3.5 text-sm font-bold text-primary"
              >
                Supplier or admin login
              </Link>
            </div>
          </div>
          <div className="surface-card p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              How the demo works
            </p>
            <div className="mt-5 space-y-5">
              <Step
                icon="store"
                title="Suppliers submit"
                detail="Product requests stay pending until an admin reviews them."
              />
              <Step
                icon="shield"
                title="Admin approves"
                detail="Only approved products appear in the public marketplace."
              />
              <Step
                icon="cart"
                title="Customers request"
                detail="Customers use a saved cart and submit a request, never a payment."
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container-shell py-14">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          <strong>Demo Mode:</strong> Data is saved in this browser only.
          Different computers will not sync until a real database/API is added.
        </div>
      </section>
    </PageShell>
  );
}

function Step({
  icon,
  title,
  detail,
}: {
  icon: "store" | "shield" | "cart";
  title: string;
  detail: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
        <Icon name={icon} />
      </span>
      <div>
        <h2 className="font-bold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-ink">{detail}</p>
      </div>
    </div>
  );
}
