import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/journal/ArticleBody";
import { NewsletterSignup } from "@/components/content/journal/NewsletterSignup";
import { ShareButtons } from "@/components/content/journal/ShareButtons";
import { Photo } from "@/components/content/Photo";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { Badge, SampleNote } from "@/components/ui/misc";
import { getPost, getPosts } from "@/lib/data/posts";
import { formatDate } from "@/lib/format";

const KEEP_READING_COUNT = 3;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.publishedAt },
  };
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.status !== "published") notFound();

  const all = await getPosts();
  const index = all.findIndex((p) => p.slug === post.slug);
  // Next in the archive first (older), wrapping round to the newest.
  const others = [...all.slice(index + 1), ...all.slice(0, Math.max(index, 0))].slice(0, KEEP_READING_COUNT);
  const path = `/journal/${post.slug}`;

  return (
    <>
      <article>
        <header className="page-wrap pt-10 md:pt-16">
          <nav aria-label="Breadcrumb">
            <Link href="/journal" className="draw-link inline-flex min-h-10 items-center text-sm font-semibold text-brand">
              ← Journal
            </Link>
          </nav>
          <div className="mt-6 max-w-[48rem]">
            <div className="rise-in flex flex-wrap items-center gap-3 text-sm text-muted">
              <Badge tone="recall">{post.category}</Badge>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readMinutes} min read</span>
            </div>
            <h1 className="rise-in mt-5 text-[length:var(--text-3xl)]" style={{ ["--i" as string]: 1 }}>
              {post.title}
            </h1>
            <p className="rise-in mt-5 max-w-[56ch] font-display text-[length:var(--text-xl)] text-muted italic" style={{ ["--i" as string]: 2 }}>
              {post.excerpt}
            </p>
            <SampleNote className="mt-6">Sample article written for the demo</SampleNote>
          </div>
        </header>

        {post.image ? (
          <div className="page-wrap mt-10">
            <Photo
              src={post.image}
              alt=""
              sizes="(min-width: 1248px) 1200px, 100vw"
              isHero
              imgClassName="aspect-[16/9] rounded-lg object-cover sm:aspect-[21/9]"
            />
          </div>
        ) : null}

        <div className="page-wrap mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <ArticleBody blocks={post.body} />
          <aside aria-label="Share this piece" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <ShareButtons title={post.title} path={path} />
          </aside>
        </div>

        <footer className="page-wrap mt-12">
          <div className="flex max-w-[65ch] items-center gap-3 border-t border-line pt-6 text-sm text-muted">
            <RhythmMark className="w-10 text-brand" />
            Written by Kamlesh Chandra
          </div>
        </footer>
      </article>

      {others.length > 0 ? (
        <section aria-labelledby="keep-reading" className="page-wrap py-[var(--section-y)]">
          <h2 id="keep-reading" className="text-[length:var(--text-2xl)]">
            Keep reading
          </h2>
          <ol className="mt-6 grid gap-x-10 border-t border-line md:grid-cols-3 md:border-t-0">
            {others.map((p, i) => (
              <li key={p.slug} className="group relative border-b border-line py-6 md:border-t md:border-b-0">
                <p className="text-xs font-bold tracking-[0.12em] text-recall-text uppercase">
                  <span className="sr-only">Piece {i + 1}: </span>
                  {p.category}
                </p>
                <h3 className="mt-2 text-[length:var(--text-lg)]">
                  <Link href={`/journal/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-brand">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-muted">{p.readMinutes} min read</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <div className="page-wrap pb-[var(--section-y)]">
        <NewsletterSignup />
      </div>
    </>
  );
}
