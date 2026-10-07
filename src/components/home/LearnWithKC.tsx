import Link from "next/link";
import { BookCover } from "@/components/ui/BookCover";
import { SampleNote } from "@/components/ui/misc";
import { AUDIENCE_LABEL, FORMAT_LABEL, getCourses } from "@/lib/data/courses";
import { getBooks, lowestPrice } from "@/lib/data/books";
import { formatInr } from "@/lib/format";

/* Chapter 5 — what you can take home: programs as an index, books on a shelf. */
export async function LearnWithKC() {
  const [courses, books] = await Promise.all([getCourses(), getBooks()]);

  return (
    <section aria-labelledby="learn-title" className="page-wrap py-[var(--section-y)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Programs & books</p>
          <h2 id="learn-title" className="mt-3 text-[length:var(--text-3xl)]">
            Learn with KC
          </h2>
        </div>
        <SampleNote>Sample catalogue for the demo</SampleNote>
      </div>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1.25fr_0.75fr]">
        <ol className="border-t border-line">
          {courses.map((c, i) => (
            <li key={c.slug} className="border-b border-line">
              <Link
                href={`/programs/${c.slug}`}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 transition-colors duration-[var(--dur-fast)] hover:bg-surface sm:px-3"
              >
                <span className="font-display text-lg text-recall-text tabular-nums">0{i + 1}</span>
                <span>
                  <span className="block font-display text-xl leading-snug font-semibold transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:translate-x-1 sm:text-2xl">
                    {c.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    For {c.audience.map((a) => AUDIENCE_LABEL[a]).join(", ")} · {FORMAT_LABEL[c.format]} · {c.durationLabel}
                  </span>
                </span>
                <span className="font-semibold tabular-nums">{formatInr(c.priceInr)}</span>
              </Link>
            </li>
          ))}
        </ol>

        <div>
          <div className="flex items-end justify-center gap-3 border-b-8 border-[color:var(--color-border)] px-2 pb-0">
            {books.map((b) => (
              <Link
                key={b.slug}
                href={`/books/${b.slug}`}
                className="block w-1/3 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-2"
                aria-label={`${b.title}, from ${formatInr(lowestPrice(b))}`}
              >
                <BookCover book={b} size="sm" />
              </Link>
            ))}
          </div>
          <p className="mt-6 font-display text-xl">Books for parents, teachers and anyone with a $10-trillion brain.</p>
          <Link href="/books" className="draw-link mt-3 inline-block font-semibold text-brand">
            Browse the bookshelf →
          </Link>
        </div>
      </div>
    </section>
  );
}
