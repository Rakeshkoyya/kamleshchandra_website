import type { ReactNode } from "react";

/*
 * Small form kit shared by the content-page forms (newsletter, RSVP, enquiry).
 * Validation is client-side only for the demo; the backend must re-validate.
 */

export type FieldErrors = Record<string, string>;

export const inputClass =
  "block w-full min-h-11 rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-base text-ink " +
  "placeholder:text-muted/70 transition-[box-shadow,border-color] duration-[var(--dur-fast)] " +
  "hover:border-brand aria-[invalid=true]:border-danger";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Indian mobile number, with or without +91. */
export function isIndianMobile(value: string): boolean {
  return PHONE_RE.test(value.trim());
}

export function text(form: FormData, name: string): string {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

/** Moves focus to the first field that has an error. */
export function focusFirstError(form: HTMLFormElement, errors: FieldErrors): void {
  const first = Object.keys(errors)[0];
  if (!first) return;
  const el = form.elements.namedItem(first);
  if (el instanceof HTMLElement) el.focus();
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  /** Receives the aria props to spread on the control. */
  children: (aria: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
}

export function Field({ id, label, error, hint, optional, className = "", children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Polite live region used to announce form outcomes. */
export function FormStatus({ message, tone = "neutral" }: { message: string; tone?: "neutral" | "danger" }) {
  return (
    <p aria-live="polite" role="status" className={`text-sm ${tone === "danger" ? "text-danger" : "text-muted"}`}>
      {message}
    </p>
  );
}
