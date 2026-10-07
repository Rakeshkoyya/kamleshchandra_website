"use client";

import { useState } from "react";
import { AUDIENCE_LABEL, FORMAT_LABEL } from "@/lib/data/courses";
import type { Audience, Course, Module } from "@/lib/types";
import { CoursePreviewCard } from "./CoursePreviewCard";
import { CoverDropzone } from "./CoverDropzone";
import { hasErrors, parseInr, priceError, SLUG_PATTERN, slugify } from "./editor-utils";
import { EditorActions } from "./EditorActions";
import { cardClass, describedBy, Field, inputClass } from "./fields";
import { ListEditor } from "./ListEditor";
import type { ListItem } from "./ListEditor";
import { ModuleBuilder } from "./ModuleBuilder";
import { useToast } from "./Toast";

type Status = Course["status"];
type FieldKey = "title" | "slug" | "subtitle" | "audience" | "price" | "compareAt" | "outcomes" | "modules";

const AUDIENCES = Object.keys(AUDIENCE_LABEL) as Audience[];
const FORMATS = Object.keys(FORMAT_LABEL) as Course["format"][];
const LEVELS: Course["level"][] = ["Foundation", "Intermediate", "Advanced"];

function validate(d: {
  title: string;
  slug: string;
  subtitle: string;
  audience: Audience[];
  price: string;
  compareAt: string;
  outcomes: ListItem[];
  modules: Module[];
}): Partial<Record<FieldKey, string>> {
  const price = parseInr(d.price);
  const compare = parseInr(d.compareAt);
  const lessons = d.modules.flatMap((m) => m.lessons);
  return {
    title: d.title.trim().length < 4 ? "Give the program a title (at least 4 characters)." : undefined,
    slug: SLUG_PATTERN.test(d.slug) ? undefined : "Use lowercase letters, numbers and hyphens.",
    subtitle: d.subtitle.length > 180 ? "Keep the subtitle under 180 characters." : undefined,
    audience: d.audience.length === 0 ? "Pick at least one audience." : undefined,
    price: priceError(d.price),
    compareAt:
      priceError(d.compareAt, { isRequired: false }) ??
      (compare !== null && price !== null && compare <= price ? "Compare-at should be higher than the price." : undefined),
    outcomes: d.outcomes.filter((o) => o.text.trim()).length === 0 ? "Add at least one outcome." : undefined,
    modules:
      lessons.length === 0
        ? "Add at least one module with a lesson."
        : d.modules.some((m) => !m.title.trim()) || lessons.some((l) => !l.title.trim() || l.minutes <= 0)
          ? "Every module and lesson needs a title, and each lesson some minutes."
          : undefined,
  };
}

