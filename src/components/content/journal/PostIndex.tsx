"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

type PostSummary = Pick<Post, "slug" | "title" | "category" | "publishedAt" | "readMinutes">;

type Props = {
  posts: PostSummary[];
};

const ALL = "All";

/** The journal index: category chips (local state) over a dated list. */
export function PostIndex({ posts }: Props) {
  const [category, setCategory] = useState<string>(ALL);
  const categories = [ALL, ...Array.from(new Set(posts.map((p) => p.category)))];
  const visible = category === ALL ? posts : posts.filter((p) => p.category === category);
  const countLabel = `${visible.length} ${visible.length === 1 ? "piece" : "pieces"}${category === ALL ? "" : ` in ${category}`}`;

  return (
    <div>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isActive = c === category;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={isActive}
              onClick={() => setCategory(c)}
              className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-[background-color,color,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-out)] ${
                isActive ? "bg-ink text-paper" : "bg-surface text-ink ring-1 ring-line hover:ring-brand hover:text-brand"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-4 text-sm text-muted">
        {countLabel}
      </p>

      <ol className="mt-4 border-t border-line">
        {visible.map((p) => (
          <li key={p.slug} className="group relative border-b border-line">
            <div className="grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[8.5rem_8rem_minmax(0,1fr)_auto] sm:items-baseline">
              <time dateTime={p.publishedAt} className="text-sm text-muted tabular-nums">
                {formatDate(p.publishedAt)}
              </time>
              <span className="text-xs font-bold tracking-[0.12em] text-recall-text uppercase">{p.category}</span>
              <h3 className="text-[length:var(--text-lg)]">
                <Link
                  href={`/journal/${p.slug}`}
                  className="draw-link after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
                >
                  {p.title}
                </Link>
              </h3>
              <span className="text-sm text-muted">{p.readMinutes} min read</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
