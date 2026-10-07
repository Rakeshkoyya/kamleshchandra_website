import type { Metadata } from "next";
import { Bookshelf } from "@/components/commerce/books/Bookshelf";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader, SampleNote } from "@/components/ui/misc";
import { getBooks } from "@/lib/data/books";

export const metadata: Metadata = {
  title: "Books",
  description: "Books by Kamlesh Chandra on memory, learning and inner growth — in paperback and ebook.",
};

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <>
      <PageHeader
        eyebrow="Books"
        title="Ideas you can keep on the shelf."
        lead="Short chapters, real exercises and a revision rhythm you can start tonight — in paperback and ebook."
      >
        <SampleNote>Working titles — covers are drawn placeholders, not final art</SampleNote>
      </PageHeader>

      <section aria-label="Bookshelf" className="page-wrap pb-[var(--section-y)]">
        <Bookshelf books={books} />
      </section>

      <section className="bg-bg-alt py-[var(--section-y)]" aria-labelledby="books-cta">
        <div className="page-wrap flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Go further</p>
            <h2 id="books-cta" className="mt-3 max-w-[24ch] text-[length:var(--text-2xl)]">
              Read the ideas, then practise them with him.
            </h2>
          </div>
          <ButtonLink href="/programs" size="lg">
            Explore programs
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
