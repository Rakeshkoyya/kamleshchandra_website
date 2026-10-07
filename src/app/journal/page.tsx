import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterSignup } from "@/components/content/journal/NewsletterSignup";
import { PostIndex } from "@/components/content/journal/PostIndex";
import { Photo } from "@/components/content/Photo";
import { PageHeader, SampleNote } from "@/components/ui/misc";
import { getPosts } from "@/lib/data/posts";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Journal",
  description: "Writing by Kamlesh Chandra on memory, teaching, parenting and inner growth.",
};

export default async function JournalPage() {
  const posts = await getPosts();
  const [featured] = posts;
  const summaries = posts.map(({ slug, title, category, publishedAt, readMinutes }) => ({
    slug,
    title,
    category,
    publishedAt,
    readMinutes,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Notes on remembering"
        lead="Short pieces on how memory works, how children learn, and how to keep growing — for students, parents and teachers."
      >
        <SampleNote>Sample posts for the demo — to be replaced with KC’s own writing</SampleNote>
      </PageHeader>

      {featured ? (
        <section aria-labelledby="featured-title" className="page-wrap">
          <article className="group relative grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-14">
            {featured.image ? (
              <Photo
                src={featured.image}
                alt=""
                sizes="(min-width: 1024px) 58vw, 100vw"
                isHero
                imgClassName="aspect-[4/3] rounded-lg object-cover shadow-1 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.01]"
              />
            ) : null}
            <div>
              <p className="eyebrow">Latest · {featured.category}</p>
              <h2 id="featured-title" className="mt-3 text-[length:var(--text-3xl)]">
                <Link href={`/journal/${featured.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:text-brand">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-5 text-lg text-muted">{featured.excerpt}</p>
              <p className="mt-6 text-sm text-muted">
                <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time> ·{" "}
                {featured.readMinutes} min read
              </p>
              <p className="mt-6 font-semibold text-brand" aria-hidden="true">
                Read the piece →
              </p>
            </div>
          </article>
        </section>
      ) : null}

      <section aria-labelledby="index-title" className="page-wrap py-[var(--section-y)]">
        <h2 id="index-title" className="mb-6 text-[length:var(--text-2xl)]">
          The index
        </h2>
        <PostIndex posts={summaries} />
      </section>

      <div className="page-wrap pb-[var(--section-y)]">
        <NewsletterSignup />
      </div>
    </>
  );
}
