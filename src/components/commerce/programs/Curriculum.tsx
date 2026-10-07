import { Badge } from "@/components/ui/misc";
import { courseLessonCount } from "@/lib/data/courses";
import type { Course } from "@/lib/types";

type Props = {
  course: Course;
};

function totalMinutes(lessons: { minutes: number }[]): number {
  return lessons.reduce((n, l) => n + l.minutes, 0);
}

function formatMinutes(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/* Native <details> accordion: keyboard and screen-reader support for free. */
export function Curriculum({ course }: Props) {
  const all = course.modules.flatMap((m) => m.lessons);

  return (
    <section id="curriculum" aria-labelledby="curriculum-title" className="scroll-mt-[calc(var(--header-h)+1rem)]">
      <p className="eyebrow">Curriculum</p>
      <h2 id="curriculum-title" className="mt-3 text-[length:var(--text-2xl)]">
        What you&rsquo;ll work through
      </h2>
      <p className="mt-2 text-muted">
        {course.modules.length} modules · {courseLessonCount(course)} lessons · {formatMinutes(totalMinutes(all))} in total.
        Lessons marked <span className="font-semibold text-recall-text">Preview</span> are free to watch.
      </p>

      <div className="mt-8 divide-y divide-line rounded-lg bg-surface ring-1 ring-line">
        {course.modules.map((mod, i) => (
          <details key={mod.id} className="group" open={i === 0}>
            <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 px-5 py-4 marker:content-none hover:bg-bg [&::-webkit-details-marker]:hidden">
              <span className="font-display text-lg text-recall-text tabular-nums" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg leading-snug">{mod.title}</span>
                <span className="block text-sm text-muted">
                  {mod.lessons.length} lessons · {formatMinutes(totalMinutes(mod.lessons))}
                </span>
              </span>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 text-muted transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <ol className="border-t border-line px-5 py-2">
              {mod.lessons.map((lesson) => (
                <li key={lesson.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3 text-[0.98rem]">
                  <span className="min-w-0 flex-1">{lesson.title}</span>
                  {lesson.isPreview ? <Badge tone="recall">Preview</Badge> : null}
                  <span className="w-16 text-right text-sm text-muted tabular-nums">{lesson.minutes} min</span>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </div>
    </section>
  );
}
