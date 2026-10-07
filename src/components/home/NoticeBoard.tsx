import Link from "next/link";
import { Badge } from "@/components/ui/misc";
import { getAnnouncements, getUpcomingEvents } from "@/lib/data/events";
import { getPosts } from "@/lib/data/posts";
import { dateParts, formatDate, formatInr, formatTime } from "@/lib/format";

/* Chapter 7 — the quiet one: what's coming up, and what he's been writing. */
export async function NoticeBoard() {
  const [events, posts, announcements] = await Promise.all([getUpcomingEvents(), getPosts(), getAnnouncements()]);

  return (
    <section aria-labelledby="notice-title" className="border-y border-line bg-surface py-[var(--section-y)]">
      <div className="page-wrap">
        <p className="eyebrow">Notice board</p>
        <h2 id="notice-title" className="mt-3 text-[length:var(--text-3xl)]">
          Coming up
        </h2>

        {announcements.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {announcements.map((a) => (
              <li key={a.id}>
                <Link
                  href={a.href ?? "/events"}
                  className="inline-flex items-center gap-2 rounded-full bg-recall-soft px-4 py-2 text-sm font-medium text-ink hover:ring-1 hover:ring-recall"
                >
                  <Badge tone="recall" className="bg-surface">
                    {a.tone === "new" ? "New" : "Note"}
                  </Badge>
                  {a.text}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-12 grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <ul className="space-y-3">
            {events.slice(0, 3).map((e) => {
              const d = dateParts(e.startsAt);
              return (
                <li key={e.slug}>
                  <Link
                    href={`/events/${e.slug}`}
                    className="group grid grid-cols-[4.5rem_1fr] gap-5 rounded-lg p-3 transition-colors duration-[var(--dur-fast)] hover:bg-bg-alt"
                  >
                    <span className="grid h-[4.5rem] place-content-center rounded-md bg-brand text-center text-paper">
                      <span className="font-display text-2xl leading-none font-semibold">{d.day}</span>
                      <span className="text-xs tracking-wider uppercase">{d.month}</span>
                    </span>
                    <span>
                      <span className="text-xs font-semibold tracking-wider text-recall-text uppercase">
                        {e.kind} · {e.mode === "online" ? "Online" : e.city}
                      </span>
                      <span className="block font-display text-xl leading-snug group-hover:text-brand">{e.title}</span>
                      <span className="text-sm text-muted">
                        {formatTime(e.startsAt)} IST · {formatInr(e.priceInr)}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="pt-2 pl-3">
              <Link href="/events" className="draw-link font-semibold text-brand">
                All events →
              </Link>
            </li>
          </ul>

          <div>
            <h3 className="text-sm font-bold tracking-[0.14em] text-muted uppercase">From the journal</h3>
            <ul className="mt-4 divide-y divide-line">
              {posts.slice(0, 3).map((p) => (
                <li key={p.slug} className="py-4">
                  <Link href={`/journal/${p.slug}`} className="group block">
                    <span className="text-xs text-muted">
                      {p.category} · {formatDate(p.publishedAt)}
                    </span>
                    <span className="block font-display text-lg leading-snug group-hover:text-brand">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/journal" className="draw-link mt-2 inline-block font-semibold text-brand">
              Read the journal →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
