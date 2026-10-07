import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookEditor } from "@/components/studio/BookEditor";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { getAllBooksForStudio, getBook } from "@/lib/data/books";

export async function generateStaticParams() {
  const books = await getAllBooksForStudio();
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/studio/books/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  return { title: book ? `Edit · ${book.title}` : "Edit book" };
}

export default async function EditBookPage({ params }: PageProps<"/studio/books/[slug]">) {
  const { slug } = await params;
  // BACKEND: GET /api/admin/books/{slug}
  const book = await getBook(slug);
  if (!book) notFound();

  return (
    <>
      <StudioPageHeader eyebrow="Books · Edit" title={book.title} lead="Changes in the demo studio are not saved." />
      <BookEditor initial={book} />
    </>
  );
}
