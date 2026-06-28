import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { orders } from "@/lib/data";

export default function OrdersPage() {
  return (
    <PageShell>
      <div className="bg-[#f8faf9]">
        <div className="container-shell page-pad">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm text-muted-ink">Home <span className="mx-2">›</span> My orders</p><h1 className="mt-3 text-4xl font-black tracking-tight">My orders</h1><p className="mt-2 text-sm text-muted-ink">Track, review, and manage your order history.</p></div><button className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold">↓ Export history</button></div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">{[["package", "6", "Total orders"], ["creditCard", "$168.20", "Total spent"], ["truck", "2", "In progress"], ["box", "3", "Delivered"]].map(([icon, value, label], index) => <div key={label} className="surface-card flex items-center gap-4 p-5"><span className={`grid size-11 shrink-0 place-items-center rounded-xl ${index === 1 ? "bg-orange-50 text-accent" : "bg-primary-soft text-primary"}`}><Icon name={icon as "package"} /></span><div><strong className="block text-xl">{value}</strong><span className="text-xs text-muted-ink">{label}</span></div></div>)}</div>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 hide-scrollbar">{["All", "Pending", "Confirmed", "Shipped", "Delivered"].map((item, index) => <button key={item} className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium ${index === 0 ? "bg-primary text-white" : "border border-line bg-white text-muted-ink"}`}>{item}</button>)}</div>
          <div className="mt-4 overflow-hidden rounded-[20px] border border-line bg-white">
            <div className="hidden grid-cols-[1.8fr_.9fr_.9fr_.8fr_1fr_.8fr] bg-[#f6f8f7] px-5 py-4 text-[11px] font-bold uppercase tracking-wide text-muted-ink md:grid"><span>Order</span><span>Date</span><span>Status</span><span>Total</span><span>Delivery</span><span className="text-right">Actions</span></div>
            {orders.map((order) => <div key={order.id} className="grid gap-4 border-t border-line p-5 first:border-0 md:grid-cols-[1.8fr_.9fr_.9fr_.8fr_1fr_.8fr] md:items-center"><div><strong className="text-sm">{order.id}</strong><p className="mt-1 text-xs text-muted-ink">{order.items} items · KHQR</p></div><div className="text-sm"><span className="mr-2 text-xs text-muted-ink md:hidden">Date:</span>{order.date}</div><div><Status status={order.status} /><p className="mt-1 text-[10px] text-primary">Paid</p></div><div><strong className="text-sm">${order.total.toFixed(2)}</strong><p className="text-[10px] text-muted-ink">៛ {(order.total * 4100).toLocaleString()}</p></div><div className="text-sm text-muted-ink">{order.delivery}</div><div className="flex justify-end gap-3"><button className="text-sm font-semibold text-primary">View →</button>{order.status === "Delivered" && <button className="rounded-lg border border-line px-3 py-2 text-xs">Reorder</button>}</div></div>)}
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-[22px] bg-[#dff8e8] p-7 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-xl bg-primary text-white"><Icon name="refresh" /></span><div><h2 className="font-bold">Easy reordering</h2><p className="text-sm text-muted-ink">Get your favourite items again with one click.</p></div></div><Link href="/products" className="rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white">Browse products</Link></div>
        </div>
      </div>
    </PageShell>
  );
}

function Status({ status }: { status: string }) { const color = status === "Shipped" ? "bg-blue-50 text-blue-700" : status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-primary-soft text-primary"; return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${color}`}>{status}</span>; }
