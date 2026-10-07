"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatInr } from "@/lib/format";
import { CardPanel, NetbankingPanel, UpiPanel, type PanelProps } from "./PaymentPanels";
import { validatePayment, type PayMethod, type PaymentErrors, type PaymentInput } from "./validation";

type Props = {
  method: PayMethod;
  value: PaymentInput;
  totalInr: number;
  onMethod: (m: PayMethod) => void;
  onChange: (next: PaymentInput) => void;
  onBack: () => void;
  onPay: () => void;
};

const METHODS: { id: PayMethod; label: string; note: string }[] = [
  { id: "UPI", label: "UPI", note: "GPay, PhonePe, Paytm, BHIM" },
  { id: "Card", label: "Card", note: "Debit or credit" },
  { id: "Netbanking", label: "Netbanking", note: "All major banks" },
];

const PANELS: Record<PayMethod, (p: PanelProps) => React.ReactNode> = {
  UPI: UpiPanel,
  Card: CardPanel,
  Netbanking: NetbankingPanel,
};

export function PaymentForm({ method, value, totalInr, onMethod, onChange, onBack, onPay }: Props) {
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [touched, setTouched] = useState<Partial<Record<keyof PaymentInput, boolean>>>({});
  const errors = validatePayment(method, value);
  const isValid = Object.keys(errors).length === 0;
  const shownErrors: PaymentErrors = Object.fromEntries(
    Object.entries(errors).filter(([k]) => touched[k as keyof PaymentInput]),
  );

  function handleTabKey(e: React.KeyboardEvent, index: number) {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | undefined;
    if (e.key in keys) next = (index + keys[e.key] + METHODS.length) % METHODS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = METHODS.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    onMethod(METHODS[next].id);
    tabRefs.current[next]?.focus();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isValid) onPay();
  }

  const Panel = PANELS[method];
  const panelProps: PanelProps = {
    uid,
    value,
    errors: shownErrors,
    set: (k, v) => onChange({ ...value, [k]: v }),
    blur: (k) => () => setTouched((t) => ({ ...t, [k]: true })),
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3 id={`${uid}-methods`} className="font-display text-xl">
        How would you like to pay?
      </h3>
      <div role="tablist" aria-labelledby={`${uid}-methods`} className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-bg-alt p-1.5">
        {METHODS.map((m, i) => {
          const isSelected = m.id === method;
          return (
            <button
              key={m.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${m.id}`}
              aria-selected={isSelected}
              aria-controls={`${uid}-panel`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onMethod(m.id)}
              onKeyDown={(e) => handleTabKey(e, i)}
              className={`min-h-14 rounded-md px-2 py-2 text-center transition-[background-color,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-out)] ${
                isSelected ? "bg-surface shadow-1 ring-1 ring-brand" : "hover:bg-surface/60"
              }`}
            >
              <span className={`block font-semibold ${isSelected ? "text-brand" : ""}`}>{m.label}</span>
              <span className="hidden text-xs text-muted sm:block">{m.note}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${method}`} className="mt-6">
        <Panel {...panelProps} />
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack}>
          ← Back to details
        </Button>
        <Button type="submit" size="lg" disabled={!isValid} aria-describedby={`${uid}-paynote`}>
          Pay {formatInr(totalInr)}
        </Button>
      </div>
      <p id={`${uid}-paynote`} className="mt-3 text-xs text-muted sm:text-right" aria-live="polite">
        {isValid ? "Payments are encrypted and processed by our payment partner." : "Complete the payment details to continue."}
      </p>
    </form>
  );
}
