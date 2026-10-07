"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { Field, inputClass, isEmail, text } from "../form-kit";

type Status = "idle" | "submitting" | "done";

/** "One letter a fortnight" signup. Demo only — nothing is sent. */
export function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | undefined>();
  const [email, setEmail] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const value = text(new FormData(form), "email");
    if (!isEmail(value)) {
      setError(value ? "That email doesn’t look right — please check it." : "Please enter your email.");
      (form.elements.namedItem("email") as HTMLInputElement | null)?.focus();
      return;
    }
    setError(undefined);
    setStatus("submitting");
    // BACKEND: POST /api/newsletter { email } — add to the mailing list, send double opt-in.
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    setEmail(value);
    setStatus("done");
  }

  return (
    <section aria-labelledby="newsletter-title" className="rounded-lg bg-brand-soft p-6 sm:p-10">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-end">
        <div>
          <RhythmMark className="w-14 text-brand" />
          <h2 id="newsletter-title" className="mt-4 text-[length:var(--text-2xl)]">
            A short letter, now and then
          </h2>
          <p className="mt-3 max-w-[44ch] text-muted">
            New journal pieces, a memory practice to try, and early word of workshops. No noise.
          </p>
        </div>

        <div aria-live="polite">
          {status === "done" ? (
            <p className="rounded-md bg-surface p-5 text-ink shadow-1">
              <strong className="block font-display text-lg">You’re on the list.</strong>
              We’ll write to <span className="font-semibold">{email}</span>. Check your inbox to confirm.
            </p>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <Field id="newsletter-email" label="Email address" error={error} className="flex-1">
                {(aria) => (
                  <input {...aria} name="email" type="email" autoComplete="email" inputMode="email" className={inputClass} />
                )}
              </Field>
              <Button type="submit" size="md" className="sm:mt-[1.85rem]" disabled={status === "submitting"}>
                {status === "submitting" ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
