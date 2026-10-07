"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Course } from "@/lib/types";
import { LessonSidebar } from "./LessonSidebar";
import { RecallCheck } from "./RecallCheck";
import { flattenLessons } from "./revisit";
import { VideoPoster } from "./VideoPoster";

type Props = { course: Course; startLessonId?: string };

/* SAMPLE lesson notes. BACKEND: GET /api/lessons/{id} → notes, resources, video playback id. */
function sampleNotes(title: string): string[] {
  return [
    `In “${title}” we slow down and look at one idea closely, then practise it straight away. Keep a notebook open — you'll write before you watch the answer.`,
    "Pause the video whenever you're asked a question. The effort of answering is the point: it is what tells your brain this matters.",
  ];
}

export function CoursePlayer({ course, startLessonId }: Props) {
  const lessons = flattenLessons(course);
  const startIndex = Math.max(0, lessons.findIndex((l) => l.lesson.id === startLessonId));
  const [currentId, setCurrentId] = useState(lessons[startIndex]?.lesson.id ?? "");
  // Demo: lessons before the learner's last lesson count as complete.
  const [completed, setCompleted] = useState<ReadonlySet<string>>(
    () => new Set(lessons.slice(0, startIndex).map((l) => l.lesson.id)),
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const index = Math.max(0, lessons.findIndex((l) => l.lesson.id === currentId));
  const current = lessons[index];
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const isDone = completed.has(currentId);
  const pct = Math.round((completed.size / lessons.length) * 100);

  function select(id: string) {
    setCurrentId(id);
    setIsDrawerOpen(false);
    // BACKEND: PATCH /api/enrolments/{course} { lastLessonId: id }
  }

  function toggleComplete() {
    // BACKEND: POST /api/progress { courseSlug, lessonId, completed } — and log an analytics event.
    setCompleted((prevSet) => {
      const nextSet = new Set(prevSet);
      if (nextSet.has(currentId)) nextSet.delete(currentId);
      else nextSet.add(currentId);
      return nextSet;
    });
  }

  if (!current) return null;

  const sidebar = <LessonSidebar course={course} currentId={currentId} completed={completed} onSelect={select} />;

  return (
    <div className="page-wrap grid gap-8 pt-6 pb-[var(--section-y)] lg:grid-cols-[19rem_1fr] lg:gap-12 lg:pt-10">
      <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:max-h-[calc(100svh-var(--header-h)-3rem)] lg:self-start lg:overflow-y-auto">
        <Link href="/account" className="text-sm font-semibold text-brand">
          ← My learning
        </Link>
        <p className="mt-4 font-display text-xl leading-snug font-semibold">{course.title}</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-alt" aria-hidden="true">
            <div className="h-full w-full origin-left rounded-full bg-recall" style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
          <span className="text-xs text-muted tabular-nums">{pct}% complete</span>
        </div>

        <button
          type="button"
          className="mt-5 flex w-full items-center justify-between rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold lg:hidden"
          aria-expanded={isDrawerOpen}
          aria-controls="lesson-drawer"
          onClick={() => setIsDrawerOpen((v) => !v)}
        >
          Lessons · {index + 1} of {lessons.length}
          <span aria-hidden="true" className={`transition-transform duration-[var(--dur-fast)] ${isDrawerOpen ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>
        <div id="lesson-drawer" className={`${isDrawerOpen ? "block" : "hidden"} mt-3 rounded-md border border-line bg-surface p-3 lg:mt-6 lg:block lg:border-0 lg:bg-transparent lg:p-0`}>
          {sidebar}
        </div>
      </aside>

      <article className="min-w-0 space-y-8">
        <VideoPoster
          courseTitle={course.title}
          lessonTitle={current.lesson.title}
          lessonNumber={current.position}
          minutes={current.lesson.minutes}
        />

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">
              {current.moduleTitle} · Lesson {current.position} of {lessons.length}
            </p>
            <h1 className="mt-2 text-[length:var(--text-2xl)]">{current.lesson.title}</h1>
          </div>
          <Button variant={isDone ? "secondary" : "primary"} onClick={toggleComplete} aria-pressed={isDone}>
            {isDone ? "✓ Completed" : "Mark complete"}
          </Button>
        </header>

        <div className="prose-kc max-w-[65ch] text-muted">
          {sampleNotes(current.lesson.title).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <RecallCheck key={currentId} lessonId={currentId} lessonTitle={current.lesson.title} />

        <nav aria-label="Lesson navigation" className="flex flex-wrap justify-between gap-3 border-t border-line pt-6">
          {prev ? (
            <Button variant="ghost" onClick={() => select(prev.lesson.id)}>
              ← <span className="max-w-[22ch] truncate">{prev.lesson.title}</span>
            </Button>
          ) : (
            <span />
          )}
          {next ? (
            <Button onClick={() => select(next.lesson.id)}>
              <span className="max-w-[22ch] truncate">Next: {next.lesson.title}</span> →
            </Button>
          ) : (
            <Link href="/account" className="font-semibold text-brand">
              Course finished — back to My learning →
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
