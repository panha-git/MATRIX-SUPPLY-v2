# MATRIX SUPPLY

A localhost-only supplier marketplace built with Next.js App Router, React, TypeScript, Tailwind CSS, and browser `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js, normally `http://localhost:3000`.

## Business model

- Suppliers create a business profile and publish products from their private dashboard.
- Customers create a buyer profile and browse active products from all registered suppliers.
- Supplier products include price, unit, stock, location, category, and active/inactive status.
- Suppliers can edit, delete, activate, or deactivate only their own products.
- Customers can search and filter active listings and open product details with supplier information.
- Accounts, profiles, products, and the current session are stored only in this browser.
- Logout removes only the current session; saved accounts and products remain after refresh.

Accounts created by the earlier demo with the `seller` role are migrated locally to `supplier` when read. No seeded products or fake marketplace statistics are included.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

No API routes, backend, database, cloud authentication, or hosting integration is used.
