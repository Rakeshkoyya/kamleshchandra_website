import Link from "next/link";
import type { Announcement } from "@/lib/types";

const TONE_LABEL: Record<Announcement["tone"], string> = {
  new: "New",
  info: "Note",
  urgent: "Urgent",
};

const TONE_CLASS: Record<Announcement["tone"], string> = {
  new: "bg-recall text-ink",
  info: "bg-brand-soft text-brand",
  urgent: "bg-danger-soft text-danger",
};

/** Pinned notes along the top of the notice board. */
export function AnnouncementStrip({ items }: { items: Announcement[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="announcements-title" className="border-y border-line bg-recall-soft">
      <div className="page-wrap flex flex-col gap-3 py-4 md:flex-row md:items-center md:gap-8">
        <h2 id="announcements-title" className="eyebrow shrink-0">
          Pinned
        </h2>
        <ul className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-x-8">
          {items.map((a) => {
            const body = (
              <>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${TONE_CLASS[a.tone]}`}>{TONE_LABEL[a.tone]}</span>
                <span>{a.text}</span>
              </>
            );
            return (
              <li key={a.id}>
                {a.href ? (
                  <Link href={a.href} className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-ink hover:text-brand">
                    {body}
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <p className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-ink">{body}</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
