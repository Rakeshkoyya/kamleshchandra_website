import { dateParts, formatDate, formatTime, seatsLeft } from "@/lib/format";
import type { EventItem } from "@/lib/types";

/** Calendar-page date chip: day over month. */
export function DateChip({ iso, muted = false, size = "md" }: { iso: string; muted?: boolean; size?: "md" | "lg" }) {
  const { day, month } = dateParts(iso);
  const box = size === "lg" ? "w-20 py-3" : "w-16 py-2";
  const dayText = size === "lg" ? "text-[2.5rem]" : "text-[2rem]";
  return (
    <time
      dateTime={iso}
      className={`flex shrink-0 flex-col items-center overflow-hidden rounded-md border text-center ${box} ${
        muted ? "border-line bg-bg-alt text-muted" : "border-line bg-surface text-ink shadow-1"
      }`}
    >
      <span className={`font-display leading-none font-semibold tabular-nums ${dayText}`}>{day}</span>
      <span className={`mt-1 text-xs font-bold tracking-[0.14em] uppercase ${muted ? "" : "text-recall-text"}`}>
        {month}
      </span>
    </time>
  );
}

/** Seats bar — the fill grows with seats taken (transform only). */
export function SeatsBar({ event, className = "" }: { event: EventItem; className?: string }) {
  const left = seatsLeft(event.seatsTotal, event.seatsTaken);
  const taken = event.seatsTotal > 0 ? Math.min(1, event.seatsTaken / event.seatsTotal) : 1;
  const isLow = left > 0 && left / event.seatsTotal <= 0.2;
  const label = left === 0 ? "Full" : `${left} of ${event.seatsTotal} seats left`;
  return (
    <div className={className}>
      <p className={`text-sm ${isLow ? "font-semibold text-recall-text" : "text-muted"}`}>
        {label}
        {isLow ? " — filling fast" : ""}
      </p>
      <div aria-hidden="true" className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-alt">
        <div
          className="h-full origin-left rounded-full bg-recall transition-transform duration-[var(--dur-deliberate)] ease-[var(--ease-out)]"
          style={{ transform: `scaleX(${taken})` }}
        />
      </div>
    </div>
  );
}

export function isMultiDay(event: EventItem): boolean {
  return formatDate(event.startsAt) !== formatDate(event.endsAt);
}

/** "14 Nov 2026" or "5 Dec 2026 – 6 Dec 2026". */
export function eventDateLabel(event: EventItem): string {
  return isMultiDay(event) ? `${formatDate(event.startsAt)} – ${formatDate(event.endsAt)}` : formatDate(event.startsAt);
}

/** "10:00 am – 1:00 pm IST" */
export function eventTimeLabel(event: EventItem): string {
  return `${formatTime(event.startsAt)} – ${formatTime(event.endsAt)} IST`;
}

export function placeLabel(event: EventItem): string {
  if (event.mode === "online") return `Online · ${event.venue}`;
  return event.city ? `${event.venue}, ${event.city}` : event.venue;
}
