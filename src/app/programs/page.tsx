import type { Metadata } from "next";
import { ProgramIndex } from "@/components/commerce/programs/ProgramIndex";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader, SampleNote } from "@/components/ui/misc";
import { getCourses } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Programs by Kamlesh Chandra for students, parents, teachers and schools — memory, neuroeducation and inner growth.",
};

export default async function ProgramsPage() {
  const courses = await getCourses();

  return (
    <>
      <PageHeader
        eyebrow="Programs"
        title="Learn the rhythm, then keep it."
        lead="Every program is built on Scientific Retention Management: short lessons, deliberate recall, and revisits spaced so that what you learn stays learnt."
      >
        <SampleNote>Sample catalogue — titles and prices are demo content</SampleNote>
      </PageHeader>

      <ProgramIndex courses={courses} />

      <section className="bg-bg-alt py-[var(--section-y)]" aria-labelledby="programs-school-cta">
        <div className="page-wrap flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">For schools</p>
            <h2 id="programs-school-cta" className="mt-3 max-w-[22ch] text-[length:var(--text-2xl)]">
              Bring a program to your staff room or auditorium.
            </h2>
            <p className="mt-3 max-w-[56ch] text-muted">
              Teacher development, parent seminars and student workshops can be arranged for your campus.
            </p>
          </div>
          <ButtonLink href="/contact" size="lg">
            Plan a school visit
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
