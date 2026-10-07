"use client";

import Link from "next/link";
import { CartLines } from "@/components/cart/CartLines";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { cartActions, useCart } from "@/lib/cart/store";
import { useAppliedCoupon } from "./coupon-store";
import { CouponField } from "./CouponField";
import { computeTotals, hasPaperback } from "./pricing";
import { TotalsRows } from "./TotalsRows";

export function CartView() {
  const { items, count } = useCart();
  const coupon = useAppliedCoupon();

  if (items.length === 0) {
    return (
      <div className="page-wrap pb-[var(--section-y)]">
        <div className="mx-auto max-w-xl rounded-lg bg-bg-alt px-6 py-16 text-center">
          <RhythmMark className="mx-auto w-16 text-brand" />
          <h2 className="mt-6 text-[length:var(--text-2xl)]">Your cart is resting.</h2>
          <p className="mt-3 text-muted">Programs, books and event seats you add will wait for you here.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/programs">Browse programs</ButtonLink>
            <ButtonLink href="/books" variant="secondary">
              See the books
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  const totals = computeTotals(items, coupon);
  const isShippable = hasPaperback(items);

  return (
    <div className="page-wrap grid gap-10 pb-[var(--section-y)] lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14">
      <section aria-labelledby="cart-lines-title" className="min-w-0">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 id="cart-lines-title" className="text-xl">
            {count} {count === 1 ? "item" : "items"}
          </h2>
          <Link href="/programs" className="inline-flex min-h-10 items-center text-sm font-semibold text-brand hover:underline">
            Continue browsing
          </Link>
        </div>
        <CartLines items={items} onRemove={cartActions.remove} onQuantity={cartActions.setQuantity} />
      </section>

      <aside aria-labelledby="summary-title" className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
        <div className="rounded-lg bg-surface p-6 shadow-2 ring-1 ring-line">
          <h2 id="summary-title" className="text-xl">
            Order summary
          </h2>
          <div className="mt-5">
            <CouponField />
          </div>
          <div className="mt-4 border-t border-line pt-5">
            <TotalsRows totals={totals} hasShippable={isShippable} />
          </div>
          <Link href="/checkout" className={buttonClass("primary", "lg", "mt-6 w-full")}>
            Checkout
          </Link>
          <p className="mt-3 text-center text-xs text-muted">Prices include GST · UPI, cards and netbanking accepted</p>
        </div>
      </aside>
    </div>
  );
}
