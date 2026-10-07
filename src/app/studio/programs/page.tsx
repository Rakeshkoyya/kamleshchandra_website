import type { Metadata } from "next";
import Link from "next/link";
import { cellClass, DataTable } from "@/components/studio/DataTable";
import { PublishBadge } from "@/components/studio/StatusBadge";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { courseLessonCount, FORMAT_LABEL, getAllCoursesForStudio } from "@/lib/data/courses";
import { formatInr } from "@/lib/format";

export const metadata: Metadata = { title: "Programs" };

/* SAMPLE enrolment counts. BACKEND: include `enrolmentCount` in GET /api/admin/courses. */
const SAMPLE_ENROLMENTS: Record<string, number> = {
  "memory-mastery-for-students": 1284,
  "parenting-the-learning-brain": 342,
  "neuroeducation-for-teachers": 187,
  "inner-growth-life-design": 596,
};

export default async function StudioProgramsPage() {
  const courses = await getAllCoursesForStudio();

  return (
    <>
      <StudioPageHeader
        eyebrow="Catalogue"
        title="Programs"
        lead="Courses, live cohorts and in-person intensives. Drafts stay off the public site."
        actions={<ButtonLink href="/studio/programs/new">+ New program</ButtonLink>}
      />
      <DataTable caption="All programs" head={["Program", "Format", "Status", "Price", "Enrolments", <span key="a" className="sr-only">Actions</span>]}>
        {courses.map((c) => (
          <tr key={c.slug} className="hover:bg-bg-alt/40">
            <td className={cellClass}>
              <p className="font-display text-base font-semibold">{c.title}</p>
              <p className="text-xs text-muted">
                {courseLessonCount(c)} lessons · {c.level} · {c.language}
              </p>
            </td>
            <td className={`${cellClass} text-muted`}>{FORMAT_LABEL[c.format]}</td>
            <td className={cellClass}>
              <PublishBadge status={c.status} />
            </td>
            <td className={`${cellClass} tabular-nums`}>
              {formatInr(c.priceInr)}
              {c.compareAtInr ? <s className="ml-2 text-xs text-muted">{formatInr(c.compareAtInr)}</s> : null}
            </td>
            <td className={`${cellClass} tabular-nums`}>{(SAMPLE_ENROLMENTS[c.slug] ?? 0).toLocaleString("en-IN")}</td>
            <td className={`${cellClass} text-right`}>
              <Link href={`/studio/programs/${c.slug}`} className="font-semibold text-brand hover:underline">
                Edit<span className="sr-only"> {c.title}</span>
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
