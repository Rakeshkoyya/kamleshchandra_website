"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatInr, seatsLeft } from "@/lib/format";
import type { EventItem } from "@/lib/types";
import { RsvpDialog } from "./RsvpDialog";

const MAX_SEATS_PER_ORDER = 10;

function SeatStepper({ value, max, onChange }: { value: number; max: number; onChange: (n: number) => void }) {
  const stepClass =
    "grid h-11 w-11 place-items-center rounded-full text-xl font-semibold text-ink ring-1 ring-line-strong " +
    "hover:ring-brand hover:text-brand disabled:opacity-40 disabled:pointer-events-none";
  return (
    <div role="group" aria-labelledby="seat-qty-label" className="flex items-center gap-3">
      <span id="seat-qty-label" className="text-sm font-semibold text-ink">
        Seats
      </span>
      <button type="button" className={stepClass} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="One fewer seat">
        −
      </button>
      <output aria-live="polite" className="w-8 text-center font-display text-xl font-semibold tabular-nums">
        {value}
      </output>
      <button type="button" className={stepClass} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="One more seat">
        +
      </button>
    </div>
  );
}

/** Paid → seat quantity + add to cart; free → RSVP dialog; full or past → closed. */
export function EventRegistration({ event }: { event: EventItem }) {
  const left = seatsLeft(event.seatsTotal, event.seatsTaken);
  const max = Math.max(1, Math.min(MAX_SEATS_PER_ORDER, left));
  const [quantity, setQuantity] = useState(1);

  if (event.status === "past") {
    return <p className="text-muted">This event has been held. Registration is closed.</p>;
  }
  if (left === 0) {
    return <p className="font-semibold text-ink">This event is full. Write to us to join the waiting list.</p>;
  }
  if (event.priceInr === 0) {
    return <RsvpDialog event={event} />;
  }

  const total = event.priceInr * quantity;
  return (
    <div className="grid gap-5">
      <SeatStepper value={quantity} max={max} onChange={(n) => setQuantity(Math.min(max, Math.max(1, n)))} />
      <p className="text-sm text-muted">
        {formatInr(event.priceInr)} per seat ·{" "}
        <span className="font-semibold text-ink">
          Total {formatInr(total)}
        </span>
      </p>
      <AddToCartButton
        item={{ kind: "event", slug: event.slug, title: event.title, variant: "seat", unitPriceInr: event.priceInr }}
        quantity={quantity}
        label={quantity === 1 ? "Add seat to cart" : `Add ${quantity} seats to cart`}
        className="w-full sm:w-auto"
      />
    </div>
  );
}
