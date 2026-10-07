import type { ComponentProps, ReactNode } from "react";

export const inputClass =
  "h-12 w-full min-w-0 rounded-md bg-surface px-3.5 text-base ring-1 ring-line-strong placeholder:text-muted " +
  "transition-shadow duration-[var(--dur-fast)] ease-[var(--ease-out)] focus:ring-2 focus:ring-brand focus:outline-none " +
  "aria-invalid:ring-2 aria-invalid:ring-danger";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
  children: (a11y: { id: string; "aria-invalid"?: true; "aria-describedby"?: string }) => ReactNode;
};

/* Label + control + hint + error, wired together for screen readers. */
export function Field({ id, label, error, hint, optional, className = "", children }: FieldProps) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = Omit<ComponentProps<"input">, "id" | "children"> & {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  fieldClassName?: string;
};

export function TextField({ id, label, error, hint, optional, fieldClassName, className = "", ...rest }: TextFieldProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint} optional={optional} className={fieldClassName}>
      {(a11y) => <input {...a11y} {...rest} className={`${inputClass} ${className}`} />}
    </Field>
  );
}
