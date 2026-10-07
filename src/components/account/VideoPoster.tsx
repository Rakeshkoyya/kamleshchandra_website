"use client";

import { useState } from "react";
import { RhythmMark } from "@/components/ui/RhythmMark";

type Props = { courseTitle: string; lessonTitle: string; lessonNumber: number; minutes: number };

/**
 * A designed 16:9 poster standing in for the video player.
 * BACKEND: swap for the real player (e.g. Mux / Bunny Stream / Vimeo) with a signed playback URL per lesson.
 */
export function VideoPoster({ courseTitle, lessonTitle, lessonNumber, minutes }: Props) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-ink text-paper shadow-2">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-paper/10" aria-hidden="true">
        <path
          d="M0 180 C 140 600, 260 700, 420 720 L 420 300 C 600 620, 720 650, 880 650 L 880 260 C 1060 520, 1200 540, 1340 540 L 1340 230 C 1450 330, 1530 330, 1600 330"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="truncate text-xs font-bold tracking-[0.14em] text-on-ink-muted uppercase">{courseTitle}</p>
          <RhythmMark className="w-12 shrink-0 text-paper" />
        </div>
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <p className="font-display text-sm text-on-ink-accent">Lesson {lessonNumber}</p>
            <p className="mt-1 max-w-[22ch] font-display text-xl leading-tight font-semibold sm:text-3xl">{lessonTitle}</p>
          </div>
          <span className="shrink-0 text-sm text-on-ink-muted tabular-nums">{minutes}:00</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setIsPressed(true)}
        className="group absolute top-1/2 left-1/2 grid h-18 w-18 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-recall text-ink shadow-2 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] hover:scale-105 sm:h-22 sm:w-22"
        aria-label={`Play lesson ${lessonNumber}: ${lessonTitle}`}
      >
        <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor" aria-hidden="true">
          <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z" />
        </svg>
      </button>
      <p aria-live="polite" className="absolute inset-x-0 bottom-16 text-center text-sm text-on-ink-muted sm:bottom-20">
        {isPressed ? "Demo: the lesson video would play here." : ""}
      </p>
    </div>
  );
}
