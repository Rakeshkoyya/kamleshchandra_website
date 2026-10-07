"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { EventItem } from "@/lib/types";
import { hasErrors, newId, priceError, parseInr, slugify } from "./editor-utils";
import { describedBy, Field, inputClass } from "./fields";

const KINDS: EventItem["kind"][] = ["Workshop", "Webinar", "Parent seminar", "Teacher training", "Book launch"];
type FieldKey = "title" | "start" | "end" | "venue" | "price" | "seats";

type Props = { onCreate: (event: EventItem) => void; onCancel: () => void };

/** New-event form shown inside the studio dialog. */
export function EventForm({ onCreate, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<EventItem["kind"]>("Workshop");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [mode, setMode] = useState<EventItem["mode"]>("in-person");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("0");
  const [seats, setSeats] = useState("100");
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const seatCount = Number(seats);
    const found: Partial<Record<FieldKey, string>> = {
      title: title.trim().length < 4 ? "Give the event a title." : undefined,
      start: start ? undefined : "Choose when it starts.",
      end: !end ? "Choose when it ends." : start && end <= start ? "End must be after the start." : undefined,
      venue: venue.trim() ? undefined : mode === "online" ? "Add the platform, e.g. Live on Zoom." : "Add the venue.",
      price: priceError(price),
      seats: Number.isInteger(seatCount) && seatCount > 0 ? undefined : "Seats must be a whole number above 0.",
    };
    setErrors(found);
    if (hasErrors(found)) return;
    // BACKEND: POST /api/admin/events — the server should normalise to IST and create the event page.
    onCreate({
      slug: `${slugify(title)}-${newId("e").slice(2)}`,
      title: title.trim(),
      kind,
      startsAt: `${start}:00+05:30`,
      endsAt: `${end}:00+05:30`,
      mode,
      venue: venue.trim(),
      city: mode === "in-person" ? city.trim() || undefined : undefined,
      priceInr: parseInr(price) ?? 0,
      seatsTotal: seatCount,
      seatsTaken: 0,
      summary: "",
      agenda: [],
      status: "upcoming",
      isSample: true,
    });
  }

  const errorCount = Object.values(errors).filter(Boolean).length;
  const input = (id: string, key: FieldKey, hint?: string) => ({
    id,
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": describedBy(id, hint, errors[key]),
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field id="ev-title" label="Title" error={errors.title} className="sm:col-span-2">
        <input {...input("ev-title", "title")} className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field id="ev-kind" label="Kind">
        <select id="ev-kind" className={inputClass} value={kind} onChange={(e) => setKind(e.target.value as EventItem["kind"])}>
          {KINDS.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </Field>
      <fieldset>
        <legend className="text-sm font-semibold">Mode</legend>
        <div className="mt-1.5 flex gap-2">
          {(["in-person", "online"] as const).map((m) => (
            <label
              key={m}
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-md px-3 py-2.5 text-sm font-semibold capitalize ring-1 has-focus-visible:ring-2 has-focus-visible:ring-recall-text ${
                mode === m ? "bg-brand-soft text-brand ring-brand" : "ring-line-strong"
              }`}
            >
              <input type="radio" name="ev-mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
              {m.replace("-", " ")}
            </label>
          ))}
        </div>
      </fieldset>
      <Field id="ev-start" label="Starts (IST)" error={errors.start}>
        <input {...input("ev-start", "start")} type="datetime-local" className={inputClass} value={start} onChange={(e) => setStart(e.target.value)} />
      </Field>
      <Field id="ev-end" label="Ends (IST)" error={errors.end}>
        <input {...input("ev-end", "end")} type="datetime-local" className={inputClass} value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} />
      </Field>
      <Field id="ev-venue" label={mode === "online" ? "Platform" : "Venue"} error={errors.venue}>
        <input
          {...input("ev-venue", "venue")}
          className={inputClass}
          value={venue}
          placeholder={mode === "online" ? "Live on Zoom" : "School auditorium"}
          onChange={(e) => setVenue(e.target.value)}
        />
      </Field>
      {mode === "in-person" ? (
        <Field id="ev-city" label="City">
          <input id="ev-city" className={inputClass} value={city} placeholder="Bikaner" onChange={(e) => setCity(e.target.value)} />
        </Field>
      ) : (
        <div className="hidden sm:block" />
      )}
      <Field id="ev-price" label="Price (₹)" hint="0 = free registration" error={errors.price}>
        <input {...input("ev-price", "price", "hint")} inputMode="numeric" className={`${inputClass} tabular-nums`} value={price} onChange={(e) => setPrice(e.target.value)} />
      </Field>
      <Field id="ev-seats" label="Seats" error={errors.seats}>
        <input {...input("ev-seats", "seats")} inputMode="numeric" className={`${inputClass} tabular-nums`} value={seats} onChange={(e) => setSeats(e.target.value)} />
      </Field>
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line pt-4 sm:col-span-2">
        <p aria-live="polite" className="mr-auto text-sm font-medium text-danger">
          {errorCount ? `${errorCount} field${errorCount > 1 ? "s" : ""} need attention.` : ""}
        </p>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create event</Button>
      </div>
    </form>
  );
}
