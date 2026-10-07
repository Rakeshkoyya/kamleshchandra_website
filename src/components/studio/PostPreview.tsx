import type { Post } from "@/lib/types";

/** Splits editor text into blocks: blank line = new paragraph. */
export function toBlocks(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
}

/** Renders blocks with the journal's rules: "## " → h2, "> " → blockquote, else paragraph. */
export function PostBody({ blocks }: { blocks: string[] }) {
  return (
    <div className="prose-kc">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) return <h2 key={i}>{b.slice(3)}</h2>;
        if (b.startsWith("> ")) return <blockquote key={i}>{b.slice(2)}</blockquote>;
        return <p key={i}>{b}</p>;
      })}
    </div>
  );
}

type Props = { title: string; category: Post["category"]; excerpt: string; body: string; readMinutes: number };

export function PostPreview({ title, category, excerpt, body, readMinutes }: Props) {
  const blocks = toBlocks(body);
  return (
    <article className="rounded-lg border border-line bg-surface p-6 shadow-1 md:p-8">
      <p className="eyebrow">
        {category} · {readMinutes} min read
      </p>
      <h2 className="mt-2 text-[length:var(--text-2xl)]">{title || "Untitled post"}</h2>
      {excerpt ? <p className="mt-3 text-lg text-muted">{excerpt}</p> : null}
      <div className="mt-6 border-t border-line pt-4">
        {blocks.length ? <PostBody blocks={blocks} /> : <p className="text-muted">Start writing — the preview follows.</p>}
      </div>
    </article>
  );
}
