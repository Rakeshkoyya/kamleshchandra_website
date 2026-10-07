"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { describedBy, Field, inputClass } from "@/components/studio/fields";
import { OTP_LENGTH, OtpInput } from "./OtpInput";

const DEMO_CODE = "123456";
const emptyOtp = () => Array.from({ length: OTP_LENGTH }, () => "");

type Channel = "phone" | "email";
type Step = "identify" | "verify";

function validate(channel: Channel, value: string): string | undefined {
  if (channel === "phone") {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 10) return "Enter your 10-digit mobile number.";
    if (!/^[6-9]/.test(digits)) return "Indian mobile numbers start with 6, 7, 8 or 9.";
    return undefined;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : "Enter a valid email address.";
}

export function SignInFlow() {
  const router = useRouter();
  const [channel, setChannel] = useState<Channel>("phone");
  const [step, setStep] = useState<Step>("identify");
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState<string>();
  const [otp, setOtp] = useState<string[]>(emptyOtp);
  const [otpError, setOtpError] = useState<string>();
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  function switchChannel(next: Channel) {
    setChannel(next);
    setContact("");
    setContactError(undefined);
    setStep("identify");
    setOtp(emptyOtp());
  }

  function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const error = validate(channel, contact);
    setContactError(error);
    if (error) {
      setStatus(error);
      return;
    }
    // BACKEND: POST /api/auth/otp { channel, contact } — send the code via SMS (e.g. MSG91) or email.
    setStep("verify");
    setOtp(emptyOtp());
    setOtpError(undefined);
    setStatus(`Code sent to ${destination}. Enter the 6 digits.`);
  }

  function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setOtpError("Enter all 6 digits.");
      setStatus("Enter all 6 digits.");
      return;
    }
    // BACKEND: POST /api/auth/verify { contact, code } → sets an httpOnly session cookie.
    if (code !== DEMO_CODE) {
      setOtpError("That code didn't match. Check the message and try again.");
      setStatus("That code didn't match.");
      return;
    }
    setIsBusy(true);
    setStatus("Signed in. Taking you to My learning…");
    router.push("/account");
  }

  const destination = channel === "phone" ? `+91 ${contact.replace(/\D/g, "")}` : contact.trim();
  const contactId = channel === "phone" ? "signin-phone" : "signin-email";
  const contactHint = channel === "phone" ? "We'll text you a 6-digit code." : "We'll email you a 6-digit code.";

  return (
    <div className="rounded-lg border border-line bg-surface p-6 shadow-2 md:p-8">
      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      {step === "identify" ? (
        <form onSubmit={handleSend} noValidate className="space-y-5">
          {channel === "phone" ? (
            <Field id={contactId} label="Mobile number" hint={contactHint} error={contactError}>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-line-strong bg-bg-alt px-3 text-[0.95rem] font-semibold text-muted">
                  +91
                </span>
                <input
                  id={contactId}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="98765 43210"
                  value={contact}
                  onChange={(e) => setContact(e.target.value.replace(/[^\d\s]/g, "").slice(0, 12))}
                  aria-invalid={Boolean(contactError)}
                  aria-describedby={describedBy(contactId, contactHint, contactError)}
                  className={`${inputClass} rounded-l-none tracking-wide`}
                />
              </div>
            </Field>
          ) : (
            <Field id={contactId} label="Email address" hint={contactHint} error={contactError}>
              <input
                id={contactId}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                aria-invalid={Boolean(contactError)}
                aria-describedby={describedBy(contactId, contactHint, contactError)}
                className={inputClass}
              />
            </Field>
          )}
          <Button type="submit" size="lg" className="w-full">
            Send OTP
          </Button>
          <p className="text-center text-sm text-muted">
            {channel === "phone" ? "No mobile handy? " : "Prefer your phone? "}
            <button
              type="button"
              className="font-semibold text-brand underline underline-offset-4"
              onClick={() => switchChannel(channel === "phone" ? "email" : "phone")}
            >
              {channel === "phone" ? "Continue with email" : "Use mobile number"}
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerify} noValidate className="space-y-5">
          <div>
            <p className="text-sm font-semibold">Enter the code</p>
            <p id="otp-hint" className="mt-0.5 text-sm text-muted">
              Sent to <span className="font-semibold text-ink">{destination}</span>.{" "}
              <button type="button" className="font-semibold text-brand underline underline-offset-4" onClick={() => setStep("identify")}>
                Change
              </button>
            </p>
          </div>
          <OtpInput
            value={otp}
            onChange={(next) => {
              setOtp(next);
              setOtpError(undefined);
            }}
            hasError={Boolean(otpError)}
            describedBy={otpError ? "otp-hint otp-error" : "otp-hint"}
          />
          {otpError ? (
            <p id="otp-error" className="text-sm font-medium text-danger">
              {otpError}
            </p>
          ) : null}
          <Button type="submit" size="lg" className="w-full" disabled={isBusy}>
            {isBusy ? "Signing in…" : "Verify & sign in"}
          </Button>
          <button
            type="button"
            className="mx-auto block text-sm font-semibold text-brand underline underline-offset-4"
            onClick={() => {
              // BACKEND: POST /api/auth/otp again (rate-limit resends server-side).
              setOtp(emptyOtp());
              setStatus(`A new code was sent to ${destination}.`);
            }}
          >
            Resend code
          </button>
        </form>
      )}

      <p className="mt-6 flex items-center justify-center gap-2 border-t border-dashed border-line pt-4 text-xs text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-recall" aria-hidden="true" />
        Demo: any valid number works — the code is <span className="font-semibold tabular-nums text-ink">123456</span>
      </p>
    </div>
  );
}
