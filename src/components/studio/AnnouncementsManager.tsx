"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/misc";
import { formatDate } from "@/lib/format";
import type { Announcement } from "@/lib/types";
import { newId } from "./editor-utils";
import { cardClass, describedBy, Field, inputClass, Toggle } from "./fields";
import { useToast } from "./Toast";

type Row = Announcement & { isActive: boolean };
type Tone = Announcement["tone"];

const TONE_BADGE: Record<Tone, "brand" | "recall" | "danger"> = { info: "brand", new: "recall", urgent: "danger" };
const MAX_TEXT = 90;

function linkError(href: string): string | undefined {
  if (!href.trim()) return undefined;
  if (href.startsWith("/")) return undefined;
  try {
    const url = new URL(href);
    return url.protocol === "https:" ? undefined : "Use an https:// link or a site path like /events.";
  } catch {
    return "Use an https:// link or a site path like /events.";
  }
}

export function AnnouncementsManager({ initial }: { initial: Announcement[] }) {
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>(() => initial.map((a, i) => ({ ...a, isActive: i === 0 })));
  const [text, setText] = useState("");
  const [href, setHref] = useState("");
  const [tone, setTone] = useState<Tone>("info");
  const [errors, setErrors] = useState<{ text?: string; href?: string }>({});

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = {
      text: !text.trim() ? "Write the announcement." : text.length > MAX_TEXT ? `Keep it under ${MAX_TEXT} characters.` : undefined,
      href: linkError(href),
    };
    setErrors(found);
    if (found.text || found.href) return;
    // BACKEND: POST /api/admin/announcements { text, href, tone, isActive }
    const row: Row = {
      id: newId("a"),
      text: text.trim(),
      href: href.trim() || undefined,
      tone,
      publishedAt: new Date().toISOString(),
      isSample: true,
      isActive: true,
    };
    setRows((list) => [row, ...list]);
    setText("");
    setHref("");
    toast("Announcement created and switched on (demo).");
  }

  function toggle(id: string, isActive: boolean) {
    // BACKEND: PATCH /api/admin/announcements/{id} { isActive }
    setRows((list) => list.map((r) => (r.id === id ? { ...r, isActive } : r)));
  }

  function remove(row: Row) {
    // BACKEND: DELETE /api/admin/announcements/{id}
    setRows((list) => list.filter((r) => r.id !== row.id));
    toast(`Deleted “${row.text.slice(0, 40)}${row.text.length > 40 ? "…" : ""}”`, "info");
  }

  return (
    <section id="announcements" aria-labelledby="ann-title" className="scroll-mt-6">
      <h2 id="ann-title" className="text-xl">
        Announcements
      </h2>
      <p className="mt-1 text-sm text-muted">Active announcements show in the site&rsquo;s notice strip, newest first.</p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <form onSubmit={handleCreate} noValidate className={`${cardClass} space-y-4 self-start`}>
          <h3 className="text-lg">New announcement</h3>
          <Field id="an-text" label="Text" hint={`${text.length}/${MAX_TEXT}`} error={errors.text}>
            <textarea
              id="an-text"
              rows={3}
              className={inputClass}
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-invalid={Boolean(errors.text)}
              aria-describedby={describedBy("an-text", "hint", errors.text)}
            />
          </Field>
          <Field id="an-href" label="Link (optional)" error={errors.href}>
            <input
              id="an-href"
              className={inputClass}
              value={href}
              placeholder="/events/…"
              onChange={(e) => setHref(e.target.value)}
              aria-invalid={Boolean(errors.href)}
              aria-describedby={describedBy("an-href", undefined, errors.href)}
            />
          </Field>
          <fieldset>
            <legend className="text-sm font-semibold">Tone</legend>
            <div className="mt-1.5 flex gap-2">
              {(Object.keys(TONE_BADGE) as Tone[]).map((t) => (
                <label
                  key={t}
                  className={`flex-1 cursor-pointer rounded-md py-2 text-center text-sm font-semibold capitalize ring-1 has-focus-visible:ring-2 has-focus-visible:ring-recall-text ${
                    tone === t ? "bg-brand-soft text-brand ring-brand" : "ring-line-strong"
                  }`}
                >
                  <input type="radio" name="an-tone" value={t} checked={tone === t} onChange={() => setTone(t)} className="sr-only" />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>
          <Button type="submit" className="w-full">
            Create announcement
          </Button>
        </form>

        <ul className="space-y-3" aria-label="Announcements list">
          {rows.length === 0 ? <li className="rounded-lg border border-dashed border-line-strong p-6 text-center text-muted">No announcements.</li> : null}
          {rows.map((r) => (
            <li key={r.id} className={`rounded-lg border border-line bg-surface p-4 shadow-1 transition-opacity ${r.isActive ? "" : "opacity-60"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={TONE_BADGE[r.tone]} className="capitalize">
                      {r.tone}
                    </Badge>
                    <span className="text-xs text-muted">{formatDate(r.publishedAt)}</span>
                  </div>
                  <p className="mt-2 font-semibold">{r.text}</p>
                  {r.href ? <p className="truncate text-xs text-muted">→ {r.href}</p> : null}
                </div>
                <div className="flex items-center gap-3">
                  <Toggle id={`an-on-${r.id}`} label={r.isActive ? "Active" : "Off"} checked={r.isActive} onChange={(v) => toggle(r.id, v)} />
                  <button
                    type="button"
                    onClick={() => remove(r)}
                    className="rounded-full px-3 py-1.5 text-sm font-semibold text-danger hover:bg-danger-soft"
                    aria-label={`Delete announcement: ${r.text}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
