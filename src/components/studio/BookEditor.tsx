"use client";

import { useState } from "react";
import { BookCover } from "@/components/ui/BookCover";
import type { Book } from "@/lib/types";
import { hasErrors, priceError, SLUG_PATTERN, slugify } from "./editor-utils";
import { EditorActions } from "./EditorActions";
import { EditionsEditor } from "./EditionsEditor";
import type { EditionDraft } from "./EditionsEditor";
import { cardClass, describedBy, Field, inputClass } from "./fields";
import { ListEditor } from "./ListEditor";
import type { ListItem } from "./ListEditor";
import { useToast } from "./Toast";

type Tone = Book["coverTone"];
type FieldKey = "title" | "slug" | "blurb" | "coverLine" | "editions";

const TONES: { value: Tone; label: string; swatch: string }[] = [
  { value: "violet", label: "Violet", swatch: "var(--violet)" },
  { value: "marigold", label: "Marigold", swatch: "var(--marigold)" },
  { value: "ink", label: "Ink", swatch: "var(--ink)" },
  { value: "rose", label: "Rose", swatch: "var(--rose)" },
];

export function BookEditor({ initial }: { initial?: Book }) {
  const toast = useToast();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [isSlugEdited, setIsSlugEdited] = useState(Boolean(initial));
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [blurb, setBlurb] = useState(initial?.blurb ?? "");
  const [coverLine, setCoverLine] = useState(initial?.coverLine ?? "");
  const [tone, setTone] = useState<Tone>(initial?.coverTone ?? "violet");
  const [pages, setPages] = useState(initial ? String(initial.pages) : "");
  const [contents, setContents] = useState<ListItem[]>(() => (initial?.contents ?? []).map((text, i) => ({ id: `c${i}`, text })));
  const [editions, setEditions] = useState<EditionDraft[]>(
    () =>
      initial?.editions.map((e) => ({ id: `ed-${e.format}`, format: e.format, price: String(e.priceInr), inStock: e.inStock })) ?? [
        { id: "ed-paperback", format: "paperback", price: "", inStock: true },
      ],
  );
  const [status, setStatus] = useState<Book["status"]>(initial?.status ?? "draft");
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  function save(nextStatus: Book["status"]) {
    const found: Partial<Record<FieldKey, string>> = {
      title: title.trim().length < 2 ? "Give the book a title." : undefined,
      slug: SLUG_PATTERN.test(slug) ? undefined : "Use lowercase letters, numbers and hyphens.",
      blurb: nextStatus !== "draft" && blurb.trim().length < 40 ? "Write a blurb of at least 40 characters." : undefined,
      coverLine: coverLine.length > 32 ? "Keep the cover line under 32 characters so it fits." : undefined,
      editions:
        editions.length === 0
          ? "Add at least one edition."
          : editions.map((e) => priceError(e.price)).find(Boolean),
    };
    setErrors(found);
    if (hasErrors(found)) {
      toast("Please fix the highlighted fields.", "danger");
      return;
    }
    // BACKEND: POST/PUT /api/admin/books { …fields, editions, contents, status }
    setStatus(nextStatus);
    toast(nextStatus === "draft" ? "Draft saved (demo — not persisted)." : `“${title}” is ${nextStatus === "pre-order" ? "open for pre-order" : "live"} (demo).`);
  }

  const errorCount = Object.values(errors).filter(Boolean).length;
  const hasStock = editions.some((e) => e.inStock);

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section className={`${cardClass} grid gap-5 sm:grid-cols-2`} aria-labelledby="book-basics">
            <h2 id="book-basics" className="text-xl sm:col-span-2">
              The book
            </h2>
            <Field id="b-title" label="Title" error={errors.title} className="sm:col-span-2">
              <input
                id="b-title"
                className={`${inputClass} font-display text-lg`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!isSlugEdited) setSlug(slugify(e.target.value));
                }}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={describedBy("b-title", undefined, errors.title)}
              />
            </Field>
            <Field id="b-slug" label="URL slug" hint={`/books/${slug || "…"}`} error={errors.slug}>
              <input
                id="b-slug"
                className={`${inputClass} font-mono text-sm`}
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  setIsSlugEdited(true);
                }}
                aria-invalid={Boolean(errors.slug)}
                aria-describedby={describedBy("b-slug", "hint", errors.slug)}
              />
            </Field>
            <Field id="b-pages" label="Pages">
              <input id="b-pages" inputMode="numeric" className={`${inputClass} tabular-nums`} value={pages} onChange={(e) => setPages(e.target.value.replace(/\D/g, ""))} />
            </Field>
            <Field id="b-sub" label="Subtitle" className="sm:col-span-2">
              <input id="b-sub" className={inputClass} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </Field>
            <Field id="b-blurb" label="Blurb" hint="The back-cover paragraph." error={errors.blurb} className="sm:col-span-2">
              <textarea
                id="b-blurb"
                rows={4}
                className={inputClass}
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
                aria-invalid={Boolean(errors.blurb)}
                aria-describedby={describedBy("b-blurb", "hint", errors.blurb)}
              />
            </Field>
          </section>

          <section className={cardClass} aria-label="Editions">
            <EditionsEditor editions={editions} onChange={setEditions} error={errors.editions} />
          </section>

          <section className={cardClass} aria-label="Contents">
            <ListEditor id="b-contents" label="Chapters" items={contents} onChange={setContents} placeholder="Chapter title" />
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <section className={cardClass} aria-labelledby="cover-title">
            <h2 id="cover-title" className="text-xl">
              Cover
            </h2>
            <div className="mx-auto mt-4 w-44">
              <BookCover book={{ title: title || "Untitled", coverLine: coverLine || "Your cover line", coverTone: tone }} />
            </div>
            <Field id="b-line" label="Cover line" hint={`${coverLine.length}/32 · handwritten line on the cover`} error={errors.coverLine} className="mt-5">
              <input
                id="b-line"
                className={inputClass}
                value={coverLine}
                onChange={(e) => setCoverLine(e.target.value)}
                aria-invalid={Boolean(errors.coverLine)}
                aria-describedby={describedBy("b-line", "hint", errors.coverLine)}
              />
            </Field>
            <fieldset className="mt-4">
              <legend className="text-sm font-semibold">Tone</legend>
              <div className="mt-2 flex gap-3">
                {TONES.map((t) => (
                  <label key={t.value} className="cursor-pointer text-center text-xs">
                    <input type="radio" name="tone" value={t.value} checked={tone === t.value} onChange={() => setTone(t.value)} className="peer sr-only" />
                    <span
                      className="block h-10 w-10 rounded-full ring-offset-2 ring-offset-surface peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:ring-3 peer-focus-visible:ring-recall-text"
                      style={{ background: t.swatch }}
                      aria-hidden="true"
                    />
                    <span className="mt-1 block text-muted peer-checked:font-semibold peer-checked:text-ink">{t.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>
        </aside>
      </div>

      <EditorActions
        status={status}
        backHref="/studio/books"
        onSaveDraft={() => save("draft")}
        onPublish={() => save(hasStock ? "published" : "pre-order")}
        publishLabel={hasStock ? "Publish" : "Open pre-orders"}
        errorSummary={errorCount ? `${errorCount} field${errorCount > 1 ? "s" : ""} need attention.` : undefined}
      />
    </form>
  );
}
