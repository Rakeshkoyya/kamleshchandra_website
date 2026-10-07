"use client";

import type { Lesson, Module } from "@/lib/types";
import { move, newId } from "./editor-utils";
import { inputClass } from "./fields";

type Props = { modules: Module[]; onChange: (modules: Module[]) => void; error?: string };

const iconBtn =
  "grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-bg-alt hover:text-ink disabled:opacity-30 disabled:pointer-events-none";

function Reorder({ label, index, count, onMove, onRemove }: {
  label: string;
  index: number;
  count: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className={iconBtn} disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Move ${label} up`}>
        ↑
      </button>
      <button type="button" className={iconBtn} disabled={index === count - 1} onClick={() => onMove(1)} aria-label={`Move ${label} down`}>
        ↓
      </button>
      <button type="button" className={`${iconBtn} hover:bg-danger-soft hover:text-danger`} onClick={onRemove} aria-label={`Remove ${label}`}>
        ×
      </button>
    </div>
  );
}

/** Modules → lessons: add, rename, set minutes, preview toggle, reorder and remove. */
export function ModuleBuilder({ modules, onChange, error }: Props) {
  const updateModule = (id: string, patch: Partial<Module>) =>
    onChange(modules.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const updateLesson = (mod: Module, lessonId: string, patch: Partial<Lesson>) =>
    updateModule(mod.id, { lessons: mod.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) });

  const addLesson = (mod: Module) =>
    updateModule(mod.id, { lessons: [...mod.lessons, { id: newId("l"), title: "", minutes: 10 }] });

  const addModule = () =>
    onChange([...modules, { id: newId("m"), title: "", lessons: [{ id: newId("l"), title: "", minutes: 10 }] }]);

  return (
    <fieldset aria-describedby={error ? "modules-error" : undefined}>
      <legend className="font-display text-xl font-semibold">Modules &amp; lessons</legend>
      <p className="text-sm text-muted">Keep lessons short — 8 to 15 minutes is ideal for recall.</p>

      <ol className="mt-4 space-y-4">
        {modules.map((mod, mi) => (
          <li key={mod.id} className="rounded-md border border-line bg-bg p-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold text-recall-text">M{mi + 1}</span>
              <input
                className={`${inputClass} font-semibold`}
                value={mod.title}
                placeholder="Module title"
                aria-label={`Module ${mi + 1} title`}
                onChange={(e) => updateModule(mod.id, { title: e.target.value })}
              />
              <Reorder
                label={`module ${mi + 1}`}
                index={mi}
                count={modules.length}
                onMove={(dir) => onChange(move(modules, mi, dir))}
                onRemove={() => onChange(modules.filter((m) => m.id !== mod.id))}
              />
            </div>

            <ol className="mt-3 space-y-2 sm:pl-8">
              {mod.lessons.map((lesson, li) => {
                const name = `lesson ${li + 1} in module ${mi + 1}`;
                return (
                  <li key={lesson.id} className="flex flex-wrap items-center gap-2 rounded-md bg-surface p-2 ring-1 ring-line sm:flex-nowrap">
                    <input
                      className={`${inputClass} min-w-0 flex-1 basis-full sm:basis-auto`}
                      value={lesson.title}
                      placeholder="Lesson title"
                      aria-label={`Title, ${name}`}
                      onChange={(e) => updateLesson(mod, lesson.id, { title: e.target.value })}
                    />
                    <label className="flex items-center gap-1.5 text-xs text-muted">
                      <input
                        type="number"
                        min={1}
                        max={240}
                        className={`${inputClass} w-20 tabular-nums`}
                        value={lesson.minutes}
                        aria-label={`Minutes, ${name}`}
                        onChange={(e) => updateLesson(mod, lesson.id, { minutes: Math.max(0, Number(e.target.value) || 0) })}
                      />
                      min
                    </label>
                    <label className="flex items-center gap-1.5 px-1 text-xs font-semibold whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-brand"
                        checked={Boolean(lesson.isPreview)}
                        onChange={(e) => updateLesson(mod, lesson.id, { isPreview: e.target.checked })}
                      />
                      Free preview
                      <span className="sr-only">, {name}</span>
                    </label>
                    <Reorder
                      label={name}
                      index={li}
                      count={mod.lessons.length}
                      onMove={(dir) => updateModule(mod.id, { lessons: move(mod.lessons, li, dir) })}
                      onRemove={() => updateModule(mod.id, { lessons: mod.lessons.filter((l) => l.id !== lesson.id) })}
                    />
                  </li>
                );
              })}
            </ol>
            <button type="button" onClick={() => addLesson(mod)} className="mt-3 text-sm font-semibold text-brand hover:underline sm:ml-8">
              + Add lesson
            </button>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={addModule}
        className="mt-4 w-full rounded-md border-2 border-dashed border-line-strong py-3 text-sm font-semibold text-brand hover:border-brand hover:bg-brand-soft"
      >
        + Add module
      </button>
      {error ? (
        <p id="modules-error" className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
