# NEXXA

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
- Suppliers publish products directly from `/dashboard` and can switch their
  own listings between active and inactive.
- Active supplier listings appear in the public marketplace immediately.
- Customers submit order or quote requests directly to suppliers; no payment is
  collected.
- Demo data seeds automatically in the browser with customer accounts, supplier
  accounts, active products, orders, chats, reviews, notifications, and wishlist
  entries.

Shared demo data is stored in `localStorage`. The current login is stored in
`sessionStorage`, so separate browser tabs can use customer or supplier sessions. No API,
backend, SQL database, Firebase, Supabase, Prisma, Stripe, hosting, or online
sync is included.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
