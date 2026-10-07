"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { mantra, navLinks, person } from "@/lib/data/site";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;

  return (
    <footer className="mt-[var(--section-y)] bg-ink text-paper">
      {/* The purple band from his cards: the mantra, always at the bottom */}
      <div className="bg-brand">
        <p className="page-wrap py-6 text-center font-display text-lg leading-snug md:text-xl">{mantra.line}</p>
      </div>
      <div className="page-wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <RhythmMark className="w-10 text-paper" />
            <span className="font-display text-lg font-semibold">Kamlesh Chandra</span>
          </div>
          <p className="mt-4 max-w-[34ch] text-sm text-on-ink-muted">
            Cognitive learning strategist, creator of Scientific Retention Management, and Director – Academics at{" "}
            {person.school.name}, {person.school.city}.
          </p>
          <p className="mt-5 font-script text-xl text-on-ink-accent">Be Better Everyday — KC</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-xs font-bold tracking-[0.14em] text-on-ink-muted uppercase">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-on-ink-accent">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="hover:text-on-ink-accent">
                Invite KC to your school
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-bold tracking-[0.14em] text-on-ink-muted uppercase">Learners</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/account" className="hover:text-on-ink-accent">
                My learning
              </Link>
            </li>
            <li>
              <Link href="/signin" className="hover:text-on-ink-accent">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-on-ink-accent">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/studio" className="hover:text-on-ink-accent">
                Studio (admin demo)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.14em] text-on-ink-muted uppercase">Reach KC</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${person.email}`} className="hover:text-on-ink-accent">
                {person.email}
              </a>
            </li>
            {person.phones.map((p) => (
              <li key={p}>
                <a href={`tel:+91${p}`} className="hover:text-on-ink-accent">
                  +91 {p.slice(0, 5)} {p.slice(5)}
                </a>
              </li>
            ))}
            <li>
              <a href={person.website} className="hover:text-on-ink-accent" target="_blank" rel="noopener noreferrer">
                eshana.in
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="page-wrap flex flex-col gap-2 py-5 text-xs text-on-ink-muted sm:flex-row sm:justify-between">
          <p>© {2026} Kamlesh Chandra. All rights reserved.</p>
          <p>Demo build — catalogue, prices and dates are sample data.</p>
        </div>
      </div>
    </footer>
  );
}
