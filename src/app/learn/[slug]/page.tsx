import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePlayer } from "@/components/account/CoursePlayer";
import { getEnrolments } from "@/lib/data/account";
import { getCourse, getCourses } from "@/lib/data/courses";

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  return {
    title: course ? `Learn · ${course.title}` : "Course player",
    robots: { index: false },
  };
}

export default async function LearnPage({ params }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  // BACKEND: require a session and an active enrolment for this course; otherwise redirect to /signin or /programs/[slug].
  const [course, enrolments] = await Promise.all([getCourse(slug), getEnrolments()]);
  if (!course) notFound();
  const enrolment = enrolments.find((e) => e.courseSlug === slug);

  return <CoursePlayer course={course} startLessonId={enrolment?.lastLessonId} />;
}
