"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

export type AccountTab = { id: string; label: string; content: ReactNode };

/** Accessible tabs (WAI-ARIA pattern): arrow keys / Home / End move and activate. */
export function AccountTabs({ tabs, label }: { tabs: AccountTab[]; label: string }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function activate(index: number) {
    const i = (index + tabs.length) % tabs.length;
    setActive(tabs[i].id);
    refs.current[i]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in moves)) return;
    e.preventDefault();
    activate(moves[e.key]);
  }

  return (
    <div>
      <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:px-0">
        <div role="tablist" aria-label={label} className="flex min-w-max gap-1 border-b border-line">
          {tabs.map((t, i) => {
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${t.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(t.id)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`relative px-4 py-3 text-[0.95rem] font-semibold transition-colors duration-[var(--dur-fast)] ${
                  isActive ? "text-ink" : "text-muted hover:text-brand"
                }`}
              >
                {t.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-px h-[3px] origin-left rounded-full bg-recall transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className="pt-8 focus-visible:outline-offset-8"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
