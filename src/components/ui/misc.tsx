import type { ReactNode } from "react";

/** Small rounded label. */
export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "recall" | "success" | "danger";
  className?: string;
}) {
  const tones = {
    neutral: "bg-bg-alt text-muted",
    brand: "bg-brand-soft text-brand",
    recall: "bg-recall-soft text-recall-text",
    success: "bg-success-soft text-success",
    danger: "bg-danger-soft text-danger",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Marks demo content so nobody mistakes it for real data. Remove when wired. */
export function SampleNote({ children = "Sample content for the demo", className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-2 rounded-full border border-dashed border-line-strong px-3 py-1 text-xs text-muted ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-recall" aria-hidden="true" />
      {children}
    </p>
  );
}

/** Page-top header for interior pages. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="page-wrap pt-12 pb-10 md:pt-20 md:pb-14">
      <p className="eyebrow rise-in">{eyebrow}</p>
      <h1 className="rise-in mt-3 max-w-[18ch] text-[length:var(--text-3xl)]" style={{ ["--i" as string]: 1 }}>
        {title}
      </h1>
      {lead ? (
        <p className="rise-in mt-5 max-w-[60ch] text-lg text-muted" style={{ ["--i" as string]: 2 }}>
          {lead}
        </p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </header>
  );
}

/** Price with optional strike-through compare price. */
export function Price({ amount, compareAt, className = "" }: { amount: string; compareAt?: string; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-display text-xl font-semibold">{amount}</span>
      {compareAt ? (
        <s className="text-sm text-muted">
          <span className="sr-only">was </span>
          {compareAt}
        </s>
      ) : null}
    </span>
  );
}
