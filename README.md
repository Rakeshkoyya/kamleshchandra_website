# kamleshchandra.com — website (UI demo)

The website for **Kamlesh Chandra**: memory and learning educator, creator of *Scientific Retention Management*,
and Director – Academics at SHANA International School, Bikaner.

This is a **front-end demo**. Every workflow (buying books and programs, checkout, registering for events,
learner dashboard, course player, admin studio) has working UI on top of **mock data**, so the backend can be
wired in later without redesigning anything.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Stack: Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4, GSAP (scroll scenes).

## Sitemap

| Area | Routes |
|---|---|
| Story | `/` (home), `/about`, `/contact` (invite KC to your school) |
| Shop | `/programs`, `/programs/[slug]`, `/books`, `/books/[slug]`, `/cart`, `/checkout`, `/checkout/success` |
| Content | `/journal`, `/journal/[slug]`, `/events`, `/events/[slug]` |
| Learners | `/signin` (phone OTP, demo code `123456`), `/account`, `/learn/[slug]` |
| Admin | `/studio` dashboard, `/studio/programs(/new)`, `/studio/books(/new)`, `/studio/journal(/new)`, `/studio/events`, `/studio/orders`, `/studio/learners`, `/studio/settings` |

Demo shortcuts: coupon `RHYTHM10` (10% off), UPI ID `fail@upi` shows the payment-failed path.

## Where the backend plugs in

Search the code for `BACKEND:` — every place that would call an API is marked.

| Concern | Today (demo) | Replace with |
|---|---|---|
| Catalogue, posts, events | `src/lib/data/*.ts` async getters returning arrays | DB/CMS queries with the same return types (`src/lib/types.ts`) |
| Cart | `src/lib/cart/store.ts` (localStorage) | server cart keyed by session cookie; keep the `useCart()` API |
| Checkout & payments | simulated in the checkout flow | create order on the server → payment gateway (e.g. Razorpay) → verify signature server-side → webhook marks order paid |
| Auth | demo OTP | SMS OTP provider + httpOnly session cookie |
| Studio CRUD | local React state | server actions / API routes with admin authorization |
| Forms (contact, RSVP, newsletter) | client-side success state | server action + email/WhatsApp notification, rate limiting |

## Design system

Recorded in [`.ui-craft/design.md`](.ui-craft/design.md): story brief, structure, tokens and rules.
Tokens live in `src/app/globals.css`.

The central idea is **"the rhythm of remembering"**: a forgetting curve that rises with every revisit. It shows up
as the logo mark, the section dividers, the home page's scroll scene, and the learner dashboard's "Today's revisit".

## Content status

- Real facts (roles, numbers, frameworks, press, contacts, mantra) come from the client's profile sheets in
  `docs/` and live in `src/lib/data/site.ts`.
- Programs, books, prices, events, posts and orders are **sample data**, marked in the UI.
- Photos other than the portrait are Creative Commons stand-ins. Credits are in `public/images/CREDITS.md`.
  Replace them with Kamlesh Chandra's own photos before launch.
