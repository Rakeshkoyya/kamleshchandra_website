import Image from "next/image";
import Link from "next/link";
import { Badge, Price } from "@/components/ui/misc";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { AUDIENCE_LABEL, FORMAT_LABEL } from "@/lib/data/courses";
import { formatInr } from "@/lib/format";
import type { Course } from "@/lib/types";

type Props = {
  course: Course;
  index: number;
};

/* One band of the editorial programme index: number · image · story · price. */
export function ProgramRow({ course, index }: Props) {
  const number = String(index + 1).padStart(2, "0");
  const teaser = course.outcomes.slice(0, 2);
  const href = `/programs/${course.slug}`;

  return (
    <article className="group relative grid gap-6 border-t border-line py-10 md:grid-cols-[3rem_minmax(0,18rem)_minmax(0,1fr)_auto] md:gap-8 md:py-12">
      <p className="font-display text-2xl text-recall-text tabular-nums md:pt-1" aria-hidden="true">
        {number}
      </p>

      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-bg-alt">
        {course.image ? (
          <Image
            src={course.image}
            alt=""
            fill
            sizes="(min-width: 768px) 18rem, 100vw"
            className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        ) : null}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          {course.audience.map((a) => (
            <Badge key={a} tone="brand">
              {AUDIENCE_LABEL[a]}
            </Badge>
          ))}
          <Badge>{course.level}</Badge>
        </div>
        <h2 className="mt-3 text-[length:var(--text-2xl)]">
          {/* The whole row is clickable via the stretched link; focus ring stays on the title. */}
          <Link href={href} className="draw-link after:absolute after:inset-0 after:content-['']">
            {course.title}
          </Link>
        </h2>
        <p className="mt-2 max-w-[56ch] text-muted">{course.subtitle}</p>
        <ul className="mt-4 space-y-1.5 text-sm" aria-label="You will">
          {teaser.map((o) => (
            <li key={o} className="flex items-start gap-2.5">
              <RhythmMark className="mt-1 w-6 shrink-0 text-brand" />
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-row flex-wrap items-end justify-between gap-3 md:min-w-40 md:flex-col md:items-end md:justify-start md:text-right">
        <dl className="text-sm text-muted md:order-2">
          <div>
            <dt className="sr-only">Format</dt>
            <dd className="font-semibold text-ink">{FORMAT_LABEL[course.format]}</dd>
          </div>
          <div>
            <dt className="sr-only">Duration</dt>
            <dd>{course.durationLabel}</dd>
          </div>
          <div>
            <dt className="sr-only">Language</dt>
            <dd>{course.language}</dd>
          </div>
        </dl>
        <Price
          className="md:order-1"
          amount={formatInr(course.priceInr)}
          compareAt={course.compareAtInr ? formatInr(course.compareAtInr) : undefined}
        />
        <span
          aria-hidden="true"
          className="hidden text-sm font-semibold text-brand transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:translate-x-1 md:order-3 md:mt-auto md:inline"
        >
          View program →
        </span>
      </div>
    </article>
  );
}
