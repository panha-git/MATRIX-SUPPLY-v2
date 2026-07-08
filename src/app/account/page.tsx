"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { PageShell } from "@/components/PageShell";
import { useMarketplace } from "@/components/MarketplaceProvider";
import {
  updateCustomerProfile,
  updateSupplierProfile,
} from "@/lib/localStorage";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { notify } = useMarketplace();
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => ({
    businessName: user?.role === "supplier" ? user.businessName : "",
    fullName: user?.role === "customer" ? user.fullName : "",
    phoneOrTelegram:
      user?.role === "supplier" || user?.role === "customer"
        ? user.phoneOrTelegram
        : "",
    location: user?.role === "supplier" ? user.location : "",
    description: user?.role === "supplier" ? user.description : "",
  }));

  if (!user) return null;
  const displayName =
    user.role === "supplier" ? user.businessName : user.fullName;
  const destination =
    user.role === "supplier"
      ? "/dashboard"
      : user.role === "admin"
        ? "/admin"
        : "/products";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user.role === "admin") return;
    setError("");
    try {
      const updated =
        user.role === "supplier"
          ? updateSupplierProfile(user.id, {
              businessName: form.businessName,
              phoneOrTelegram: form.phoneOrTelegram,
              location: form.location,
              description: form.description,
            })
          : updateCustomerProfile(user.id, {
              fullName: form.fullName,
              phoneOrTelegram: form.phoneOrTelegram,
            });
      if (!updated) throw new Error("Profile could not be updated.");
      notify("Profile updated");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Profile could not be updated.",
      );
    }
  };

  return (
    <PageShell>
      <div className="bg-[#f8faf9]">
        <div className="container-shell page-pad">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-2xl bg-primary text-xl font-bold text-white">
                {displayName.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {user.role}
                </span>
                <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                  {displayName}
                </h1>
                <p className="mt-1 text-sm text-muted-ink">{user.gmail}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-600"
            >
              Logout
            </button>
          </div>

          <section className="surface-card mt-8 p-6">
            {user.role === "admin" ? (
              <div>
                <h2 className="text-xl font-bold">Demo administrator</h2>
                <p className="mt-2 text-sm leading-6 text-muted-ink">
                  This fixed local account reviews product submissions and
                  customer requests. It has no password because this is a
                  browser-only course demo.
                </p>
                <Link
                  href="/admin"
                  className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
                >
                  Open admin dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="text-xl font-bold">
                    {user.role === "supplier"
                      ? "Supplier profile"
                      : "Customer profile"}
                  </h2>
                  <p className="mt-2 text-sm text-muted-ink">
                    Update the contact information saved in this browser.
                  </p>
                </div>
                {user.role === "supplier" ? (
                  <>
                    <Field label="Business name *">
                      <input
                        value={form.businessName}
                        onChange={(event) =>
                          setForm({ ...form, businessName: event.target.value })
                        }
                        className="form-control"
                      />
                    </Field>
                    <Field label="Phone or Telegram *">
                      <input
                        value={form.phoneOrTelegram}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            phoneOrTelegram: event.target.value,
                          })
                        }
                        className="form-control"
                      />
                    </Field>
                    <Field label="Location *">
                      <input
                        value={form.location}
                        onChange={(event) =>
                          setForm({ ...form, location: event.target.value })
                        }
                        className="form-control"
                      />
                    </Field>
                    <Field label="About your business">
                      <textarea
                        rows={4}
                        value={form.description}
                        onChange={(event) =>
                          setForm({ ...form, description: event.target.value })
                        }
                        className="form-control resize-none py-3"
                      />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Full name *">
                      <input
                        value={form.fullName}
                        onChange={(event) =>
                          setForm({ ...form, fullName: event.target.value })
                        }
                        className="form-control"
                      />
                    </Field>
                    <Field label="Phone or Telegram *">
                      <input
                        value={form.phoneOrTelegram}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            phoneOrTelegram: event.target.value,
                          })
                        }
                        className="form-control"
                      />
                    </Field>
                  </>
                )}
                <Info label="Gmail" value={user.gmail} />
                <Info label="Account ID" value={user.id} />
                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
                    {error}
                  </p>
                )}
                <button className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white sm:col-span-2">
                  Save profile
                </button>
              </form>
            )}
            <Link
              href={destination}
              className="mt-5 inline-flex text-sm font-bold text-primary"
            >
              Return to {user.role === "customer" ? "marketplace" : "dashboard"}{" "}
              →
            </Link>
          </section>
        </div>
      </div>
    </PageShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-muted-ink">{label}</span>
      <p className="mt-2 min-h-12 break-all rounded-xl border border-line bg-[#f8faf9] px-4 py-3 text-sm">
        {value}
      </p>
    </div>
  );
}
