"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RhythmMark } from "@/components/ui/RhythmMark";

const NAV = [
  { href: "/studio", label: "Dashboard" },
  { href: "/studio/programs", label: "Programs" },
  { href: "/studio/books", label: "Books" },
  { href: "/studio/journal", label: "Journal" },
  { href: "/studio/events", label: "Events & announcements" },
  { href: "/studio/orders", label: "Orders" },
  { href: "/studio/learners", label: "Learners" },
  { href: "/studio/settings", label: "Settings" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/studio") return pathname === "/studio";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <ul className="space-y-0.5">
      {NAV.map((item) => {
        const isCurrent = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isCurrent ? "page" : undefined}
              className={`group relative flex items-center rounded-md py-2.5 pr-3 pl-5 text-[0.95rem] transition-colors duration-[var(--dur-fast)] ${
                isCurrent ? "bg-surface font-semibold text-ink shadow-1" : "text-muted hover:bg-surface/60 hover:text-ink"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-1/2 left-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-recall transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] ${
                  isCurrent ? "scale-100" : "scale-0"
                }`}
              />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Brand() {
  return (
    <Link href="/studio" className="flex items-center gap-2.5">
      <RhythmMark className="w-9 text-brand" />
      <span className="leading-none">
        <span className="block font-display text-lg font-semibold">KC Studio</span>
        <span className="text-xs text-muted">Kamlesh Chandra</span>
      </span>
    </Link>
  );
}

/** Desktop: sticky left rail. Mobile: top bar with a disclosure menu. */
export function StudioNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-line bg-bg-alt lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Brand />
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold hover:bg-surface"
            aria-expanded={isOpen}
            aria-controls="studio-mobile-nav"
            onClick={() => setIsOpen((v) => !v)}
          >
            Menu
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {isOpen ? <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /> : <path d="M4 8h16M4 16h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
        {isOpen ? (
          <nav id="studio-mobile-nav" aria-label="Studio" className="border-t border-line px-3 py-3">
            <NavList pathname={pathname} onNavigate={() => setIsOpen(false)} />
          </nav>
        ) : null}
      </div>

      <aside className="hidden border-r border-line bg-bg-alt lg:block">
        <div className="sticky top-0 flex h-svh flex-col gap-8 px-4 py-6">
          <div className="px-1">
            <Brand />
          </div>
          <nav aria-label="Studio" className="flex-1">
            <NavList pathname={pathname} />
          </nav>
          <p className="px-2 font-script text-lg text-script">Be Better Everyday</p>
        </div>
      </aside>
    </>
  );
}
