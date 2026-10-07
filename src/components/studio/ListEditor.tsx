"use client";

import { useState } from "react";
import { inputClass } from "./fields";
import { newId } from "./editor-utils";

export type ListItem = { id: string; text: string };

type Props = {
  id: string;
  label: string;
  hint?: string;
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  placeholder?: string;
  error?: string;
};

/** Add / edit / remove a list of short lines (outcomes, contents…). */
export function ListEditor({ id, label, hint, items, onChange, placeholder, error }: Props) {
  const [draft, setDraft] = useState("");

  function add() {
    const text = draft.trim();
    if (!text) return;
    onChange([...items, { id: newId("li"), text }]);
    setDraft("");
  }

  return (
    <fieldset aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}>
      <legend className="text-sm font-semibold">{label}</legend>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      <ol className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex items-center gap-2">
            <span className="w-5 text-right font-display text-sm text-recall-text tabular-nums" aria-hidden="true">
              {i + 1}
            </span>
            <input
              className={inputClass}
              value={item.text}
              aria-label={`${label} ${i + 1}`}
              onChange={(e) => onChange(items.map((it) => (it.id === item.id ? { ...it, text: e.target.value } : it)))}
            />
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:bg-danger-soft hover:text-danger"
              aria-label={`Remove ${label.toLowerCase()} ${i + 1}`}
              onClick={() => onChange(items.filter((it) => it.id !== item.id))}
            >
              ×
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex gap-2 pl-7">
        <input
          id={id}
          className={inputClass}
          value={draft}
          placeholder={placeholder}
          aria-label={`New ${label.toLowerCase()}`}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" onClick={add} className="shrink-0 rounded-full px-4 text-sm font-semibold text-brand ring-1 ring-line-strong hover:ring-brand">
          Add
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
