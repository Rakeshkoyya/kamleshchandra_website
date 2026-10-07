import { formatInr } from "@/lib/format";
import type { OrderTotals } from "./pricing";

type Props = {
  totals: OrderTotals;
  hasShippable: boolean;
};

/* The money breakdown, shared by cart, checkout and the success page. */
export function TotalsRows({ totals, hasShippable }: Props) {
  return (
    <dl className="space-y-2.5 text-[0.98rem]">
      <div className="flex justify-between gap-4">
        <dt className="text-muted">Subtotal</dt>
        <dd className="tabular-nums">{formatInr(totals.subtotalInr)}</dd>
      </div>
      {totals.discountInr > 0 ? (
        <div className="flex justify-between gap-4 text-success">
          <dt>Coupon {totals.coupon ? `(${totals.coupon.code})` : ""}</dt>
          <dd className="tabular-nums">−{formatInr(totals.discountInr)}</dd>
        </div>
      ) : null}
      <div className="flex justify-between gap-4">
        <dt className="text-muted">Shipping</dt>
        <dd className="tabular-nums">{hasShippable ? formatInr(totals.shippingInr) : "Not needed"}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
        <dt className="font-semibold">Total</dt>
        <dd className="font-display text-2xl font-semibold tabular-nums">{formatInr(totals.totalInr)}</dd>
      </div>
      {totals.gstIncludedInr > 0 ? (
        <div className="flex justify-between gap-4 text-xs text-muted">
          <dt>Includes GST (18% on programs &amp; events)</dt>
          <dd className="tabular-nums">{formatInr(totals.gstIncludedInr)}</dd>
        </div>
      ) : null}
    </dl>
  );
}
