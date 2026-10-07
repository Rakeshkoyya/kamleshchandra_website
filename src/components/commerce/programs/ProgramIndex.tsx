"use client";

import { useState } from "react";
import { AUDIENCE_LABEL } from "@/lib/data/courses";
import type { Audience, Course } from "@/lib/types";
import { ProgramRow } from "./ProgramRow";

type Filter = Audience | "all";

const FILTERS: Filter[] = ["all", "students", "parents", "teachers", "schools"];

function filterLabel(f: Filter): string {
  return f === "all" ? "All" : AUDIENCE_LABEL[f];
}

type Props = {
  courses: Course[];
};

/* Audience filter is local UI state on purpose (no URL params — see design.md). */
export function ProgramIndex({ courses }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? courses : courses.filter((c) => c.audience.includes(filter));
  const countLabel = `${visible.length} ${visible.length === 1 ? "program" : "programs"}`;

  return (
    <section aria-labelledby="program-index-title" className="page-wrap pb-[var(--section-y)]">
      <h2 id="program-index-title" className="sr-only">
        All programs
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
        <div role="group" aria-label="Filter by audience" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isActive = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(f)}
                className={`h-10 rounded-full px-4 text-sm font-semibold transition-[background-color,color] duration-[var(--dur-fast)] ease-[var(--ease-out)] ${
                  isActive ? "bg-ink text-paper" : "bg-surface text-ink ring-1 ring-line-strong hover:ring-brand hover:text-brand"
                }`}
              >
                {filterLabel(f)}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          Showing {countLabel}
          {filter === "all" ? "" : ` for ${filterLabel(filter).toLowerCase()}`}
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="border-t border-line py-12 text-muted">
          No programs for this audience yet — write to us and we&rsquo;ll tell you what&rsquo;s coming.
        </p>
      ) : (
        <div className="border-b border-line">
          {visible.map((c, i) => (
            <ProgramRow key={c.slug} course={c} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
