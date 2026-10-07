import type { Metadata } from "next";
import { CourseBuilder } from "@/components/studio/CourseBuilder";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";

export const metadata: Metadata = { title: "New program" };

export default function NewProgramPage() {
  return (
    <>
      <StudioPageHeader
        eyebrow="Programs"
        title="New program"
        lead="Shape the promise, the outcomes and the lessons. Save a draft any time; publishing needs every section."
      />
      <CourseBuilder />
    </>
  );
}
