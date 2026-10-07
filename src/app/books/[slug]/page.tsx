import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditionPicker } from "@/components/commerce/books/EditionPicker";
import { BookCover } from "@/components/ui/BookCover";
import { Badge, SampleNote } from "@/components/ui/misc";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { BOOK_FORMAT_LABEL, getBook, getBooks } from "@/lib/data/books";

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/books/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return { title: "Book not found" };
  return { title: book.title, description: book.subtitle };
}

export default async function BookPage({ params }: PageProps<"/books/[slug]">) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book || book.status === "draft") notFound();

  const formats = book.editions.map((e) => BOOK_FORMAT_LABEL[e.format]).join(", ");

  return (
    <>
      <div className="page-wrap pt-8">
        <Link href="/books" className="inline-flex min-h-10 items-center text-sm font-semibold text-brand hover:underline">
          ← All books
        </Link>
      </div>

      <article className="page-wrap grid gap-12 pt-6 pb-[var(--section-y)] md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="rise-in md:sticky md:top-[calc(var(--header-h)+2rem)] md:self-start">
          <div className="rounded-lg bg-bg-alt px-10 py-12 md:px-12 md:py-14">
            <BookCover book={book} size="lg" className="mx-auto max-w-72" />
          </div>
        </div>

        <div className="min-w-0">
          <div className="rise-in flex flex-wrap items-center gap-2" style={{ ["--i" as string]: 1 }}>
            <p className="eyebrow">Book</p>
            {book.status === "pre-order" ? <Badge tone="recall">Pre-order</Badge> : null}
          </div>
          <h1 className="rise-in mt-3 text-[length:var(--text-3xl)]" style={{ ["--i" as string]: 1 }}>
            {book.title}
          </h1>
          <p className="rise-in mt-3 font-display text-xl text-muted italic" style={{ ["--i" as string]: 2 }}>
            {book.subtitle}
          </p>
          <p className="rise-in mt-6 max-w-[60ch] text-lg" style={{ ["--i" as string]: 3 }}>
            {book.blurb}
          </p>

          <div className="mt-10 rounded-lg bg-surface p-6 shadow-1 ring-1 ring-line md:p-8">
            {/* BACKEND: stock and prices should come from inventory at render time. */}
            <EditionPicker book={book} />
          </div>
          <SampleNote className="mt-4">Sample title — prices and stock are demo data</SampleNote>

          <section aria-labelledby="contents-title" className="mt-14">
            <h2 id="contents-title" className="text-[length:var(--text-xl)]">
              Inside the book
            </h2>
            <ol className="mt-5 divide-y divide-line border-y border-line">
              {book.contents.map((c, i) => (
                <li key={c} className="flex items-baseline gap-4 py-3">
                  <span className="w-8 font-display text-recall-text tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span>{c}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="details-title" className="mt-12">
            <h2 id="details-title" className="text-[length:var(--text-xl)]">
              Details
            </h2>
            <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { k: "Pages", v: String(book.pages) },
                { k: "Language", v: book.language },
                { k: "Formats", v: formats },
                { k: "Author", v: "Kamlesh Chandra" },
              ].map((d) => (
                <div key={d.k} className="border-l-2 border-recall pl-3">
                  <dt className="text-sm text-muted">{d.k}</dt>
                  <dd className="font-semibold">{d.v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <aside className="mt-14 flex items-start gap-4 rounded-lg bg-brand-soft p-6">
            <RhythmMark className="mt-1 w-10 shrink-0 text-brand" />
            <p>
              Want to practise the ideas with a guide?{" "}
              <Link href="/programs" className="font-semibold text-brand underline underline-offset-2">
                See the programs
              </Link>
              .
            </p>
          </aside>
        </div>
      </article>
    </>
  );
}
