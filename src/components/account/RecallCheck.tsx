"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SampleNote } from "@/components/ui/misc";
import { formatDate } from "@/lib/format";
import { addDays, DEMO_TODAY_ISO, REVISIT_DAYS } from "./revisit";

/* SAMPLE recall questions. BACKEND: GET /api/lessons/{id}/recall — authored per lesson in the studio. */
const QUESTIONS = [
  {
    q: "In one sentence, what was this lesson's main idea?",
    a: "Say it without looking. If you can explain it simply, it has somewhere to live in memory.",
  },
  {
    q: "Why does recalling an idea beat re-reading it?",
    a: "Pulling an idea out of memory strengthens the path back to it; re-reading only feels familiar.",
  },
  {
    q: "When are your next three revisits for this lesson?",
    a: "Day 1, day 7 and day 30 — each just before you would otherwise forget.",
  },
];

type Props = { lessonId: string; lessonTitle: string };

/** Self-quiz after each lesson + the spaced revisit schedule. */
export function RecallCheck({ lessonId, lessonTitle }: Props) {
  const [revealed, setRevealed] = useState<ReadonlySet<number>>(new Set());
  const [schedule, setSchedule] = useState<string[] | null>(null);

  function toggle(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function scheduleRevisits() {
    // BACKEND: POST /api/revisits { lessonId, days: [1, 7, 30] } → creates reminders (WhatsApp/email per settings).
    setSchedule(REVISIT_DAYS.map((d) => addDays(DEMO_TODAY_ISO, d)));
  }

  return (
    <section aria-labelledby={`recall-${lessonId}`} className="rounded-lg border border-line bg-surface p-5 shadow-1 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Recall check</p>
          <h2 id={`recall-${lessonId}`} className="mt-1 text-xl">
            Close your notes. What do you remember?
          </h2>
        </div>
        <SampleNote>Sample questions</SampleNote>
      </div>

      <ol className="mt-6 space-y-3">
        {QUESTIONS.map((item, i) => {
          const isOpen = revealed.has(i);
          return (
            <li key={item.q} className="rounded-md bg-bg-alt p-4">
              <p className="flex gap-3 font-semibold">
                <span className="font-display text-recall-text tabular-nums">{i + 1}</span>
                {item.q}
              </p>
              <button
                type="button"
                className="mt-2 ml-6 text-sm font-semibold text-brand underline underline-offset-4"
                aria-expanded={isOpen}
                aria-controls={`ans-${lessonId}-${i}`}
                onClick={() => toggle(i)}
              >
                {isOpen ? "Hide answer" : "I've thought about it — reveal"}
              </button>
              <p id={`ans-${lessonId}-${i}`} hidden={!isOpen} className="mt-2 ml-6 border-l-2 border-recall pl-3 text-sm text-muted">
                {item.a}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-dashed border-line pt-5">
        <Button variant="recall" onClick={scheduleRevisits}>
          Schedule my revisits
        </Button>
        <p className="text-sm text-muted">For “{lessonTitle}”</p>
      </div>
      <div aria-live="polite">
        {schedule ? (
          <ol className="mt-5 grid gap-3 sm:grid-cols-3">
            {schedule.map((iso, i) => (
              <li key={iso} className="rounded-md border border-line bg-bg p-4">
                <p className="flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-recall-text uppercase">
                  <span className="h-2.5 w-2.5 rounded-full bg-recall" aria-hidden="true" />
                  Day {REVISIT_DAYS[i]}
                </p>
                <p className="mt-1 font-display text-lg font-semibold">{formatDate(iso)}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
