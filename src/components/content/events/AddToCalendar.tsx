"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { EventItem } from "@/lib/types";
import { buildIcs } from "./ics";

/** Downloads a generated .ics for the event (client-side Blob, no server). */
export function AddToCalendar({ event }: { event: EventItem }) {
  const [status, setStatus] = useState("");

  function handleClick() {
    try {
      const url = `${window.location.origin}/events/${event.slug}`;
      const blob = new Blob([buildIcs(event, url, new Date())], { type: "text/calendar;charset=utf-8" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `${event.slug}.ics`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
      setStatus("Calendar file downloaded");
    } catch {
      setStatus("Couldn’t create the calendar file — please add it by hand");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" onClick={handleClick}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="4.5" width="14" height="12" rx="2" />
          <path d="M3 8.5h14M7 3v3M13 3v3" strokeLinecap="round" />
        </svg>
        Add to calendar
      </Button>
      <span role="status" aria-live="polite" className="text-sm text-muted">
        {status}
      </span>
    </div>
  );
}
