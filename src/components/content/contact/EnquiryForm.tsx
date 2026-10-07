"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, type FieldErrors, focusFirstError, inputClass, text } from "../form-kit";

const AUDIENCES = [
  { value: "students", label: "Students" },
  { value: "teachers", label: "Teachers" },
  { value: "parents", label: "Parents" },
  { value: "leadership", label: "School leadership" },
] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MAX_PARTICIPANTS = 100000;
const MIN_MESSAGE = 10;

type Status = "idle" | "submitting" | "done";

function validate(form: FormData): FieldErrors {
  const errors: FieldErrors = {};
  if (text(form, "institution").length < 2) errors.institution = "Please enter your school or institution’s name.";
  if (text(form, "role").length < 2) errors.role = "Tell us your role, e.g. Principal or Coordinator.";
  if (text(form, "city").length < 2) errors.city = "Please enter your city.";
  if (!text(form, "audience")) errors.audience = "Choose who the session is for.";
  const participants = Number(text(form, "participants"));
  if (!Number.isInteger(participants) || participants < 1 || participants > MAX_PARTICIPANTS)
    errors.participants = "Enter an approximate number, e.g. 120.";
  if (text(form, "message").length < MIN_MESSAGE) errors.message = "A line or two about what you have in mind helps us prepare.";
  return errors;
}

/** "Invite KC to your school" enquiry. Demo only — nothing is sent. */
export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [institution, setInstitution] = useState("");

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
    // BACKEND: POST /api/enquiries { institution, role, city, audience, participants, month, message }
    // → store the lead, notify learn@kamleshchandra.com, auto-reply to the enquirer.
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setInstitution(text(data, "institution"));
    setStatus("done");
  }

  const errorCount = Object.keys(errors).length;

  return (
    <div aria-live="polite">
      {status === "done" ? (
        <div className="rounded-lg bg-success-soft p-6 sm:p-8">
          <p className="font-display text-[length:var(--text-xl)] font-semibold text-success">Thank you — your invitation is with us.</p>
          <p className="mt-3 max-w-[52ch] text-ink">
            We’ll be in touch with {institution || "you"} soon to talk through dates and the shape
            of the session.
          </p>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
          {errorCount > 0 ? (
            <p className="rounded-md bg-danger-soft px-4 py-3 text-sm font-semibold text-danger sm:col-span-2">
              Please check {errorCount === 1 ? "one field" : `${errorCount} fields`} below.
            </p>
          ) : null}
          <Field id="enq-institution" label="Institution name" error={errors.institution} className="sm:col-span-2">
            {(aria) => <input {...aria} name="institution" autoComplete="organization" className={inputClass} />}
          </Field>
          <Field id="enq-role" label="Your role" error={errors.role}>
            {(aria) => <input {...aria} name="role" autoComplete="organization-title" placeholder="e.g. Principal" className={inputClass} />}
          </Field>
          <Field id="enq-city" label="City" error={errors.city}>
            {(aria) => <input {...aria} name="city" autoComplete="address-level2" className={inputClass} />}
          </Field>
          <Field id="enq-audience" label="Who is it for?" error={errors.audience}>
            {(aria) => (
              <select {...aria} name="audience" defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Choose an audience
                </option>
                {AUDIENCES.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field id="enq-participants" label="Approx. participants" error={errors.participants}>
            {(aria) => <input {...aria} name="participants" type="number" min={1} inputMode="numeric" className={inputClass} />}
          </Field>
          <Field id="enq-month" label="Preferred month" optional className="sm:col-span-2">
            {(aria) => (
              <select {...aria} name="month" defaultValue="flexible" className={inputClass}>
                <option value="flexible">Flexible</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field
            id="enq-message"
            label="What would you like the session to do?"
            error={errors.message}
            hint="Exam season, a new term, a parent evening, a staff development day…"
            className="sm:col-span-2"
          >
            {(aria) => <textarea {...aria} name="message" rows={5} className={`${inputClass} resize-y`} />}
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
              {status === "submitting" ? "Sending…" : "Send the invitation"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
