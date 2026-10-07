# Kamlesh Chandra — design memory

Settled decisions. Extend them; don't "fix" them in reviews.

## Story (inferred from client docs in /docs, 2026-10-07)

```
STORY BRIEF — Kamlesh Chandra
Vision (his voice): "Your brain is worth ten trillion dollars. Let me show you how to keep what you learn."
Origin:          Two decades as an educator; 15+ years as Director – Academics at SHANA International
                 (Bikaner) — "Most Innovative School of India". Built schools "like gardens".
Tension:         Learning treated as a race — cramming, re-reading, forgetting by Thursday; fear instead of freedom.
Transformation:  Learners who forget → learners who keep what they learn and believe in their own minds;
                 parents as partners; teachers as "artists of awakening".
Proof on hand:   20+ yrs · 3,000+ sessions · 3,000+ educators · 10,00,000 learners · featured in The Teacher
                 (Australia), Brainfeed, Consilience USA · SRM + QLM frameworks · portrait photo.
Voice:           warm, affirming, learned — never salesy or hype-y.
Angle:           The Guide (from brief)
Central metaphor: "the rhythm of remembering" — the forgetting curve lifted by each spaced revisit
                 (his Scientific Retention Management), echoing SHANA's "learning is not a race but a rhythm".
Motion language: organic — slow swells that grow from a root; sine easing.
```

## Structure

Sitemap (nav labels stay plain): `/` · `/about` · `/programs` · `/programs/[slug]` · `/books` · `/books/[slug]` ·
`/events` · `/events/[slug]` · `/journal` · `/journal/[slug]` · `/contact` · `/cart` · `/checkout` ·
`/checkout/success` · `/signin` · `/account` · `/learn/[slug]` · `/studio/*` (admin demo).

Home arc (Letter-ish, mutated with a sticky showpiece): cold open (portrait + mantra) → the forgetting
problem (big text + curve) → SHOWPIECE sticky "rhythm of remembering" (curve lifts per step) → proof ledger
→ offerings index (programs + books) → mantra text-highlight → notice board (events + journal) → invitation.

## Tokens (src/app/globals.css)

- Colors: ivory paper `--paper #fbf7f0`, alt band `--paper-deep`, card `--card`; ink `#2a1b3d` (text), ink-2
  `#5e5370` (muted); violet `#4b2378` = brand/action (buttons, links); marigold `#e8862a` = **recall** — the
  signature highlight (review dots, counters, badges, active underline). Marigold text uses `--marigold-deep`
  `#a8530f`. Rose `#c2255c` only for handwritten script lines. Never gradients; never indigo→purple glows.
- Tailwind classes map to tokens: `bg-bg`, `bg-bg-alt`, `bg-surface`, `text-ink`, `text-muted`, `border-line`,
  `ring-line-strong`, `bg-brand`, `text-brand`, `bg-brand-soft`, `bg-recall`, `text-recall-text`,
  `bg-recall-soft`, `text-script`, `bg-success-soft text-success`, `bg-danger-soft text-danger`, `text-paper`,
  `text-on-ink-muted`, `text-on-ink-accent`, `shadow-1`, `shadow-2`, `rounded-sm|md|lg`.
  **Never hardcode hex in components.** Add a token if one is missing.
- Type: `font-display` (Petrona serif) for headings/prices; `font-sans` (Mukta) body; `font-script` (Kalam)
  only for signature lines (≤ 1 per page). Sizes: `text-[length:var(--text-3xl)]` etc. for display sizes.
- Space: `page-wrap` container; section rhythm `py-[var(--section-y)]`.
- Radius: soft (cards `rounded-lg` 22px, inputs `rounded-md`, buttons pill).
- Motion: organic. Durations `--dur-fast/base/slow`, easing `--ease-out`. CSS entrances with `.rise-in`
  (+ `style={{"--i": n}}` for stagger). Only transform/opacity/clip-path. Respect reduced motion.

## Shared building blocks (reuse, don't fork)

- `components/ui/Button.tsx` — `Button`, `ButtonLink`, `buttonClass(variant,size)`; variants primary | secondary | ghost | recall.
- `components/ui/misc.tsx` — `Badge`, `SampleNote`, `PageHeader`, `Price`.
- `components/ui/RhythmMark.tsx` — logo/bullet mark and `RhythmDivider` (the curve echo).
- `components/ui/BookCover.tsx` — drawn typographic covers (no fake cover art).
- `components/cart/*` — `AddToCartButton`, `CartDrawer` (native dialog), `CartLines`; store in `lib/cart/store.ts`.
- Data: `lib/data/*.ts` async getters (backend swap point), types in `lib/types.ts`, formatting in `lib/format.ts`.
- Dialogs: native `<dialog className="kc-dialog">`.

## Rules for every page

- Every page ends with a way to act (enrol, buy, register, invite).
- Mark demo content: `<SampleNote />` near sample catalogues; "[to confirm]" for unknown facts.
- Never invent awards, quotes, testimonials or numbers beyond `lib/data/site.ts`.
- Next.js 16 with `cacheComponents`: dynamic routes use `generateStaticParams` from the data getters;
  `params` is a Promise (`await params`); avoid `useSearchParams` (or wrap in `<Suspense>`).
- Studio (`/studio`) hides the public header/footer and has its own chrome.

## Decisions log

- 2026-10-07 — Light theme only for v1 (his materials are light ivory/violet). Dark mode deferred.
- 2026-10-07 — Images: his portrait (cropped from profile sheet) + CC-licensed Flickr stand-ins listed in
  `public/images/CREDITS.md`; replace with his own event photography.
- 2026-10-07 — Built in parallel: commerce (programs/books/cart/checkout), content (about/journal/events/contact),
  learner area + studio. GST is included in listed prices; shipping ₹60 when a paperback is in the cart; coupon
  RHYTHM10. Studio "today" is pinned to 2026-10-07 in `components/account/revisit.ts` (Cache Components can't read
  the clock during prerender) — replace when wiring the backend.
- 2026-10-07 — Base element styles live in `@layer base`, helpers in `@layer components`, so Tailwind utilities win.
- 2026-10-07 — `next/image`: use `loading="eager" fetchPriority="high"` for the LCP image (`priority` is deprecated in Next 16).
