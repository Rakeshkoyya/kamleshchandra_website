import type { ReactNode } from "react";

/*
 * Table shell for studio lists: real <table> with a caption, horizontally
 * scrollable inside its card on small screens (the page itself never scrolls sideways).
 */
export function DataTable({ caption, head, children }: { caption: string; head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface shadow-1" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-line bg-bg-alt/60 text-xs tracking-wide text-muted uppercase">
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-3 font-semibold first:pl-5 last:pr-5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export const cellClass = "px-4 py-3.5 align-middle first:pl-5 last:pr-5";
