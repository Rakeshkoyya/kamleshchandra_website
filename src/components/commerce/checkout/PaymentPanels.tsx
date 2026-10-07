"use client";

import { Field, TextField, inputClass } from "./Field";
import { UpiQr } from "./UpiQr";
import { BANKS, digitsOnly, formatCardNumber, formatExpiry, type PaymentErrors, type PaymentInput } from "./validation";

export type PanelProps = {
  uid: string;
  value: PaymentInput;
  errors: PaymentErrors;
  set: (k: keyof PaymentInput, v: string) => void;
  blur: (k: keyof PaymentInput) => () => void;
};

export function UpiPanel({ uid, value, errors, set, blur }: PanelProps) {
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_11rem] md:items-start">
      <div>
        <TextField
          id={`${uid}-upi`}
          label="UPI ID"
          placeholder="yourname@okbank"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={value.upiId}
          onChange={(e) => set("upiId", e.target.value.trim())}
          onBlur={blur("upiId")}
          error={errors.upiId}
          hint={
            <>
              We&rsquo;ll send a collect request to your UPI app. Demo tip: use <code className="font-semibold">fail@upi</code> to
              see a failed payment.
            </>
          }
        />
      </div>
      <div className="hidden text-center md:block">
        <div className="rounded-md bg-surface p-3 ring-1 ring-line">
          <UpiQr className="mx-auto w-full" />
        </div>
        <p className="mt-2 text-xs text-muted">Or scan to pay via any UPI app</p>
      </div>
    </div>
  );
}

export function CardPanel({ uid, value, errors, set, blur }: PanelProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField
        id={`${uid}-cardnum`}
        label="Card number"
        fieldClassName="sm:col-span-2"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="1234 5678 9012 3456"
        className="tabular-nums tracking-wider"
        value={value.cardNumber}
        onChange={(e) => set("cardNumber", formatCardNumber(e.target.value))}
        onBlur={blur("cardNumber")}
        error={errors.cardNumber}
        hint="Demo: 4111 1111 1111 1111 with any future expiry."
      />
      <TextField
        id={`${uid}-exp`}
        label="Expiry (MM/YY)"
        inputMode="numeric"
        autoComplete="cc-exp"
        placeholder="MM/YY"
        value={value.cardExpiry}
        onChange={(e) => set("cardExpiry", formatExpiry(e.target.value))}
        onBlur={blur("cardExpiry")}
        error={errors.cardExpiry}
      />
      <TextField
        id={`${uid}-cvv`}
        label="CVV"
        type="password"
        inputMode="numeric"
        autoComplete="cc-csc"
        placeholder="•••"
        value={value.cardCvv}
        onChange={(e) => set("cardCvv", digitsOnly(e.target.value, 4))}
        onBlur={blur("cardCvv")}
        error={errors.cardCvv}
      />
      <TextField
        id={`${uid}-cardname`}
        label="Name on card"
        fieldClassName="sm:col-span-2"
        autoComplete="cc-name"
        value={value.cardName}
        onChange={(e) => set("cardName", e.target.value)}
        onBlur={blur("cardName")}
        error={errors.cardName}
      />
    </div>
  );
}

export function NetbankingPanel({ uid, value, errors, set, blur }: PanelProps) {
  return (
    <Field id={`${uid}-bank`} label="Your bank" error={errors.bank} hint="You'll be taken to your bank's secure page to approve the payment.">
      {(a11y) => (
        <select {...a11y} value={value.bank} onChange={(e) => set("bank", e.target.value)} onBlur={blur("bank")} className={inputClass}>
          <option value="">Choose your bank…</option>
          {BANKS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
