import Link from "next/link";
import { Badge } from "@/components/ui/misc";
import { formatInr } from "@/lib/format";
import type { EventItem } from "@/lib/types";
import { DateChip, SeatsBar, eventDateLabel, eventTimeLabel, isMultiDay } from "./event-bits";

/** One line on the notice board. The title link stretches over the whole row. */
export function EventRow({ event, index = 0 }: { event: EventItem; index?: number }) {
  const isPast = event.status === "past";
  const where = event.mode === "online" ? "Online" : (event.city ?? "Venue to be confirmed");
  return (
    <li
      className={`group relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-4 border-b border-line py-6 sm:grid-cols-[auto_minmax(0,1fr)_13rem] sm:items-center ${
        isPast ? "" : "rise-in"
      }`}
      style={isPast ? undefined : { ["--i" as string]: index }}
    >
      <DateChip iso={event.startsAt} muted={isPast} />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={isPast ? "neutral" : "brand"}>{event.kind}</Badge>
          <span className="text-sm text-muted">
            {where}
            {event.mode === "in-person" ? " · In person" : ""}
          </span>
        </div>
        <h3 className={`mt-2 text-[length:var(--text-xl)] ${isPast ? "text-muted" : ""}`}>
          <Link
            href={`/events/${event.slug}`}
            className="after:absolute after:inset-0 after:rounded-md after:content-[''] group-hover:text-brand"
          >
            {event.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">
          {isMultiDay(event) ? `${eventDateLabel(event)} · ` : ""}
          {eventTimeLabel(event)}
        </p>
      </div>
      <div className="col-span-2 sm:col-span-1">
        {isPast ? (
          <p className="text-sm text-muted">Held — thank you for coming</p>
        ) : (
          <>
            <p className="font-display text-xl font-semibold text-ink">{formatInr(event.priceInr)}</p>
            <SeatsBar event={event} className="mt-2" />
          </>
        )}
      </div>
    </li>
  );
}
