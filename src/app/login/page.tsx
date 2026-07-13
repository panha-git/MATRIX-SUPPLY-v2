/* eslint-disable @next/next/no-img-element */
import { Icon } from "@/components/Icon";
import { LoginForm } from "@/components/LoginForm";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-primary p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <img
          src="/marketplace-hero.svg"
          alt="Illustrated baskets of fresh local produce"
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-primary/90" />
        <div className="relative">
          <Logo inverted />
        </div>
        <div className="relative max-w-xl">
          <h2 className="text-5xl font-black leading-tight tracking-tight">
            Built for trusted Cambodian trade.
          </h2>
          <p className="mt-5 max-w-lg leading-7 text-white/70">
            Guests browse freely. Verified customers order and chat, while
            verified suppliers manage products and fulfillment directly.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Public marketplace browsing",
              "Verified supplier product listings",
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
