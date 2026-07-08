"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { Logo } from "./Logo";

export function SiteFooter() {
  const { user } = useAuth();
  const links =
    user?.role === "supplier"
      ? [
          ["Dashboard", "/dashboard"],
          ["My Products", "/dashboard#my-products"],
          ["Add Product", "/dashboard#product-form"],
          ["Profile", "/account"],
        ]
      : [
          ["Marketplace", "/products"],
          ["Browse Products", "/products#catalog"],
          ["Supplier Directory", "/suppliers"],
          ["Profile", "/account"],
        ];
  return (
    <footer className="bg-[#151817] text-white">
      <div className="container-shell flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-md text-sm leading-6 text-white/50">
            A local marketplace where registered suppliers publish products for
            customers to discover.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-3">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-white/60 hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container-shell py-5 text-xs text-white/35">
          © 2026 MATRIX SUPPLY · LocalStorage demo only
        </div>
      </div>
    </footer>
  );
}
