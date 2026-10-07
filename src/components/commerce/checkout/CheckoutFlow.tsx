"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/store";
import { useAppliedCoupon } from "@/components/commerce/cart/coupon-store";
import { computeTotals, hasPaperback } from "@/components/commerce/cart/pricing";
import { CheckoutSummary } from "./CheckoutSummary";
import { DetailsForm } from "./DetailsForm";
import { makeOrderId, saveLastOrder } from "./last-order";
import { PaymentForm } from "./PaymentForm";
import { FailedPanel, ProcessingPanel } from "./StatusPanels";
import { StepsIndicator } from "./StepsIndicator";
import { EMPTY_DETAILS, EMPTY_PAYMENT, type Details, type PayMethod, type PaymentInput } from "./validation";

type Stage = "details" | "payment" | "processing" | "failed";

const PROCESSING_MS = 1800;
const FAIL_UPI_ID = "fail@upi";

const STAGE_TITLE: Record<Stage, string> = {
  details: "Your details",
  payment: "Payment",
  processing: "Processing payment",
  failed: "Payment failed",
};

export function CheckoutFlow() {
  const router = useRouter();
  const { items } = useCart();
  const coupon = useAppliedCoupon();
  const [stage, setStage] = useState<Stage>("details");
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [method, setMethod] = useState<PayMethod>("UPI");
  const [payment, setPayment] = useState<PaymentInput>(EMPTY_PAYMENT);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);
  const timer = useRef<number | undefined>(undefined);

  const needsAddress = hasPaperback(items);
  const totals = computeTotals(items, coupon);

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stage]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function handlePay() {
    setStage("processing");
    // BACKEND: create-order — POST /api/orders { items, coupon, details } → { orderId, gatewayOrderId, amountInr }.
    //          The server recomputes totals; the browser amount is display-only.
    // BACKEND: open the gateway checkout (e.g. Razorpay) with gatewayOrderId, then verify-payment —
    //          POST /api/payments/verify { orderId, paymentId, signature } before showing success.
    timer.current = window.setTimeout(() => {
      if (method === "UPI" && payment.upiId.toLowerCase() === FAIL_UPI_ID) {
        setStage("failed");
        return;
      }
      saveLastOrder({
        id: makeOrderId(),
        createdAt: new Date().toISOString(),
        customerName: details.name.trim(),
        customerEmail: details.email.trim(),
        items: items.map(({ kind, slug, title, variant, quantity, unitPriceInr }) => ({ kind, slug, title, variant, quantity, unitPriceInr })),
        totals,
        method,
        status: "paid",
        isSample: true,
      });
      router.push("/checkout/success");
    }, PROCESSING_MS);
  }

  if (items.length === 0 && stage !== "processing") {
    return (
      <div className="page-wrap pb-[var(--section-y)]">
        <div className="mx-auto max-w-xl rounded-lg bg-bg-alt px-6 py-14 text-center">
          <h2 className="text-[length:var(--text-2xl)]">There&rsquo;s nothing to check out yet.</h2>
          <p className="mt-3 text-muted">Add a program, book or event seat, then come back here.</p>
          <ButtonLink href="/programs" className="mt-8">
            Browse programs
          </ButtonLink>
        </div>
      </div>
    );
  }

  const stepIndex = stage === "details" ? 0 : 1;

  return (
    <div className="page-wrap pb-[var(--section-y)]">
      <div className="max-w-2xl">
        <StepsIndicator current={stepIndex} />
      </div>
      <p className="sr-only" aria-live="polite">
        Step {stepIndex + 1} of 3: {STAGE_TITLE[stage]}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14">
        <div className="lg:col-start-2 lg:row-start-1">
          <CheckoutSummary items={items} totals={totals} hasShippable={needsAddress} />
        </div>

        <section aria-labelledby="checkout-stage-title" className="min-w-0 rounded-lg bg-surface p-5 ring-1 ring-line sm:p-8 lg:col-start-1 lg:row-start-1">
          <h2 id="checkout-stage-title" ref={headingRef} tabIndex={-1} className="text-[length:var(--text-xl)] focus:outline-none">
            {STAGE_TITLE[stage]}
          </h2>

          {stage !== "details" ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-md bg-bg-alt px-4 py-3 text-sm">
              <p className="min-w-0 break-words">
                <span className="font-semibold">{details.name}</span> · {details.email} · +91 {details.phone}
              </p>
              {stage === "payment" ? (
                <button type="button" onClick={() => setStage("details")} className="min-h-10 font-semibold text-brand underline underline-offset-2">
                  Edit
                </button>
              ) : null}
            </div>
          ) : null}

          <div key={stage} className="rise-in mt-6">
            {stage === "details" ? (
              <DetailsForm details={details} needsAddress={needsAddress} onChange={setDetails} onContinue={() => setStage("payment")} />
            ) : null}
            {stage === "payment" ? (
              <PaymentForm
                method={method}
                value={payment}
                totalInr={totals.totalInr}
                onMethod={setMethod}
                onChange={setPayment}
                onBack={() => setStage("details")}
                onPay={handlePay}
              />
            ) : null}
            {stage === "processing" ? <ProcessingPanel totalInr={totals.totalInr} method={method} /> : null}
            {stage === "failed" ? (
              <FailedPanel
                reason={`Your UPI app declined the request for ${payment.upiId}. This can happen if the request expired or the PIN was wrong.`}
                onRetry={() => setStage("payment")}
                onChangeMethod={() => {
                  setMethod("Card");
                  setStage("payment");
                }}
              />
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
