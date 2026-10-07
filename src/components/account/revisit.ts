/*
 * Scientific Retention Management, in product form: every lesson is revisited
 * on day 1, day 7 and day 30 after it is learnt. These helpers are pure so they
 * can run on the server without touching the current time (cacheComponents
 * forbids `new Date()` during prerender) — the demo pins "today".
 */

import type { Course, Enrolment, Lesson } from "@/lib/types";

/** Fixed "today" for the demo. BACKEND: replace with the learner's real clock / server time. */
export const DEMO_TODAY_ISO = "2026-10-07T09:00:00+05:30";

/** The revisit rhythm, in days after first learning a lesson. */
export const REVISIT_DAYS = [1, 7, 30] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

export function addDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / DAY_MS);
}

/** Flattened lessons with their 1-based position in the course. */
export function flattenLessons(course: Course): { lesson: Lesson; moduleTitle: string; position: number }[] {
  const out: { lesson: Lesson; moduleTitle: string; position: number }[] = [];
  for (const m of course.modules) {
    for (const lesson of m.lessons) {
      out.push({ lesson, moduleTitle: m.title, position: out.length + 1 });
    }
  }
  return out;
}

export interface RevisitPlan {
  course: Course;
  enrolment: Enrolment;
  lessonTitle: string;
  lessonPosition: number;
  /** Index into REVISIT_DAYS of the review that is due next */
  stageIndex: number;
  stageDay: number;
  daysUntil: number;
}

/**
 * Builds the "today's revisit" line for one enrolment.
 * BACKEND: the review stage should come from the learner's review log; the demo
 * derives it from progress so the sample reads plausibly.
 */
export function planRevisit(course: Course, enrolment: Enrolment): RevisitPlan {
  const lessons = flattenLessons(course);
  const current = lessons.find((l) => l.lesson.id === enrolment.lastLessonId) ?? lessons[0];
  const stageIndex = Math.min(REVISIT_DAYS.length - 1, Math.floor(enrolment.progress * 4));
  return {
    course,
    enrolment,
    lessonTitle: current?.lesson.title ?? course.title,
    lessonPosition: current?.position ?? 1,
    stageIndex,
    stageDay: REVISIT_DAYS[stageIndex],
    daysUntil: Math.max(0, daysBetween(DEMO_TODAY_ISO, enrolment.nextRevisitAt)),
  };
}

export function whenLabel(daysUntil: number): string {
  if (daysUntil <= 0) return "today";
  if (daysUntil === 1) return "tomorrow";
  return `in ${daysUntil} days`;
}

/*
 * Forgetting-curve geometry: retention decays exponentially and each revisit
 * resets it to the top with a slower decay. Returns SVG path + dot positions
 * for a chart `width` × `height`, spanning 0..spanDays on a square-root time
 * axis (so day 1 and day 7 aren't crushed against the left edge).
 */
export function forgettingCurve(width: number, height: number, spanDays = 40, pad = 5) {
  const x = (d: number) => pad + (Math.sqrt(d) / Math.sqrt(spanDays)) * (width - pad * 2);
  const y = (r: number) => pad + (1 - r) * (height - pad * 2);
  const reviews = [0, ...REVISIT_DAYS, spanDays];
  let path = "";
  let strength = 1.4;
  const dots: { cx: number; cy: number; day: number }[] = [];
  for (let i = 0; i < reviews.length - 1; i++) {
    const start = reviews[i];
    const end = reviews[i + 1];
    const steps = 14;
    for (let s = 0; s <= steps; s++) {
      const d = start + ((end - start) * s) / steps;
      const r = 0.12 + 0.88 * Math.exp(-(d - start) / strength);
      path += `${path ? " L" : "M"} ${x(d).toFixed(1)} ${y(r).toFixed(1)}`;
    }
    if (i < REVISIT_DAYS.length) {
      const day = REVISIT_DAYS[i];
      dots.push({ cx: x(day), cy: y(1), day });
    }
    strength *= 4.5;
  }
  return { path, dots };
}
