import type { ReactNode } from "react";

/*
 * Form primitives shared by the studio and the learner area. Plain labelled
 * inputs with inline error text (role="alert" isn't used — the message is
 * linked with aria-describedby and the form's live region announces it).
 */

export const inputClass =
  "block w-full rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-[0.95rem] text-ink " +
  "placeholder:text-muted/70 focus:border-brand aria-[invalid=true]:border-danger";

export const labelClass = "block text-sm font-semibold text-ink";

export const cardClass = "rounded-lg border border-line bg-surface p-5 shadow-1 md:p-6";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

/** Label + control + hint/error. Pass `aria-describedby={describedBy(id, …)}` on the control. */
export function Field({ id, label, hint, error, children, className = "" }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-0.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ");
  return ids || undefined;
}

/** A labelled on/off switch built on a checkbox (keyboard + screen reader native). */
export function Toggle({
  id,
  label,
  checked,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  hint?: string;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="h-6 w-11 rounded-full bg-line transition-colors duration-[var(--dur-fast)] peer-checked:bg-brand peer-focus-visible:ring-3 peer-focus-visible:ring-recall-text peer-focus-visible:ring-offset-2"
        />
        <span
          aria-hidden="true"
          className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-surface shadow-1 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] peer-checked:translate-x-5"
        />
      </span>
    </label>
  );
}

/** Section card with a serif heading — the studio's editorial building block. */
export function Panel({
  title,
  eyebrow,
  action,
  children,
  className = "",
  id,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section className={`${cardClass} ${className}`} aria-labelledby={headingId} id={id}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 id={headingId} className="mt-1 text-xl">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
