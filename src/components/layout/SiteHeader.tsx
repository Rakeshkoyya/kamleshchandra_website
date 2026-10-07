"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { cartDrawer, useCart } from "@/lib/cart/store";
import { navLinks } from "@/lib/data/site";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  // The menu remembers the path it was opened on, so navigating closes it.
  const [menuOpenedOn, setMenuOpenedOn] = useState<string | null>(null);
  const isMenuOpen = menuOpenedOn === pathname;

  // The studio has its own chrome.
  if (pathname.startsWith("/studio")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/90 backdrop-blur-md">
      <div className="page-wrap flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Kamlesh Chandra — home">
          <RhythmMark className="w-10 text-brand transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:-translate-y-0.5" />
          <span className="font-display text-lg font-semibold tracking-tight">Kamlesh Chandra</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.95rem] font-medium">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="draw-link" aria-current={isActive(pathname, l.href) ? "page" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/account"
            className="hidden h-10 items-center rounded-full px-3 text-sm font-medium hover:bg-brand-soft sm:inline-flex"
          >
            My learning
          </Link>
          <button
            type="button"
            onClick={cartDrawer.open}
            className="relative inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium hover:bg-brand-soft"
            aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z" strokeLinejoin="round" />
              <path d="M9 7a3 3 0 0 1 6 0" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {count > 0 ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-recall px-1 text-xs font-bold text-ink">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-brand-soft lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpenedOn(isMenuOpen ? null : pathname)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {isMenuOpen ? <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /> : <path d="M4 8h16M4 16h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-line bg-bg lg:hidden">
          <ul className="page-wrap flex flex-col py-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex items-center justify-between py-3 font-display text-xl"
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                >
                  {l.label}
                  <span aria-hidden="true" className="text-recall">→</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/account" className="flex py-3 font-display text-xl">
                My learning
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
