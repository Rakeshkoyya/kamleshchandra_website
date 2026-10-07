import type { Metadata } from "next";
import Link from "next/link";
import { PublishBadge } from "@/components/studio/StatusBadge";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { BookCover } from "@/components/ui/BookCover";
import { ButtonLink } from "@/components/ui/Button";
import { BOOK_FORMAT_LABEL, getAllBooksForStudio } from "@/lib/data/books";
import { formatInr } from "@/lib/format";

export const metadata: Metadata = { title: "Books" };

export default async function StudioBooksPage() {
  // BACKEND: GET /api/admin/books
  const books = await getAllBooksForStudio();

  return (
    <>
      <StudioPageHeader
        eyebrow="Catalogue"
        title="Books"
        lead="Editions, prices and stock. Covers are drawn until the designed artwork arrives."
        actions={<ButtonLink href="/studio/books/new">+ New book</ButtonLink>}
      />
      <ul className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {books.map((b) => (
          <li key={b.slug} className="flex gap-5 rounded-lg border border-line bg-surface p-5 shadow-1">
            <BookCover book={b} size="sm" className="w-24 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col">
              <PublishBadge status={b.status} />
              <h2 className="mt-2 text-lg leading-snug">{b.title}</h2>
              <ul className="mt-2 space-y-0.5 text-sm">
                {b.editions.map((e) => (
                  <li key={e.format} className="flex justify-between gap-3">
                    <span className="text-muted">
                      {BOOK_FORMAT_LABEL[e.format]}
                      {e.inStock ? "" : " · out of stock"}
                    </span>
                    <span className="tabular-nums">{formatInr(e.priceInr)}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/studio/books/${b.slug}`} className="mt-auto self-start pt-3 text-sm font-semibold text-brand hover:underline">
                Edit<span className="sr-only"> {b.title}</span> →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
