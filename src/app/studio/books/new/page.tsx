import type { Metadata } from "next";
import { BookEditor } from "@/components/studio/BookEditor";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";

export const metadata: Metadata = { title: "New book" };

export default function NewBookPage() {
  return (
    <>
      <StudioPageHeader eyebrow="Books" title="New book" lead="Pick a tone and a cover line — the drawn cover updates as you type." />
      <BookEditor />
    </>
  );
}
