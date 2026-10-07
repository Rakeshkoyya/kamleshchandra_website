"use client";

import { BOOK_FORMAT_LABEL } from "@/lib/data/books";
import type { BookFormat } from "@/lib/types";
import { inputClass } from "./fields";

export type EditionDraft = { id: string; format: BookFormat; price: string; inStock: boolean };

const FORMATS = Object.keys(BOOK_FORMAT_LABEL) as BookFormat[];

type Props = { editions: EditionDraft[]; onChange: (next: EditionDraft[]) => void; error?: string };

/** One row per edition: format, price, in stock. Each format may appear once. */
export function EditionsEditor({ editions, onChange, error }: Props) {
  const used = new Set(editions.map((e) => e.format));
  const free = FORMATS.filter((f) => !used.has(f));
  const update = (id: string, patch: Partial<EditionDraft>) => onChange(editions.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  return (
    <fieldset aria-describedby={error ? "editions-error" : undefined}>
      <legend className="font-display text-xl font-semibold">Editions</legend>
      <ul className="mt-3 space-y-2">
        {editions.map((ed, i) => (
          <li key={ed.id} className="grid grid-cols-[1fr_7rem_auto_auto] items-center gap-2 rounded-md bg-bg p-2 ring-1 ring-line">
            <select
              className={inputClass}
              value={ed.format}
              aria-label={`Edition ${i + 1} format`}
              onChange={(e) => update(ed.id, { format: e.target.value as BookFormat })}
            >
              {FORMATS.filter((f) => f === ed.format || !used.has(f)).map((f) => (
                <option key={f} value={f}>
                  {BOOK_FORMAT_LABEL[f]}
                </option>
              ))}
            </select>
            <input
              className={`${inputClass} tabular-nums`}
              inputMode="numeric"
              value={ed.price}
              placeholder="₹"
              aria-label={`Edition ${i + 1} price in rupees`}
              onChange={(e) => update(ed.id, { price: e.target.value })}
            />
            <label className="flex items-center gap-1.5 px-1 text-xs font-semibold whitespace-nowrap">
              <input type="checkbox" className="h-4 w-4 accent-brand" checked={ed.inStock} onChange={(e) => update(ed.id, { inStock: e.target.checked })} />
              In stock
            </label>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-danger-soft hover:text-danger"
              aria-label={`Remove ${BOOK_FORMAT_LABEL[ed.format]} edition`}
              onClick={() => onChange(editions.filter((e) => e.id !== ed.id))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      {free.length > 0 ? (
        <button
          type="button"
          className="mt-3 text-sm font-semibold text-brand hover:underline"
          onClick={() => onChange([...editions, { id: `ed-${free[0]}`, format: free[0], price: "", inStock: true }])}
        >
          + Add {BOOK_FORMAT_LABEL[free[0]].toLowerCase()} edition
        </button>
      ) : null}
      {error ? (
        <p id="editions-error" className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
