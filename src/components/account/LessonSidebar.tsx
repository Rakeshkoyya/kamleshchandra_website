"use client";

import type { Course } from "@/lib/types";
import { flattenLessons } from "./revisit";

type Props = {
  course: Course;
  currentId: string;
  completed: ReadonlySet<string>;
  onSelect: (lessonId: string) => void;
};

function CheckState({ isDone, isCurrent }: { isDone: boolean; isCurrent: boolean }) {
  if (isDone) {
    return (
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-recall text-ink" aria-hidden="true">
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2.5 6.5 5 9l4.5-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 rounded-full border-2 ${isCurrent ? "border-brand bg-brand-soft" : "border-line-strong"}`}
    />
  );
}

/** Modules → lessons with check states. Rendered in the desktop rail and the mobile drawer. */
export function LessonSidebar({ course, currentId, completed, onSelect }: Props) {
  const position = new Map(flattenLessons(course).map((l) => [l.lesson.id, l.position]));
  return (
    <nav aria-label="Lessons">
      <ol className="space-y-6">
        {course.modules.map((m, mi) => {
          const doneInModule = m.lessons.filter((l) => completed.has(l.id)).length;
          return (
            <li key={m.id}>
              <p className="flex items-baseline justify-between gap-2 px-2">
                <span className="text-xs font-bold tracking-[0.12em] text-muted uppercase">
                  Module {mi + 1} · {m.title}
                </span>
                <span className="text-xs text-muted tabular-nums">
                  {doneInModule}/{m.lessons.length}
                </span>
              </p>
              <ol className="mt-2 space-y-0.5">
                {m.lessons.map((l) => {
                  const isCurrent = l.id === currentId;
                  const isDone = completed.has(l.id);
                  return (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(l.id)}
                        aria-current={isCurrent ? "step" : undefined}
                        className={`flex w-full items-start gap-3 rounded-md px-2 py-2.5 text-left text-sm transition-colors duration-[var(--dur-fast)] ${
                          isCurrent ? "bg-brand-soft font-semibold text-ink" : "hover:bg-bg-alt"
                        }`}
                      >
                        <CheckState isDone={isDone} isCurrent={isCurrent} />
                        <span className="min-w-0 flex-1">
                          <span className="text-muted tabular-nums">{position.get(l.id)}.</span> {l.title}
                          <span className="sr-only">{isDone ? " (completed)" : ""}</span>
                        </span>
                        <span className="text-xs text-muted tabular-nums">{l.minutes}m</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
