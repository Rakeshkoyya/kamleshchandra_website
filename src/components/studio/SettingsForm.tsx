"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/misc";
import { hasErrors } from "./editor-utils";
import { describedBy, Field, inputClass, Panel, Toggle } from "./fields";
import { useToast } from "./Toast";

const GSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const RZP_KEY = /^rzp_(test|live)_[A-Za-z0-9]{8,}$/;

type Notify = { orders: boolean; refunds: boolean; seats: boolean; weekly: boolean };
type FieldKey = "name" | "email" | "gst" | "keyId" | "secret";

export function SettingsForm({ defaults }: { defaults: { name: string; email: string } }) {
  const toast = useToast();
  const [name, setName] = useState(defaults.name);
  const [email, setEmail] = useState(defaults.email);
  const [bio, setBio] = useState("Cognitive learning strategist · creator of Scientific Retention Management");
  const [keyId, setKeyId] = useState("");
  const [secret, setSecret] = useState("");
  const [isSecretShown, setIsSecretShown] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [gst, setGst] = useState("");
  const [notify, setNotify] = useState<Notify>({ orders: true, refunds: true, seats: true, weekly: false });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  function connect() {
    const found = {
      keyId: RZP_KEY.test(keyId.trim()) ? undefined : "Key IDs look like rzp_test_XXXXXXXX.",
      secret: secret.trim().length >= 12 ? undefined : "Paste the key secret from the Razorpay dashboard.",
    };
    setErrors((e) => ({ ...e, ...found }));
    if (hasErrors(found)) return;
    // BACKEND: POST /api/admin/payments/razorpay — store the secret server-side only (secret manager), never in the client.
    setIsConnected(true);
    setSecret("");
    toast("Demo: Razorpay marked as connected (test mode). Nothing was sent.");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = {
      name: name.trim() ? undefined : "Name is required.",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : "Enter a valid email.",
      gst: !gst || GSTIN.test(gst) ? undefined : "A GSTIN has 15 characters, e.g. 08ABCDE1234F1Z5.",
    };
    setErrors((prev) => ({ ...prev, ...found }));
    if (hasErrors(found)) {
      toast("Please fix the highlighted fields.", "danger");
      return;
    }
    // BACKEND: PATCH /api/admin/settings { profile, gstin, notifications }
    toast("Settings saved (demo — not persisted).");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 xl:grid-cols-2">
      <Panel id="profile" eyebrow="Public profile" title="Profile">
        <div className="grid gap-4">
          <Field id="s-name" label="Display name" error={errors.name}>
            <input id="s-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("s-name", undefined, errors.name)} />
          </Field>
          <Field id="s-email" label="Contact email" error={errors.email}>
            <input id="s-email" type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("s-email", undefined, errors.email)} />
          </Field>
          <Field id="s-bio" label="Short bio">
            <textarea id="s-bio" rows={3} className={inputClass} value={bio} onChange={(e) => setBio(e.target.value)} />
          </Field>
        </div>
      </Panel>

      <Panel
        id="payments"
        eyebrow="Payments"
        title="Razorpay"
        action={isConnected ? <Badge tone="success">✓ Connected · test mode</Badge> : <Badge tone="recall">Not connected</Badge>}
      >
        <p className="rounded-md border border-dashed border-recall bg-recall-soft px-3 py-2 text-sm text-recall-text">
          Demo only — keys entered here are not stored or sent anywhere.
        </p>
        <div className="mt-4 grid gap-4">
          <Field id="s-key" label="Key ID" error={errors.keyId}>
            <input id="s-key" className={`${inputClass} font-mono text-sm`} placeholder="rzp_test_XXXXXXXX" value={keyId} onChange={(e) => setKeyId(e.target.value)} autoComplete="off" aria-invalid={Boolean(errors.keyId)} aria-describedby={describedBy("s-key", undefined, errors.keyId)} />
          </Field>
          <Field id="s-secret" label="Key secret" error={errors.secret}>
            <div className="flex gap-2">
              <input
                id="s-secret"
                type={isSecretShown ? "text" : "password"}
                className={`${inputClass} font-mono text-sm`}
                placeholder={isConnected ? "•••••••••••• (saved)" : "Paste secret"}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                autoComplete="off"
                aria-invalid={Boolean(errors.secret)}
                aria-describedby={describedBy("s-secret", undefined, errors.secret)}
              />
              <Button variant="ghost" size="sm" className="h-auto" onClick={() => setIsSecretShown((v) => !v)} aria-pressed={isSecretShown}>
                {isSecretShown ? "Hide" : "Show"}
              </Button>
            </div>
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={connect}>
              {isConnected ? "Reconnect" : "Connect Razorpay"}
            </Button>
            <span className="text-xs text-muted">UPI, cards and netbanking via Razorpay Checkout.</span>
          </div>
        </div>
      </Panel>

      <Panel id="tax" eyebrow="Invoices" title="Tax">
        <Field id="s-gst" label="GSTIN" hint="Printed on invoices. Leave empty if not registered." error={errors.gst}>
          <input
            id="s-gst"
            className={`${inputClass} font-mono uppercase`}
            maxLength={15}
            value={gst}
            placeholder="08ABCDE1234F1Z5"
            onChange={(e) => setGst(e.target.value.toUpperCase().replace(/\s/g, ""))}
            aria-invalid={Boolean(errors.gst)}
            aria-describedby={describedBy("s-gst", "hint", errors.gst)}
          />
        </Field>
      </Panel>

      <Panel id="notify" eyebrow="Email me when" title="Notifications">
        <div className="space-y-4">
          <Toggle id="n-orders" label="A new order is paid" checked={notify.orders} onChange={(v) => setNotify((n) => ({ ...n, orders: v }))} />
          <Toggle id="n-refunds" label="A refund is requested" checked={notify.refunds} onChange={(v) => setNotify((n) => ({ ...n, refunds: v }))} />
          <Toggle id="n-seats" label="An event passes 80% booked" checked={notify.seats} onChange={(v) => setNotify((n) => ({ ...n, seats: v }))} />
          <Toggle id="n-weekly" label="Weekly summary" hint="Mondays, 8 am IST" checked={notify.weekly} onChange={(v) => setNotify((n) => ({ ...n, weekly: v }))} />
        </div>
      </Panel>

      <div className="xl:col-span-2">
        <Button type="submit">Save settings</Button>
      </div>
    </form>
  );
}
