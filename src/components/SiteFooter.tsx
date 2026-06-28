import Link from "next/link";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const groups = [
  { title: "Products", links: [["Fresh Produce", "/products"], ["Meat & Seafood", "/products"], ["Dairy & Eggs", "/products"], ["Beverages", "/products"], ["Dry Goods", "/products"]] },
  { title: "Marketplace", links: [["All Suppliers", "/suppliers"], ["Promotions", "/promotions"], ["New Arrivals", "/products"], ["Best Sellers", "/products"]] },
  { title: "Support", links: [["Help Center", "/support"], ["Contact Us", "/support"], ["FAQs", "/support"], ["Track Order", "/orders"]] },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#151817] text-white">
      <div className="container-shell py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.15fr_.8fr_.8fr_.8fr_1.1fr]">
          <div>
            <Logo inverted />
            <p className="mt-5 max-w-[250px] text-sm leading-6 text-white/50">Fresh food and beverages from trusted suppliers, delivered across Cambodia.</p>
            <div className="mt-5 flex gap-2">
              {["f", "◎", "𝕏"].map((item) => <span key={item} className="grid size-9 place-items-center rounded-lg bg-white/10 text-sm text-white/70">{item}</span>)}
            </div>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map(([label, href]) => <li key={label}><Link href={href} className="text-sm text-white/50 hover:text-white">{label}</Link></li>)}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              <li className="flex gap-2"><Icon name="mapPin" size={16} />Phnom Penh, Cambodia</li>
              <li>+855 23 123 456</li>
              <li>support@suppymatrix.kh</li>
            </ul>
            <p className="mt-5 text-xs text-white/40">Accepted payments</p>
            <div className="mt-2 flex gap-2 text-[10px] font-bold">
              {['KHQR', 'ABA', 'WING'].map((item) => <span key={item} className="rounded bg-white px-2.5 py-1.5 text-[#1b211c]">{item}</span>)}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 SUPPY-MATRIX. All rights reserved.</span>
          <div className="flex gap-5"><span>Privacy Policy</span><span>Terms of Service</span><span>Cookies</span></div>
        </div>
      </div>
    </footer>
  );
}
