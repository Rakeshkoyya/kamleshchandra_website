"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { EventItem } from "@/lib/types";
import { Field, type FieldErrors, focusFirstError, inputClass, isEmail, isIndianMobile, text } from "../form-kit";
import { eventDateLabel, eventTimeLabel } from "./event-bits";

const MAX_ATTENDEES = 10;
const ATTENDEE_OPTIONS = Array.from({ length: MAX_ATTENDEES }, (_, i) => i + 1);

type Status = "idle" | "submitting" | "done";

function validate(form: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = text(form, "name");
  const email = text(form, "email");
  const phone = text(form, "phone");
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!isEmail(email)) errors.email = email ? "That email doesn’t look right." : "Please enter your email.";
  if (!isIndianMobile(phone))
    errors.phone = phone ? "Enter a 10-digit Indian mobile number." : "We need a WhatsApp number to send the details.";
  return errors;
}

/** Free-event RSVP in a native <dialog>. */
export function RsvpDialog({ event }: { event: EventItem }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [firstName, setFirstName] = useState("");

  const isOnline = event.mode === "online";

  function open() {
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) close();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(formEl, found);
      return;
    }
    setStatus("submitting");
    // BACKEND: POST /api/events/{event.slug}/rsvp { name, email, phone, attendees }
    // → reserve seats, then send the joining link / details on WhatsApp + email.
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setFirstName(text(data, "name").split(" ")[0] ?? "");
    setStatus("done");
  }

  return (
    <>
      <Button size="lg" onClick={open} className="w-full sm:w-auto">
        Reserve a free place
      </Button>

      <dialog ref={dialogRef} className="kc-dialog" aria-labelledby="rsvp-title" onClick={handleBackdropClick}>
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Free registration</p>
              <h2 id="rsvp-title" className="mt-2 text-[length:var(--text-xl)]">
                {event.title}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {eventDateLabel(event)} · {eventTimeLabel(event)}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink hover:bg-brand-soft"
              aria-label="Close"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div aria-live="polite">
            {status === "done" ? (
              <div className="mt-6 rounded-md bg-success-soft p-5 text-success">
                <p className="font-display text-lg font-semibold">
                  You’re registered{firstName ? `, ${firstName}` : ""} — we’ll WhatsApp the {isOnline ? "link" : "details"}.
                </p>
                <p className="mt-2 text-sm text-ink">A confirmation is on its way to your email too.</p>
                <Button variant="secondary" className="mt-5" onClick={close}>
                  Done
                </Button>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="mt-6 grid gap-5">
                <Field id="rsvp-name" label="Your name" error={errors.name}>
                  {(aria) => <input {...aria} name="name" autoComplete="name" className={inputClass} />}
                </Field>
                <Field id="rsvp-email" label="Email" error={errors.email}>
                  {(aria) => (
                    <input {...aria} name="email" type="email" autoComplete="email" inputMode="email" className={inputClass} />
                  )}
                </Field>
                <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_9rem]">
                  <Field id="rsvp-phone" label="WhatsApp number" error={errors.phone} hint="10-digit mobile, +91 optional">
                    {(aria) => <input {...aria} name="phone" type="tel" autoComplete="tel" inputMode="tel" className={inputClass} />}
                  </Field>
                  <Field id="rsvp-attendees" label="Attending">
                    {(aria) => (
                      <select {...aria} name="attendees" defaultValue="1" className={inputClass}>
                        {ATTENDEE_OPTIONS.map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "person" : "people"}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>
                <Button type="submit" size="lg" disabled={status === "submitting"}>
                  {status === "submitting" ? "Registering…" : "Confirm my place"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
