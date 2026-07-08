/* eslint-disable @next/next/no-img-element */
import { Icon } from "@/components/Icon";
import { LoginForm } from "@/components/LoginForm";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-primary-dark p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <img
          src="/marketplace-hero.svg"
          alt="Illustrated baskets of fresh local produce"
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a5a34]/85 to-[#0b376f]/75" />
        <div className="relative">
          <Logo inverted />
        </div>
        <div className="relative max-w-xl">
          <h2 className="text-5xl font-black leading-tight tracking-tight">
            One browser. Three demo roles.
          </h2>
          <p className="mt-5 max-w-lg leading-7 text-white/70">
            Guests browse freely, suppliers submit products, and the demo admin
            reviews products and customer requests.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Public marketplace browsing",
              "Supplier product approval workflow",
              "Customer carts and order requests",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <span className="grid size-8 place-items-center rounded-lg bg-white text-primary">
                  <Icon name="check" size={16} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative border-t border-white/30 pt-7 text-sm text-white/65">
          Everything runs locally in your browser. No API, payment system, or
          online database is connected.
        </p>
      </section>
      <section className="flex items-center justify-center px-6 py-20 sm:px-12">
        <div className="absolute left-6 top-6 lg:hidden">
          <Logo />
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
