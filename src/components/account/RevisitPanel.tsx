import Link from "next/link";
import { formatDate } from "@/lib/format";
import { ForgettingSparkline } from "./ForgettingSparkline";
import { REVISIT_DAYS, whenLabel } from "./revisit";
import type { RevisitPlan } from "./revisit";

/*
 * "Today's revisit" — the brand idea as a product feature: each enrolled
 * course surfaces the lesson whose spaced review is due, with a tiny
 * forgetting curve showing where in the day-1/7/30 rhythm it sits.
 */
export function RevisitPanel({ plans }: { plans: RevisitPlan[] }) {
  const dueNow = plans.filter((p) => p.daysUntil <= 1).length;

  return (
    <section aria-labelledby="revisit-title" className="relative overflow-hidden rounded-lg bg-ink p-6 text-paper shadow-2 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-on-ink-accent uppercase">Scientific Retention Management</p>
          <h2 id="revisit-title" className="mt-2 text-[length:var(--text-2xl)]">
            Today&rsquo;s revisit
          </h2>
        </div>
        <p className="text-sm text-on-ink-muted">
          <span className="font-display text-2xl font-semibold text-paper">{dueNow}</span> due in the next day ·{" "}
          {REVISIT_DAYS.map((d) => `day ${d}`).join(" → ")}
        </p>
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {plans.map((p) => (
          <li key={p.course.slug} className="flex flex-col gap-4 rounded-md bg-paper p-5 text-ink sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-muted">{p.course.title}</p>
              <p className="mt-1 font-display text-lg leading-snug font-semibold">
                Revisit lesson {p.lessonPosition} {whenLabel(p.daysUntil)}
                <span className="text-recall-text"> — day {p.stageDay} review</span>
              </p>
              <p className="mt-1 truncate text-sm text-muted">&ldquo;{p.lessonTitle}&rdquo;</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <Link
                  href={`/learn/${p.course.slug}`}
                  className="font-semibold text-brand underline decoration-recall decoration-2 underline-offset-4"
                >
                  Start 5-minute recall
                </Link>
                <span className="text-xs text-muted">{formatDate(p.enrolment.nextRevisitAt)}</span>
              </p>
            </div>
            <ForgettingSparkline stageIndex={p.stageIndex} className="shrink-0" />
          </li>
        ))}
      </ul>
      <p className="mt-5 max-w-[60ch] text-sm text-on-ink-muted">
        Each marigold dot is a revisit. Recall just before you&rsquo;d forget, and the curve falls a little slower every time.
      </p>
    </section>
  );
}
