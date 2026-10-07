import Link from "next/link";
import { BookCover } from "@/components/ui/BookCover";
import { Badge } from "@/components/ui/misc";
import { lowestPrice } from "@/lib/data/books";
import { formatInr } from "@/lib/format";
import type { Book } from "@/lib/types";

type Props = {
  books: Book[];
};

/* Covers stand on a drawn shelf; text sits below the plank like a library label. */
export function Bookshelf({ books }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book, i) => (
        <li key={book.slug} className="rise-in group relative" style={{ ["--i" as string]: i }}>
          <div className="relative px-8 pt-6 sm:px-10">
            <BookCover
              book={book}
              className="mx-auto max-w-56 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:-translate-y-2 group-hover:-rotate-1"
            />
            {/* the shelf plank */}
            <div className="relative -mx-8 h-3 rounded-sm bg-line shadow-1 sm:-mx-10" aria-hidden="true" />
            <div className="-mx-8 h-4 bg-bg-alt sm:-mx-10" aria-hidden="true" />
          </div>
          <div className="mt-5 px-2 text-center">
            {book.status === "pre-order" ? <Badge tone="recall">Pre-order</Badge> : null}
            <h2 className="mt-2 text-xl">
              <Link href={`/books/${book.slug}`} className="draw-link after:absolute after:inset-0 after:content-['']">
                {book.title}
              </Link>
            </h2>
            <p className="mx-auto mt-1 max-w-[34ch] text-sm text-muted">{book.subtitle}</p>
            <p className="mt-3 text-sm">
              <span className="text-muted">from </span>
              <span className="font-display text-lg font-semibold">{formatInr(lowestPrice(book))}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
