"use client";

import { useRef, useState } from "react";
import type { Post } from "@/lib/types";
import { hasErrors } from "./editor-utils";
import { EditorActions } from "./EditorActions";
import { cardClass, describedBy, Field, inputClass } from "./fields";
import { PostPreview, toBlocks } from "./PostPreview";
import { useToast } from "./Toast";

const CATEGORIES: Post["category"][] = ["Memory", "Parenting", "Teaching", "Inner growth", "Announcements"];
const WORDS_PER_MINUTE = 200;
type FieldKey = "title" | "excerpt" | "body" | "schedule";

/** "2026-09-28T07:00:00+05:30" → "2026-09-28T07:00" for <input type="datetime-local"> (IST). */
function toLocalInput(iso?: string): string {
  return iso ? iso.slice(0, 16) : "";
}

const toolBtn = "rounded-sm px-3 py-1.5 text-sm font-semibold hover:bg-brand-soft hover:text-brand";

export function PostEditor({ initial }: { initial?: Post }) {
  const toast = useToast();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<Post["category"]>(initial?.category ?? "Memory");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body.join("\n\n") ?? "");
  const [publishAt, setPublishAt] = useState(toLocalInput(initial?.publishedAt));
  const [status, setStatus] = useState<Post["status"]>(initial?.status ?? "draft");
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const readMinutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

  /** Toggles a block prefix ("## " or "> ") on the line holding the cursor. */
  function applyPrefix(prefix: "## " | "> ") {
    const el = bodyRef.current;
    if (!el) return;
    const pos = el.selectionStart;
    const lineStart = body.lastIndexOf("\n", pos - 1) + 1;
    const rest = body.slice(lineStart);
    const existing = rest.startsWith("## ") ? "## " : rest.startsWith("> ") ? "> " : "";
    const replacement = existing === prefix ? "" : prefix;
    const next = body.slice(0, lineStart) + replacement + rest.slice(existing.length);
    setBody(next);
    const caret = pos + replacement.length - existing.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  }

  function save(intent: "draft" | "publish") {
    const when = publishAt ? new Date(`${publishAt}:00+05:30`) : null;
    const isFuture = when !== null && when.getTime() > Date.now();
    const found: Partial<Record<FieldKey, string>> = {
      title: title.trim().length < 4 ? "Give the post a title." : undefined,
      excerpt: intent === "publish" && excerpt.trim().length < 20 ? "Write an excerpt of at least 20 characters." : undefined,
      body: intent === "publish" && toBlocks(body).length < 2 ? "Write at least two paragraphs." : undefined,
      schedule: when && Number.isNaN(when.getTime()) ? "Pick a valid date and time." : undefined,
    };
    setErrors(found);
    if (hasErrors(found)) {
      toast("Please fix the highlighted fields.", "danger");
      return;
    }
    // BACKEND: POST/PUT /api/admin/posts { title, category, excerpt, body: toBlocks(body), publishAt, status }
    const next: Post["status"] = intent === "draft" ? "draft" : isFuture ? "scheduled" : "published";
    setStatus(next);
    toast(
      next === "draft"
        ? "Draft saved (demo — not persisted)."
        : next === "scheduled"
          ? `Scheduled for ${publishAt.replace("T", " at ")} IST (demo).`
          : "Published to the journal (demo).",
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <div className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-6">
          <section className={`${cardClass} grid gap-5 sm:grid-cols-2`} aria-label="Post details">
            <Field id="p-title" label="Title" error={errors.title} className="sm:col-span-2">
              <input
                id="p-title"
                className={`${inputClass} font-display text-lg`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={describedBy("p-title", undefined, errors.title)}
              />
            </Field>
            <Field id="p-cat" label="Category">
              <select id="p-cat" className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as Post["category"])}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field id="p-when" label="Publish date & time (IST)" hint="Leave empty to publish now." error={errors.schedule}>
              <input
                id="p-when"
                type="datetime-local"
                className={inputClass}
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
                aria-invalid={Boolean(errors.schedule)}
                aria-describedby={describedBy("p-when", "hint", errors.schedule)}
              />
            </Field>
            <Field id="p-excerpt" label="Excerpt" hint="One or two sentences for cards and social shares." error={errors.excerpt} className="sm:col-span-2">
              <textarea
                id="p-excerpt"
                rows={2}
                className={inputClass}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                aria-invalid={Boolean(errors.excerpt)}
                aria-describedby={describedBy("p-excerpt", "hint", errors.excerpt)}
              />
            </Field>
          </section>

          <section className={cardClass} aria-label="Body">
            <Field id="p-body" label="Body" hint="Blank line = new paragraph. ## for a subheading, > for a quote." error={errors.body}>
              <div className="overflow-hidden rounded-md border border-line-strong focus-within:border-brand focus-within:ring-2 focus-within:ring-recall-text">
                <div role="toolbar" aria-label="Formatting" aria-controls="p-body" className="flex items-center gap-1 border-b border-line bg-bg-alt px-2 py-1.5">
                  <button type="button" className={toolBtn} onClick={() => applyPrefix("## ")} aria-label="Make line a subheading">
                    H2
                  </button>
                  <button type="button" className={`${toolBtn} font-display italic`} onClick={() => applyPrefix("> ")} aria-label="Make line a quote">
                    “ Quote
                  </button>
                  <span className="ml-auto text-xs text-muted tabular-nums">
                    {words} words · {readMinutes} min
                  </span>
                </div>
                <textarea
                  id="p-body"
                  ref={bodyRef}
                  rows={16}
                  className="block w-full resize-y bg-surface px-4 py-3 font-mono text-sm leading-relaxed focus:outline-none"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  aria-invalid={Boolean(errors.body)}
                  aria-describedby={describedBy("p-body", "hint", errors.body)}
                />
              </div>
            </Field>
          </section>
        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start" aria-label="Live preview">
          <p className="eyebrow mb-3">Live preview</p>
          <PostPreview title={title} category={category} excerpt={excerpt} body={body} readMinutes={readMinutes} />
        </aside>
      </div>

      <EditorActions
        status={status}
        backHref="/studio/journal"
        onSaveDraft={() => save("draft")}
        onPublish={() => save("publish")}
        publishLabel={publishAt ? "Schedule / publish" : "Publish now"}
        errorSummary={errorCount ? `${errorCount} field${errorCount > 1 ? "s" : ""} need attention.` : undefined}
      />
    </form>
  );
}
