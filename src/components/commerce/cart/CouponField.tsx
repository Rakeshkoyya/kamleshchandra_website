"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { couponActions, useAppliedCoupon } from "./coupon-store";
import { findCoupon } from "./pricing";

type Status = { tone: "error"; text: string } | null;

export function CouponField() {
  const id = useId();
  const applied = useAppliedCoupon();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const appliedCoupon = applied ? findCoupon(applied) : undefined;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      setStatus({ tone: "error", text: "Enter a coupon code first." });
      return;
    }
    // BACKEND: POST /api/coupons/validate { code, cartId } — server decides eligibility.
    const coupon = findCoupon(trimmed);
    if (!coupon) {
      setStatus({ tone: "error", text: `“${trimmed.toUpperCase()}” isn’t a valid code. Check the spelling and try again.` });
      return;
    }
    couponActions.apply(coupon.code);
    setCode("");
    setStatus(null);
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-md bg-success-soft px-4 py-3 text-success" role="status">
        <p className="text-sm">
          <span className="font-semibold">{appliedCoupon.code}</span> applied — {appliedCoupon.label}
        </p>
        <button
          type="button"
          onClick={couponActions.clear}
          className="min-h-10 rounded-full px-3 text-sm font-semibold underline underline-offset-2 hover:bg-surface"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={id} className="text-sm font-semibold">
        Coupon code
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={id}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (status) setStatus(null);
          }}
          autoComplete="off"
          spellCheck={false}
          placeholder="e.g. RHYTHM10"
          aria-invalid={status?.tone === "error" || undefined}
          aria-describedby={`${id}-msg`}
          className="h-11 min-w-0 flex-1 rounded-md bg-surface px-3 uppercase ring-1 ring-line-strong placeholder:normal-case placeholder:text-muted focus:ring-2 focus:ring-brand focus:outline-none aria-invalid:ring-danger"
        />
        <Button type="submit" variant="secondary">
          Apply
        </Button>
      </div>
      <p id={`${id}-msg`} className="mt-2 min-h-5 text-sm text-danger" aria-live="polite">
        {status?.text ?? ""}
      </p>
    </form>
  );
}
