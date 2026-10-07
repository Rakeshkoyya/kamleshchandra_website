import Link from "next/link";
import { BookCover } from "@/components/ui/BookCover";
import { Badge, SampleNote } from "@/components/ui/misc";
import type { Book } from "@/lib/types";
import { EbookDownloadButton } from "./EbookDownloadButton";

export type OwnedBook = {
  book: Book;
  format: "ebook" | "paperback";
  /** Paperback shipping progress — index into SHIP_STEPS */
  shipStep?: number;
  tracking?: string;
};

const SHIP_STEPS = ["Ordered", "Packed", "Shipped", "Delivered"] as const;

function ShippingTrack({ step, tracking }: { step: number; tracking?: string }) {
  return (
    <div>
      <ol className="mt-3 flex items-center gap-1" aria-label={`Shipping status: ${SHIP_STEPS[step]}`}>
        {SHIP_STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col gap-1.5">
            <span aria-hidden="true" className={`h-1.5 rounded-full ${i <= step ? "bg-recall" : "bg-bg-alt"}`} />
            <span className={`text-[0.7rem] ${i === step ? "font-semibold text-ink" : "text-muted"}`}>
              {s}
              {i === step ? <span className="sr-only"> (current)</span> : null}
            </span>
          </li>
        ))}
      </ol>
      {tracking ? <p className="mt-2 text-xs text-muted">India Post · {tracking}</p> : null}
    </div>
  );
}

export function MyBooks({ owned }: { owned: OwnedBook[] }) {
  return (
    <div>
      <SampleNote>Sample library for the demo learner</SampleNote>
      <ul className="mt-5 grid gap-5 sm:grid-cols-2">
        {owned.map(({ book, format, shipStep, tracking }) => (
          <li key={`${book.slug}-${format}`} className="flex gap-5 rounded-lg border border-line bg-surface p-5 shadow-1">
            <Link href={`/books/${book.slug}`} className="w-24 shrink-0" tabIndex={-1} aria-hidden="true">
              <BookCover book={book} size="sm" />
            </Link>
            <div className="min-w-0 flex-1">
              <Badge tone={format === "ebook" ? "brand" : "recall"}>{format === "ebook" ? "eBook" : "Paperback"}</Badge>
              <h3 className="mt-2 text-lg leading-snug">
                <Link href={`/books/${book.slug}`} className="hover:text-brand">
                  {book.title}
                </Link>
              </h3>
              {format === "ebook" ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <EbookDownloadButton title={book.title} format="PDF" />
                  <EbookDownloadButton title={book.title} format="EPUB" />
                </div>
              ) : (
                <ShippingTrack step={shipStep ?? 0} tracking={tracking} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
