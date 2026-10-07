import type { ReactNode } from "react";

/** Editorial page heading for studio screens. */
export function StudioPageHeader({
  eyebrow,
  title,
  lead,
  actions,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-5 md:mb-10">
      <div className="max-w-[60ch]">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-[length:var(--text-2xl)]">{title}</h1>
        {lead ? <p className="mt-2 text-muted">{lead}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
