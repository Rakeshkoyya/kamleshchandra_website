import Image from "next/image";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Price, SampleNote } from "@/components/ui/misc";
import { AUDIENCE_LABEL, FORMAT_LABEL, courseLessonCount } from "@/lib/data/courses";
import { formatInr } from "@/lib/format";
import type { Course } from "@/lib/types";

type Props = {
  course: Course;
};

export function courseCartItem(course: Course) {
  return { kind: "course" as const, slug: course.slug, title: course.title, variant: course.format, unitPriceInr: course.priceInr };
}

/* Title, subtitle, badges and the hero image. */
export function CourseIntro({ course }: Props) {
  return (
    <header className="min-w-0">
        <p className="eyebrow rise-in">
          Program · {FORMAT_LABEL[course.format]}
        </p>
        <h1 className="rise-in mt-3 max-w-[20ch] text-[length:var(--text-3xl)]" style={{ ["--i" as string]: 1 }}>
          {course.title}
        </h1>
        <p className="rise-in mt-5 max-w-[58ch] text-lg text-muted" style={{ ["--i" as string]: 2 }}>
          {course.subtitle}
        </p>
        <div className="rise-in mt-6 flex flex-wrap gap-2" style={{ ["--i" as string]: 3 }}>
          {course.audience.map((a) => (
            <Badge key={a} tone="brand">
              For {AUDIENCE_LABEL[a].toLowerCase()}
            </Badge>
          ))}
          <Badge>{course.level}</Badge>
          <Badge>{course.language}</Badge>
        </div>
        <div className="rise-in relative mt-10 aspect-[16/9] overflow-hidden rounded-lg bg-bg-alt" style={{ ["--i" as string]: 3 }}>
          {course.image ? (
            <Image src={course.image} alt="" fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 50rem, 100vw" className="object-cover" />
          ) : null}
        </div>
    </header>
  );
}

/* Price block + primary actions. Sticky on desktop (the page places it in a tall grid cell). */
export function BuyCard({ course }: Props) {
  const lessons = courseLessonCount(course);
  const saving = course.compareAtInr ? course.compareAtInr - course.priceInr : 0;

  return (
    <aside aria-label="Enrol" className="rise-in lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]" style={{ ["--i" as string]: 2 }}>
        <div className="rounded-lg bg-surface p-6 shadow-2 ring-1 ring-line md:p-7">
          <Price
            className="[&>span:first-child]:text-[length:var(--text-2xl)]"
            amount={formatInr(course.priceInr)}
            compareAt={course.compareAtInr ? formatInr(course.compareAtInr) : undefined}
          />
          {saving > 0 ? (
            <p className="mt-1 text-sm font-semibold text-recall-text">You save {formatInr(saving)}</p>
          ) : null}
          <p className="mt-1 text-xs text-muted">Price includes 18% GST.</p>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-4 text-sm">
            <div>
              <dt className="text-muted">Format</dt>
              <dd className="font-semibold">{FORMAT_LABEL[course.format]}</dd>
            </div>
            <div>
              <dt className="text-muted">Lessons</dt>
              <dd className="font-semibold">{lessons}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted">Duration</dt>
              <dd className="font-semibold">{course.durationLabel}</dd>
            </div>
          </dl>

          <div className="mt-5 grid gap-3">
            {/* BACKEND: enrolment is created after payment verification at checkout. */}
            <AddToCartButton item={courseCartItem(course)} label="Enrol — add to cart" className="w-full" />
            <ButtonLink href="#curriculum" variant="secondary" className="w-full">
              Preview a free lesson
            </ButtonLink>
          </div>
          <SampleNote className="mt-5">Sample program — price and modules are demo content</SampleNote>
        </div>
    </aside>
  );
}
