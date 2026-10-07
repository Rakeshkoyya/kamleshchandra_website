"use client";

import { useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";

export const OTP_LENGTH = 6;

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  hasError?: boolean;
  describedBy?: string;
};

/** Six single-digit boxes: auto-advance, backspace goes back, paste fills all. */
export function OtpInput({ value, onChange, hasError = false, describedBy }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function focusBox(i: number) {
    refs.current[Math.max(0, Math.min(OTP_LENGTH - 1, i))]?.focus();
  }

  function setDigit(i: number, digit: string) {
    onChange(value.map((d, j) => (j === i ? digit : d)));
  }

  function handleInput(i: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setDigit(i, "");
      return;
    }
    if (digits.length > 1) {
      fillFrom(i, digits);
      return;
    }
    setDigit(i, digits);
    focusBox(i + 1);
  }

  function fillFrom(start: number, digits: string) {
    const next = [...value];
    for (let k = 0; k < digits.length && start + k < OTP_LENGTH; k++) next[start + k] = digits[k];
    onChange(next);
    focusBox(start + digits.length);
  }

  function handleKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      e.preventDefault();
      setDigit(i - 1, "");
      focusBox(i - 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(i + 1);
    }
  }

  function handlePaste(i: number, e: ClipboardEvent<HTMLInputElement>) {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!digits) return;
    e.preventDefault();
    fillFrom(i === 0 || digits.length >= OTP_LENGTH ? 0 : i, digits.slice(0, OTP_LENGTH));
  }

  return (
    <div className="flex gap-2 sm:gap-3" role="group" aria-label="One-time password, 6 digits" aria-describedby={describedBy}>
      {value.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={OTP_LENGTH}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={hasError || undefined}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.target.select()}
          className={`h-14 w-11 rounded-md border bg-surface text-center font-display text-2xl font-semibold tabular-nums sm:w-13 ${
            hasError ? "border-danger" : "border-line-strong"
          } focus:border-brand`}
        />
      ))}
    </div>
  );
}