export function CourseBuilder({ initial }: { initial?: Course }) {
  const toast = useToast();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [isSlugEdited, setIsSlugEdited] = useState(Boolean(initial));
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [audience, setAudience] = useState<Audience[]>(initial?.audience ?? []);
  const [format, setFormat] = useState<Course["format"]>(initial?.format ?? "self-paced");
  const [level, setLevel] = useState<Course["level"]>(initial?.level ?? "Foundation");
  const [price, setPrice] = useState(initial ? String(initial.priceInr) : "");
  const [compareAt, setCompareAt] = useState(initial?.compareAtInr ? String(initial.compareAtInr) : "");
  const [language, setLanguage] = useState(initial?.language ?? "Hindi & English");
  const [outcomes, setOutcomes] = useState<ListItem[]>(() => (initial?.outcomes ?? []).map((text, i) => ({ id: `o${i}`, text })));
  const [modules, setModules] = useState<Module[]>(
    initial?.modules ?? [{ id: "m-new", title: "", lessons: [{ id: "l-new", title: "", minutes: 10, isPreview: true }] }],
  );
  const [coverUrl, setCoverUrl] = useState<string | null>(initial?.image ?? null);
  const [status, setStatus] = useState<Status>(initial?.status ?? "draft");
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const lessonCount = modules.reduce((n, m) => n + m.lessons.length, 0);
  const minutes = modules.reduce((n, m) => n + m.lessons.reduce((s, l) => s + l.minutes, 0), 0);

  function handleTitle(value: string) {
    setTitle(value);
    if (!isSlugEdited) setSlug(slugify(value));
  }

  function save(nextStatus: Status) {
    const found = validate({ title, slug, subtitle, audience, price, compareAt, outcomes, modules });
    // Drafts may be incomplete; only a title is required to save one.
    const blocking = nextStatus === "draft" ? { title: found.title, slug: found.slug } : found;
    setErrors(blocking);
    if (hasErrors(blocking)) {
      toast("Please fix the highlighted fields.", "danger");
      return;
    }
    // BACKEND: POST/PUT /api/admin/courses { …fields, modules, coverAssetId, status: nextStatus }
    setStatus(nextStatus);
    toast(nextStatus === "published" ? `“${title}” is live on /programs (demo).` : "Draft saved (demo — not persisted).");
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <section className={`${cardClass} grid gap-5 sm:grid-cols-2`} aria-labelledby="basics-title">
            <h2 id="basics-title" className="text-xl sm:col-span-2">
              Basics
            </h2>
            <Field id="c-title" label="Title" error={errors.title} className="sm:col-span-2">
              <input
                id="c-title"
                className={`${inputClass} font-display text-lg`}
                value={title}
                onChange={(e) => handleTitle(e.target.value)}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={describedBy("c-title", undefined, errors.title)}
                placeholder="e.g. Memory Mastery for Students"
              />
            </Field>
            <Field id="c-slug" label="URL slug" hint={`kamleshchandra.com/programs/${slug || "…"}`} error={errors.slug} className="sm:col-span-2">
              <input
                id="c-slug"
                className={`${inputClass} font-mono text-sm`}
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  setIsSlugEdited(true);
                }}
                aria-invalid={Boolean(errors.slug)}
                aria-describedby={describedBy("c-slug", "hint", errors.slug)}
              />
            </Field>
            <Field id="c-sub" label="Subtitle" hint={`${subtitle.length}/180`} error={errors.subtitle} className="sm:col-span-2">
              <textarea
                id="c-sub"
                rows={2}
                className={inputClass}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                aria-invalid={Boolean(errors.subtitle)}
                aria-describedby={describedBy("c-sub", "hint", errors.subtitle)}
              />
            </Field>
            <fieldset className="sm:col-span-2" aria-describedby={errors.audience ? "c-aud-error" : undefined}>
              <legend className="text-sm font-semibold">Audience</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {AUDIENCES.map((a) => {
                  const isOn = audience.includes(a);
                  return (
                    <label
                      key={a}
                      className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-recall-text ${
                        isOn ? "bg-brand-soft text-brand ring-brand" : "ring-line-strong hover:ring-brand"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isOn}
                        onChange={(e) => setAudience((cur) => (e.target.checked ? [...cur, a] : cur.filter((x) => x !== a)))}
                      />
                      <span aria-hidden="true">{isOn ? "✓" : "+"}</span>
                      {AUDIENCE_LABEL[a]}
                    </label>
                  );
                })}
              </div>
              {errors.audience ? (
                <p id="c-aud-error" className="mt-1.5 text-sm font-medium text-danger">
                  {errors.audience}
                </p>
              ) : null}
            </fieldset>
            <Field id="c-format" label="Format">
              <select id="c-format" className={inputClass} value={format} onChange={(e) => setFormat(e.target.value as Course["format"])}>
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {FORMAT_LABEL[f]}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="c-level" label="Level">
              <select id="c-level" className={inputClass} value={level} onChange={(e) => setLevel(e.target.value as Course["level"])}>
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field id="c-price" label="Price (₹)" error={errors.price}>
              <input
                id="c-price"
                inputMode="numeric"
                className={`${inputClass} tabular-nums`}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={describedBy("c-price", undefined, errors.price)}
                placeholder="2499"
              />
            </Field>
            <Field id="c-compare" label="Compare-at price (₹)" hint="Optional — shown struck through." error={errors.compareAt}>
              <input
                id="c-compare"
                inputMode="numeric"
                className={`${inputClass} tabular-nums`}
                value={compareAt}
                onChange={(e) => setCompareAt(e.target.value)}
                aria-invalid={Boolean(errors.compareAt)}
                aria-describedby={describedBy("c-compare", "hint", errors.compareAt)}
              />
            </Field>
            <Field id="c-lang" label="Language">
              <select id="c-lang" className={inputClass} value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option>Hindi & English</option>
                <option>English</option>
                <option>Hindi</option>
              </select>
            </Field>
          </section>

          <section className={cardClass} aria-label="Outcomes">
            <ListEditor
              id="c-outcomes"
              label="Outcomes"
              hint="What learners will be able to do. Start with a verb."
              items={outcomes}
              onChange={setOutcomes}
              placeholder="e.g. Build a weekly revision rhythm"
              error={errors.outcomes}
            />
          </section>

          <section className={cardClass} aria-label="Curriculum">
            <ModuleBuilder modules={modules} onChange={setModules} error={errors.modules} />
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <div className={cardClass}>
            <CoverDropzone initialUrl={initial?.image} onChange={setCoverUrl} />
          </div>
          <div className="hidden xl:block">
            <p className="eyebrow mb-3">Live preview</p>
            <CoursePreviewCard
              title={title}
              subtitle={subtitle}
              audience={audience}
              format={format}
              level={level}
              price={parseInr(price)}
              compareAt={parseInr(compareAt)}
              lessonCount={lessonCount}
              minutes={minutes}
              coverUrl={coverUrl}
            />
          </div>
        </aside>
      </div>

      <EditorActions
        status={status}
        backHref="/studio/programs"
        onSaveDraft={() => save("draft")}
        onPublish={() => save("published")}
        errorSummary={errorCount ? `${errorCount} field${errorCount > 1 ? "s" : ""} need attention.` : undefined}
      />
    </form>
  );
}
