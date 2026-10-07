import Link from "next/link";
import { frameworks, press, proof } from "@/lib/data/site";
import { CountUp } from "./CountUp";

/* Chapter 4 — proof, as a ledger on the ink band. Only facts from his profile. */
export function Ledger() {
  return (
    <section aria-labelledby="ledger-title" className="bg-ink py-[var(--section-y)] text-paper">
      <div className="page-wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-on-ink-accent uppercase">Two decades, in numbers</p>
          <h2 id="ledger-title" className="mt-3 max-w-[16ch] text-[length:var(--text-3xl)]">
            A national voice in the learning sciences
          </h2>
          <p className="mt-5 max-w-[42ch] text-on-ink-muted">
            Director – Academics at SHANA International School for over fifteen years, and creator of two frameworks
            that schools now teach by:
          </p>
          <ul className="mt-6 space-y-4">
            {frameworks.map((f) => (
              <li key={f.short} className="border-l-2 border-recall pl-4">
                <p className="font-display text-xl">{f.name}</p>
                <p className="text-sm text-on-ink-muted">{f.line}</p>
              </li>
            ))}
          </ul>
          <Link href="/about" className="draw-link mt-8 inline-block font-semibold text-on-ink-accent">
            The full story →
          </Link>
        </div>

        <div>
          <dl className="divide-y divide-white/15 border-y border-white/15">
            {proof.map((p) => (
              <div key={p.label} className="grid grid-cols-[minmax(0,1fr)] gap-1 py-5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-baseline sm:gap-6">
                <dt className="sr-only">{p.label}</dt>
                <dd className="font-display text-[clamp(2rem,1.4rem+2vw,3.25rem)] leading-none font-semibold text-on-ink-accent">
                  <CountUp value={p.value} suffix={p.suffix} />
                </dd>
                <dd>
                  <span className="font-semibold">{p.label}</span>
                  <span className="block text-sm text-on-ink-muted">{p.detail}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <p className="text-xs font-bold tracking-[0.14em] text-on-ink-muted uppercase">His work has been featured in</p>
            <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2 font-display text-xl italic">
              {press.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
