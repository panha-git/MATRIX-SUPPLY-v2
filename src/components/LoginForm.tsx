"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { homeForRole, useAuth } from "./AuthProvider";
import { Icon } from "./Icon";
import {
  getAccountByGmail,
  isValidGmail,
  type RegistrationProfile,
  type UserRole,
} from "@/lib/localStorage";

const emptyDetails = {
  businessName: "",
  fullName: "",
  phoneNumber: "",
  location: "",
  description: "",
};

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [gmail, setGmail] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [knownRole, setKnownRole] = useState<UserRole | null>(null);
  const [details, setDetails] = useState(emptyDetails);
  const [error, setError] = useState("");

  const inspectAccount = (value: string) => {
    const account = isValidGmail(value) ? getAccountByGmail(value) : null;
    setKnownRole(account?.role ?? null);
    if (account) setRole("");
  };

  const updateDetail = (name: keyof typeof details, value: string) => {
    setDetails((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      let profile: RegistrationProfile | undefined;
      if (!knownRole && role === "supplier") {
        profile = {
          role,
          businessName: details.businessName,
          phoneNumber: details.phoneNumber,
          location: details.location,
          description: details.description,
        };
      } else if (!knownRole && role === "customer") {
        profile = {
          role,
          fullName: details.fullName,
          phoneNumber: details.phoneNumber,
          location: details.location,
        };
      }
      const account = login(gmail, profile);
      router.replace(homeForRole(account.role));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">Local marketplace account</span>
      <h1 className="mt-4 text-3xl font-black tracking-tight">Welcome to MATRIX SUPPLY</h1>
      <p className="mt-2 text-sm leading-6 text-muted-ink">Enter a Gmail address to open its saved local account or register a new supplier or customer.</p>

      <form onSubmit={submit} className="mt-7" noValidate>
        <label className="text-sm font-semibold">Gmail address<input required type="email" value={gmail} onChange={(event) => { setGmail(event.target.value); setError(""); inspectAccount(event.target.value); }} onBlur={(event) => inspectAccount(event.target.value)} placeholder="yourname@gmail.com" autoComplete="email" className="form-control" /></label>

        {knownRole ? (
          <div className="mt-5 rounded-xl border border-primary/20 bg-primary-soft p-4 text-sm text-primary-dark"><strong className="capitalize">Welcome back, {knownRole}.</strong><p className="mt-1 text-xs text-muted-ink">Your saved profile, role, and account ID will be reused.</p></div>
        ) : (
          <>
            <fieldset className="mt-5"><legend className="text-sm font-semibold">Register as</legend><div className="mt-3 grid grid-cols-2 gap-3"><RoleButton active={role === "customer"} label="Customer" detail="Browse supplier products" onClick={() => { setRole("customer"); setError(""); }} /><RoleButton active={role === "supplier"} label="Supplier" detail="Post and manage products" onClick={() => { setRole("supplier"); setError(""); }} /></div></fieldset>

            {role === "customer" && <div className="mt-5 space-y-4 rounded-2xl border border-line p-4"><h2 className="text-sm font-bold">Customer profile</h2><label className="text-sm font-semibold">Full name *<input value={details.fullName} onChange={(event) => updateDetail("fullName", event.target.value)} placeholder="Your full name" className="form-control" /></label><OptionalFields details={details} updateDetail={updateDetail} /></div>}

            {role === "supplier" && <div className="mt-5 space-y-4 rounded-2xl border border-line p-4"><h2 className="text-sm font-bold">Supplier business profile</h2><label className="text-sm font-semibold">Business name *<input value={details.businessName} onChange={(event) => updateDetail("businessName", event.target.value)} placeholder="Your business name" className="form-control" /></label><label className="text-sm font-semibold">Phone number *<input value={details.phoneNumber} onChange={(event) => updateDetail("phoneNumber", event.target.value)} placeholder="e.g. +855 12 345 678" className="form-control" /></label><label className="text-sm font-semibold">Location *<input value={details.location} onChange={(event) => updateDetail("location", event.target.value)} placeholder="City or province" className="form-control" /></label><label className="text-sm font-semibold">About your business<textarea value={details.description} onChange={(event) => updateDetail("description", event.target.value)} placeholder="What does your business supply?" rows={3} className="form-control resize-none py-3" /></label></div>}
          </>
        )}

        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark">Continue <Icon name="arrowRight" size={16} /></button>
      </form>
      <p className="mt-6 text-center text-[11px] leading-5 text-muted-ink">No password, OAuth, API, or database is used. Profiles and products stay in this browser’s localStorage.</p>
    </div>
  );
}

function OptionalFields({ details, updateDetail }: { details: typeof emptyDetails; updateDetail: (name: keyof typeof emptyDetails, value: string) => void }) {
  return <><label className="text-sm font-semibold">Phone number <span className="font-normal text-muted-ink">(optional)</span><input value={details.phoneNumber} onChange={(event) => updateDetail("phoneNumber", event.target.value)} placeholder="Your phone number" className="form-control" /></label><label className="text-sm font-semibold">Location <span className="font-normal text-muted-ink">(optional)</span><input value={details.location} onChange={(event) => updateDetail("location", event.target.value)} placeholder="City or province" className="form-control" /></label></>;
}

function RoleButton({ active, label, detail, onClick }: { active: boolean; label: string; detail: string; onClick: () => void }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`rounded-xl border p-4 text-left ${active ? "border-primary bg-primary-soft ring-2 ring-primary/10" : "border-line hover:border-primary/40"}`}><strong className="block text-sm">{label}</strong><span className="mt-1 block text-xs text-muted-ink">{detail}</span></button>;
}
