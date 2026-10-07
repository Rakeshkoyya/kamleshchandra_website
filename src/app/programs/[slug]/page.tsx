import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseFaq } from "@/components/commerce/programs/CourseFaq";
import { BuyCard, CourseIntro, courseCartItem } from "@/components/commerce/programs/CourseHero";
import { Curriculum } from "@/components/commerce/programs/Curriculum";
import { InstructorBlock } from "@/components/commerce/programs/InstructorBlock";
import { MobileBuyBar } from "@/components/commerce/programs/MobileBuyBar";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { AUDIENCE_LABEL, getCourse, getCourses } from "@/lib/data/courses";
import type { Audience } from "@/lib/types";

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "Program not found" };
  return { title: course.title, description: course.subtitle };
}

const AUDIENCE_NOTE: Record<Audience, string> = {
  students: "Students preparing for board exams, entrance tests, or simply tired of forgetting what they studied.",
  parents: "Parents who want to understand their child's learning brain and become a calm partner at home.",
  teachers: "Teachers who want retention built into every lesson, not bolted on before exams.",
  schools: "School leaders planning staff development aligned with NEP 2020.",
};

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course || course.status !== "published") notFound();

  const item = courseCartItem(course);

  return (
    <div className="pb-24 lg:pb-0">
      {/* Grid: intro (col 1) · buy card (col 2, spans both rows, sticky) · body (col 1). */}
      <div className="page-wrap grid gap-10 pt-10 pb-[var(--section-y)] md:pt-16 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-x-14">
        <CourseIntro course={course} />
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <BuyCard course={course} />
        </div>
        <div className="grid min-w-0 gap-[var(--section-y)] pt-[calc(var(--section-y)/2)] lg:col-start-1">
          <section aria-labelledby="outcomes-title">
            <p className="eyebrow">Outcomes</p>
            <h2 id="outcomes-title" className="mt-3 text-[length:var(--text-2xl)]">
              By the end, you will
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 text-lg leading-snug">
                  <RhythmMark className="mt-1 w-9 shrink-0 text-brand" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>

          <Curriculum course={course} />

          <section aria-labelledby="for-title">
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2 id="for-title" className="mt-3 text-[length:var(--text-2xl)]">
              Made for
            </h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {course.audience.map((a) => (
                <div key={a} className="rounded-lg bg-surface p-5 ring-1 ring-line">
                  <dt className="font-display text-xl">{AUDIENCE_LABEL[a]}</dt>
                  <dd className="mt-2 text-muted">{AUDIENCE_NOTE[a]}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted">
              Level: {course.level}. Taught in {course.language}. No prior background needed for Foundation programs.
            </p>
          </section>

          <InstructorBlock />

          <CourseFaq course={course} />

          <section aria-labelledby="enrol-title" className="rounded-lg bg-ink p-8 text-paper md:p-12">
            <h2 id="enrol-title" className="max-w-[20ch] text-[length:var(--text-2xl)]">
              Start the rhythm this week.
            </h2>
            <p className="mt-3 max-w-[50ch] text-on-ink-muted">
              Add {course.title} to your cart — you can pay by UPI, card or netbanking.
            </p>
            <AddToCartButton item={item} variant="recall" label="Enrol now" className="mt-6" />
          </section>
        </div>
      </div>

      <MobileBuyBar title={course.title} priceInr={course.priceInr} compareAtInr={course.compareAtInr} item={item} label="Enrol" />
    </div>
  );
}
