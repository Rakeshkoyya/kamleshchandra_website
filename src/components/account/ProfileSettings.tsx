"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { describedBy, Field, inputClass, Toggle } from "@/components/studio/fields";

type Profile = { name: string; email: string; phone: string; memberSince: string };

export function ProfileSettings({ initial }: { initial: Profile }) {
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [language, setLanguage] = useState("Hindi & English");
  const [reminders, setReminders] = useState({ whatsapp: true, email: true, sms: false });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [status, setStatus] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = {
      name: name.trim().length < 2 ? "Please enter your name." : undefined,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : "Enter a valid email address.",
    };
    setErrors(next);
    if (next.name || next.email) {
      setStatus("Please fix the highlighted fields.");
      return;
    }
    // BACKEND: PATCH /api/me { name, email, language, reminders }
    setStatus("Saved. (Demo — nothing left this browser.)");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="pf-name" label="Full name" error={errors.name}>
          <input
            id="pf-name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("pf-name", undefined, errors.name)}
          />
        </Field>
        <Field id="pf-email" label="Email" error={errors.email}>
          <input
            id="pf-email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("pf-email", undefined, errors.email)}
          />
        </Field>
        <Field id="pf-phone" label="Mobile" hint="Used to sign in. Change it by contacting us.">
          <input
            id="pf-phone"
            className={`${inputClass} bg-bg-alt text-muted`}
            value={`+91 ${initial.phone}`}
            readOnly
            aria-describedby="pf-phone-hint"
          />
        </Field>
        <Field id="pf-lang" label="Preferred language">
          <select id="pf-lang" className={inputClass} value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>Hindi & English</option>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </Field>
      </div>

      <fieldset className="rounded-lg border border-line bg-bg-alt p-5">
        <legend className="px-1 font-display text-lg font-semibold">Revisit reminders</legend>
        <p className="text-sm text-muted">We nudge you on day 1, 7 and 30 after each lesson.</p>
        <div className="mt-4 space-y-4">
          <Toggle id="rm-wa" label="WhatsApp" checked={reminders.whatsapp} onChange={(v) => setReminders((r) => ({ ...r, whatsapp: v }))} />
          <Toggle id="rm-email" label="Email" checked={reminders.email} onChange={(v) => setReminders((r) => ({ ...r, email: v }))} />
          <Toggle id="rm-sms" label="SMS" checked={reminders.sms} onChange={(v) => setReminders((r) => ({ ...r, sms: v }))} />
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4 lg:col-span-2">
        <Button type="submit">Save changes</Button>
        <Button
          variant="ghost"
          onClick={() => {
            // BACKEND: POST /api/auth/signout → clear session cookie, then redirect to /.
            setStatus("Demo: you would be signed out now.");
          }}
        >
          Sign out
        </Button>
        <p aria-live="polite" className={`text-sm font-medium ${errors.name || errors.email ? "text-danger" : "text-success"}`}>
          {status}
        </p>
      </div>
    </form>
  );
}
