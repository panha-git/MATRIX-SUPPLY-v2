"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAccountByGmail,
  isValidGmail,
  normalizeGmail,
  type RegistrationProfile,
  type UserRole,
} from "@/lib/localStorage";
import { homeForRole, useAuth } from "./AuthProvider";
import { Icon } from "./Icon";

const emptyDetails = {
  businessName: "",
  fullName: "",
  phoneOrTelegram: "",
  location: "",
  description: "",
};

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [gmail, setGmail] = useState("");
  const [role, setRole] = useState<"customer" | "supplier" | "">("");
  const [knownRole, setKnownRole] = useState<UserRole | null>(null);
  const [details, setDetails] = useState(emptyDetails);
  const [error, setError] = useState("");

  const inspectAccount = (value: string) => {
    if (normalizeGmail(value) === "admin@gmail.com") {
      setKnownRole("admin");
      setRole("");
      return;
    }
    const account = isValidGmail(value) ? getAccountByGmail(value) : null;
    setKnownRole(account?.role ?? null);
    if (account) {
      setRole("");
      if (account.role === "customer") {
        setDetails((current) => ({
          ...current,
          fullName: account.fullName,
          phoneOrTelegram: account.phoneOrTelegram,
        }));
      }
    }
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
      const selectedRole = knownRole ?? role;
      if (selectedRole === "supplier" && !knownRole) {
        profile = {
          role: "supplier",
          businessName: details.businessName,
          phoneOrTelegram: details.phoneOrTelegram,
          location: details.location,
          description: details.description,
        };
      } else if (selectedRole === "customer") {
        profile = {
          role: "customer",
          fullName: details.fullName,
          phoneOrTelegram: details.phoneOrTelegram,
        };
      }
      const account = login(gmail, profile);
      router.replace(homeForRole(account.role));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
    }
  };

  const customerForm = role === "customer" || knownRole === "customer";
  const newSupplierForm = role === "supplier" && !knownRole;

  return (
    <div className="w-full max-w-md">
      <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
        Supplier, customer, or admin demo access
      </span>
      <h1 className="mt-4 text-3xl font-black tracking-tight">
        Open a local account
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-ink">
        Customers can browse as guests. Use this page for saved accounts,
        supplier submissions, or the admin dashboard.
      </p>

      <form onSubmit={submit} className="mt-7" noValidate>
        <label className="text-sm font-semibold">
          Gmail address
          <input
            type="email"
            value={gmail}
            onChange={(event) => {
              setGmail(event.target.value);
              setKnownRole(null);
              setError("");
            }}
            onBlur={(event) => inspectAccount(event.target.value)}
            placeholder="yourname@gmail.com"
            autoComplete="email"
            className="form-control"
          />
        </label>

        {knownRole ? (
          <div className="mt-5 rounded-xl border border-primary/20 bg-primary-soft p-4 text-sm text-primary-dark">
            <strong className="capitalize">Saved {knownRole} account</strong>
            <p className="mt-1 text-xs text-muted-ink">
              {knownRole === "admin"
                ? "Use admin@gmail.com for the fixed demo administrator."
                : "This account will keep its role and saved browser data."}
            </p>
          </div>
        ) : (
          <fieldset className="mt-5">
            <legend className="text-sm font-semibold">Register as</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <RoleButton
                active={role === "customer"}
                label="Customer"
                detail="Cart and requests"
                onClick={() => setRole("customer")}
              />
              <RoleButton
                active={role === "supplier"}
                label="Supplier"
                detail="Submit products"
                onClick={() => setRole("supplier")}
              />
            </div>
          </fieldset>
        )}

        {customerForm && (
          <div className="mt-5 space-y-4 rounded-2xl border border-line p-4">
            <h2 className="text-sm font-bold">Customer details</h2>
            <TextField
              label="Full name *"
              value={details.fullName}
              placeholder="Your full name"
              onChange={(value) => updateDetail("fullName", value)}
            />
            <TextField
              label="Phone or Telegram *"
              value={details.phoneOrTelegram}
              placeholder="+855... or @telegram"
              onChange={(value) => updateDetail("phoneOrTelegram", value)}
            />
          </div>
        )}

        {newSupplierForm && (
          <div className="mt-5 space-y-4 rounded-2xl border border-line p-4">
            <h2 className="text-sm font-bold">Supplier business profile</h2>
            <TextField
              label="Business name *"
              value={details.businessName}
              placeholder="Your business name"
              onChange={(value) => updateDetail("businessName", value)}
            />
            <TextField
              label="Phone or Telegram *"
              value={details.phoneOrTelegram}
              placeholder="+855... or @telegram"
              onChange={(value) => updateDetail("phoneOrTelegram", value)}
            />
            <TextField
              label="Location *"
              value={details.location}
              placeholder="City or province"
              onChange={(value) => updateDetail("location", value)}
            />
            <label className="block text-sm font-semibold">
              About your business
              <textarea
                value={details.description}
                onChange={(event) =>
                  updateDetail("description", event.target.value)
                }
                rows={3}
                className="form-control resize-none py-3"
              />
            </label>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark">
          Continue <Icon name="arrowRight" size={16} />
        </button>
      </form>
      <p className="mt-5 text-center text-xs text-muted-ink">
        Admin demo Gmail: <strong>admin@gmail.com</strong>
      </p>
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="form-control"
      />
    </label>
  );
}

function RoleButton({
  active,
  label,
  detail,
  onClick,
}: {
  active: boolean;
  label: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-xl border p-4 text-left ${
        active
          ? "border-primary bg-primary-soft ring-2 ring-primary/10"
          : "border-line hover:border-primary/40"
      }`}
    >
      <strong className="block text-sm">{label}</strong>
      <span className="mt-1 block text-xs text-muted-ink">{detail}</span>
    </button>
  );
}
