/* eslint-disable @next/next/no-img-element */
import { Icon } from "@/components/Icon";
import { LoginForm } from "@/components/LoginForm";
import { Logo } from "@/components/Logo";

const stats = [
  ["2.4k+", "verified suppliers"],
  ["18k+", "monthly RFQs"],
  ["94%", "repeat buyers"],
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden border-r border-line bg-surface p-10 lg:flex lg:flex-col">
          <Logo />

          <div className="flex flex-1 items-center">
            <div className="max-w-xl">
              <span className="eyebrow">NEXXA Access</span>
              <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-tight text-foreground">
                Structured trade, cleaner supplier decisions.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-muted-ink">
                A focused B2B workspace for verified customers and suppliers to discover products, request quotes, and manage procurement conversations.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-3">
                {stats.map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-line bg-surface-muted p-4">
                    <strong className="block text-2xl font-black text-primary">{value}</strong>
                    <span className="mt-1 block text-xs font-semibold text-muted-ink">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-3xl border border-line bg-background p-5 shadow-sm">
                <div className="relative h-64 overflow-hidden rounded-2xl bg-surface-muted">
                  <img src="/marketplace-hero.svg" alt="NEXXA marketplace preview" className="size-full object-cover opacity-90" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {["Verified accounts", "Private RFQ chat", "Supplier inventory"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs font-bold text-muted-ink">
                      <span className="grid size-7 place-items-center rounded-lg bg-primary-soft text-primary">
                        <Icon name="check" size={14} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs leading-5 text-muted-ink">Local demo mode. No payment processor, API, or external database is connected.</p>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-4 py-16 sm:px-8">
          <div className="absolute left-5 top-5 lg:hidden">
            <Logo />
          </div>
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
