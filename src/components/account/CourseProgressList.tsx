import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/misc";
import { courseLessonCount, FORMAT_LABEL } from "@/lib/data/courses";
import type { Course, Enrolment } from "@/lib/types";

type Row = { course: Course; enrolment: Enrolment };

export function CourseProgressList({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line-strong p-8 text-center">
        <p className="font-display text-xl">No courses yet.</p>
        <ButtonLink href="/programs" className="mt-4">
          Browse programs
        </ButtonLink>
      </div>
    );
  }

  return (
    <ul className="grid gap-4">
      {rows.map(({ course, enrolment }) => {
        const total = courseLessonCount(course);
        const done = Math.round(enrolment.progress * total);
        const pct = Math.round(enrolment.progress * 100);
        return (
          <li
            key={course.slug}
            className="grid gap-5 rounded-lg border border-line bg-surface p-5 shadow-1 md:grid-cols-[1fr_auto] md:items-center md:p-6"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone="brand">{FORMAT_LABEL[course.format]}</Badge>
                <Badge>{course.language}</Badge>
              </div>
              <h3 className="mt-3 text-xl">{course.title}</h3>
              <div className="mt-4 flex items-center gap-3">
                <div
                  className="h-2 flex-1 overflow-hidden rounded-full bg-bg-alt"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                  aria-label={`${course.title} progress`}
                >
                  <div
                    className="h-full w-full origin-left rounded-full bg-brand"
                    style={{ transform: `scaleX(${enrolment.progress})` }}
                  />
                </div>
                <span className="w-24 text-right text-sm text-muted tabular-nums">
                  {done}/{total} lessons
                </span>
              </div>
            </div>
            <ButtonLink href={`/learn/${course.slug}`} className="md:justify-self-end">
              Continue <span aria-hidden="true">→</span>
            </ButtonLink>
          </li>
        );
      })}
    </ul>
  );
}
