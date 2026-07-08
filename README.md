# MATRIX SUPPLY

A browser-only supplier marketplace demo built with Next.js App Router, React,
TypeScript, Tailwind CSS, `localStorage`, and `sessionStorage`.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo workflow

- Guests can open the home page, marketplace, supplier directory, product
  details, and search/filter controls without an account.
- Add to Cart and Request Quote open a customer login/register modal. After a
  successful login, the original action continues automatically.
- Customer accounts require Gmail, full name, and phone or Telegram. Their cart
  is saved by customer ID and survives logout and refresh.
- Suppliers submit products from `/dashboard`. New and edited products remain
  pending until an admin approves them.
- Only approved products appear in the public marketplace.
- Customers submit order or quote requests; no payment is collected.
- The admin reviews product submissions and customer requests at `/admin`.

Admin demo login: `admin@gmail.com`

Use **Seed Demo Data** in the admin dashboard to load two suppliers, three
approved products, one pending product, one customer, and one order request.
Use **Reset Demo Data** to remove MATRIX SUPPLY demo records from the browser.

Shared demo data is stored in `localStorage`. The current login is stored in
`sessionStorage`, so separate browser tabs can use different roles. No API,
backend, SQL database, Firebase, Supabase, Prisma, Stripe, hosting, or online
sync is included.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
