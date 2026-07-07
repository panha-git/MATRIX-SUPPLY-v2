"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/components/AuthProvider";
import { Icon } from "@/components/Icon";
import { useMarketplace } from "@/components/MarketplaceProvider";
import { updateCustomerProfile, updateSupplierProfile } from "@/lib/localStorage";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { notify } = useMarketplace();
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => user?.role === "supplier" ? { businessName: user.businessName, fullName: "", phoneNumber: user.phoneNumber, location: user.location, description: user.description } : { businessName: "", fullName: user?.fullName ?? "", phoneNumber: user?.phoneNumber ?? "", location: user?.location ?? "", description: "" });
  if (!user) return null;

  const name = user.role === "supplier" ? user.businessName : user.fullName;
  const initials = name.slice(0, 2).toUpperCase();
  const destination = user.role === "supplier" ? "/dashboard" : "/products";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      const updated = user.role === "supplier"
        ? updateSupplierProfile(user.id, { businessName: form.businessName, phoneNumber: form.phoneNumber, location: form.location, description: form.description })
        : updateCustomerProfile(user.id, { fullName: form.fullName, phoneNumber: form.phoneNumber, location: form.location });
      if (!updated) throw new Error("Profile could not be updated.");
      notify("Profile updated");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Profile could not be updated.");
    }
  };

  return <PageShell><div className="bg-[#f8faf9]"><div className="container-shell page-pad">
    <p className="text-sm text-muted-ink">Home <span className="mx-2">›</span> Profile</p>
    <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><span className="grid size-16 place-items-center rounded-2xl bg-primary text-xl font-bold text-white">{initials}</span><div><span className="rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">{user.role}</span><h1 className="mt-2 text-2xl font-black sm:text-3xl">{name}</h1><p className="mt-1 text-sm text-muted-ink">{user.gmail}</p></div></div><button onClick={logout} className="rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-600">Logout</button></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]"><aside className="surface-card h-fit p-3"><div className="flex items-center gap-3 rounded-xl bg-primary-soft px-4 py-3 text-sm font-medium text-primary"><Icon name="user" size={18}/>Profile</div><Link href={destination} className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-ink hover:bg-[#f6f8f7]"><Icon name={user.role === "supplier" ? "store" : "grid"} size={18}/>{user.role === "supplier" ? "Supplier dashboard" : "Marketplace"}</Link></aside>
      <section className="surface-card p-6"><h2 className="text-xl font-bold">{user.role === "supplier" ? "Supplier profile" : "Customer profile"}</h2><p className="mt-2 text-sm text-muted-ink">Update the information shown in your local marketplace account.</p><form onSubmit={submit} className="mt-6 grid gap-5 sm:grid-cols-2" noValidate>
        {user.role === "supplier" ? <><Field label="Business name *"><input value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} className="form-control"/></Field><Field label="Phone number *"><input value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} className="form-control"/></Field><Field label="Location *"><input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="form-control"/></Field><Field label="About your business"><textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="form-control resize-none py-3"/></Field></> : <><Field label="Full name *"><input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className="form-control"/></Field><Field label="Phone number (optional)"><input value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} className="form-control"/></Field><Field label="Location (optional)"><input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="form-control"/></Field></>}
        <Info label="Gmail" value={user.gmail}/><Info label="Account ID" value={user.id}/><Info label="Created" value={new Date(user.createdAt).toLocaleString()}/>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">{error}</p>}<button className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white sm:col-span-2">Save profile</button>
      </form></section>
    </div>
  </div></div></PageShell>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-semibold">{label}{children}</label>; }
function Info({ label, value }: { label: string; value: string }) { return <div><span className="text-xs font-medium text-muted-ink">{label}</span><p className="mt-2 min-h-12 break-all rounded-xl border border-line bg-[#f8faf9] px-4 py-3 text-sm">{value}</p></div>; }
