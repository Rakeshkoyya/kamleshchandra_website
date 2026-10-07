"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { dateParts, formatInr, formatTime } from "@/lib/format";
import type { EventItem } from "@/lib/types";
import { cellClass, DataTable } from "./DataTable";
import { EventForm } from "./EventForm";
import { PublishBadge } from "./StatusBadge";
import { StudioDialog } from "./StudioDialog";
import { useToast } from "./Toast";

export function EventsManager({ initial }: { initial: EventItem[] }) {
  const toast = useToast();
  const [events, setEvents] = useState(initial);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function handleCreate(event: EventItem) {
    setEvents((list) => [...list, event].sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
    setIsDialogOpen(false);
    toast(`“${event.title}” added (demo — not saved).`);
  }

  return (
    <section aria-labelledby="events-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 id="events-title" className="text-xl">
          Events <span className="font-sans text-base font-normal text-muted">({events.length})</span>
        </h2>
        <Button onClick={() => setIsDialogOpen(true)}>+ New event</Button>
      </div>

      <DataTable caption="Events" head={["Date", "Event", "Where", "Price", "Seats", "Status"]}>
        {events.map((e) => {
          const { day, month } = dateParts(e.startsAt);
          const fill = e.seatsTotal ? e.seatsTaken / e.seatsTotal : 0;
          return (
            <tr key={e.slug} className={e.status === "past" ? "text-muted" : ""}>
              <td className={`${cellClass} whitespace-nowrap`}>
                <span className="font-display text-lg font-semibold text-ink">{day}</span> {month}
                <span className="block text-xs text-muted">{formatTime(e.startsAt)}</span>
              </td>
              <td className={cellClass}>
                <p className="font-semibold text-ink">{e.title}</p>
                <p className="text-xs text-muted">{e.kind}</p>
              </td>
              <td className={`${cellClass} text-muted`}>{e.mode === "online" ? e.venue : `${e.venue}${e.city ? `, ${e.city}` : ""}`}</td>
              <td className={`${cellClass} tabular-nums`}>{formatInr(e.priceInr)}</td>
              <td className={cellClass}>
                <div className="flex w-32 items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-soft" aria-hidden="true">
                    <div className={`h-full w-full origin-left rounded-full ${fill >= 0.8 ? "bg-recall" : "bg-brand"}`} style={{ transform: `scaleX(${fill})` }} />
                  </div>
                  <span className="text-xs tabular-nums">
                    {e.seatsTaken}/{e.seatsTotal}
                  </span>
                </div>
              </td>
              <td className={cellClass}>
                <PublishBadge status={e.status} />
              </td>
            </tr>
          );
        })}
      </DataTable>

      <StudioDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="New event" wide>
        <EventForm onCreate={handleCreate} onCancel={() => setIsDialogOpen(false)} />
      </StudioDialog>
    </section>
  );
}
