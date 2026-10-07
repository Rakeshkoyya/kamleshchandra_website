"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, TextField, inputClass } from "./Field";
import { INDIAN_STATES, validateDetails, type Details } from "./validation";

type Props = {
  details: Details;
  needsAddress: boolean;
  onChange: (next: Details) => void;
  onContinue: () => void;
};

const ORDER: (keyof Details)[] = ["name", "email", "phone", "line1", "line2", "city", "state", "pincode"];

export function DetailsForm({ details, needsAddress, onChange, onContinue }: Props) {
  const uid = useId();
  const [touched, setTouched] = useState<Partial<Record<keyof Details, boolean>>>({});
  const [isAttempted, setIsAttempted] = useState(false);
  const errors = validateDetails(details, needsAddress);
  const errorCount = Object.keys(errors).length;

  const id = (k: keyof Details) => `${uid}-${k}`;
  const shown = (k: keyof Details) => (isAttempted || touched[k] ? errors[k] : undefined);
  const set = (k: keyof Details, v: string) => onChange({ ...details, [k]: v });
  const blur = (k: keyof Details) => () => setTouched((t) => ({ ...t, [k]: true }));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (errorCount === 0) {
      onContinue();
      return;
    }
    setIsAttempted(true);
    const first = ORDER.find((k) => errors[k]);
    if (first) document.getElementById(id(first))?.focus();
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-describedby={`${uid}-summary`}>
      <p id={`${uid}-summary`} className="sr-only" aria-live="polite">
        {isAttempted && errorCount > 0 ? `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} attention.` : ""}
      </p>

      <fieldset>
        <legend className="font-display text-xl">Contact</legend>
        <p className="mt-1 text-sm text-muted">We send your receipt and course access here.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField
            id={id("name")} label="Full name" autoComplete="name" fieldClassName="sm:col-span-2"
            value={details.name} onChange={(e) => set("name", e.target.value)} onBlur={blur("name")} error={shown("name")}
          />
          <TextField
            id={id("email")} label="Email" type="email" autoComplete="email" inputMode="email"
            value={details.email} onChange={(e) => set("email", e.target.value)} onBlur={blur("email")} error={shown("email")}
          />
          <Field id={id("phone")} label="Mobile number" hint="Indian number, +91. For order updates only." error={shown("phone")}>
            {(a11y) => (
              <div className="flex">
                <span className="grid h-12 place-items-center rounded-l-md bg-bg-alt px-3 text-muted ring-1 ring-line-strong" aria-hidden="true">
                  +91
                </span>
                <input
                  {...a11y} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98290 00000"
                  value={details.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onBlur={blur("phone")}
                  className={`${inputClass} rounded-l-none`}
                />
              </div>
            )}
          </Field>
        </div>
      </fieldset>

      {needsAddress ? (
        <fieldset className="mt-10">
          <legend className="font-display text-xl">Shipping address</legend>
          <p className="mt-1 text-sm text-muted">For your paperback. Delivery in 3–5 working days.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <TextField
              id={id("line1")} label="House no. and street" autoComplete="address-line1" fieldClassName="sm:col-span-2"
              value={details.line1} onChange={(e) => set("line1", e.target.value)} onBlur={blur("line1")} error={shown("line1")}
            />
            <TextField
              id={id("line2")} label="Area or landmark" optional autoComplete="address-line2" fieldClassName="sm:col-span-2"
              value={details.line2} onChange={(e) => set("line2", e.target.value)}
            />
            <TextField
              id={id("city")} label="City" autoComplete="address-level2"
              value={details.city} onChange={(e) => set("city", e.target.value)} onBlur={blur("city")} error={shown("city")}
            />
            <Field id={id("state")} label="State" error={shown("state")}>
              {(a11y) => (
                <select
                  {...a11y} autoComplete="address-level1" value={details.state}
                  onChange={(e) => set("state", e.target.value)} onBlur={blur("state")} className={inputClass}
                >
                  <option value="">Choose…</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <TextField
              id={id("pincode")} label="PIN code" inputMode="numeric" autoComplete="postal-code"
              value={details.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              onBlur={blur("pincode")} error={shown("pincode")}
            />
          </div>
        </fieldset>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg">
          Continue to payment
        </Button>
        <p className="text-sm text-muted">You won&rsquo;t be charged yet.</p>
      </div>
    </form>
  );
}
