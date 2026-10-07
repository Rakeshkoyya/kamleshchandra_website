import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseBuilder } from "@/components/studio/CourseBuilder";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { getAllCoursesForStudio, getCourse } from "@/lib/data/courses";

export async function generateStaticParams() {
  const courses = await getAllCoursesForStudio();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/studio/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  return { title: course ? `Edit · ${course.title}` : "Edit program" };
}

export default async function EditProgramPage({ params }: PageProps<"/studio/programs/[slug]">) {
  const { slug } = await params;
  // BACKEND: GET /api/admin/courses/{slug} (admin session required).
  const course = await getCourse(slug);
  if (!course) notFound();

  return (
    <>
      <StudioPageHeader eyebrow="Programs · Edit" title={course.title} lead="Changes in the demo studio are not saved." />
      <CourseBuilder initial={course} />
    </>
  );
}
