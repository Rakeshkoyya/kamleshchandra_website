import type { CartItem } from "@/lib/types";

/*
 * Order maths for the demo. One rule, used everywhere (cart, checkout, success):
 * - Listed prices INCLUDE GST. Programs and event seats carry 18% GST, which we
 *   show as an "included" line; books are shown without a GST line.
 * - Coupon discounts apply to the item subtotal, never to shipping.
 * - Shipping is a flat ₹60 when the cart holds any paperback.
 * BACKEND: the server must recompute all of this when creating the order —
 * never trust totals sent from the browser.
 */

export const GST_RATE = 0.18;
export const PAPERBACK_SHIPPING_INR = 60;

interface Coupon {
  code: string;
  rate: number;
  label: string;
}

/* BACKEND: validate coupons server-side (POST /api/coupons/validate). */
const DEMO_COUPONS: Coupon[] = [{ code: "RHYTHM10", rate: 0.1, label: "10% off" }];

export function findCoupon(code: string): Coupon | undefined {
  const normalised = code.trim().toUpperCase();
  return DEMO_COUPONS.find((c) => c.code === normalised);
}

export function hasPaperback(items: CartItem[]): boolean {
  return items.some((i) => i.kind === "book" && i.variant === "paperback");
}

export interface OrderTotals {
  subtotalInr: number;
  discountInr: number;
  shippingInr: number;
  gstIncludedInr: number;
  totalInr: number;
  coupon?: Coupon;
}

export function computeTotals(items: CartItem[], couponCode?: string | null): OrderTotals {
  const coupon = couponCode ? findCoupon(couponCode) : undefined;
  const rate = coupon?.rate ?? 0;
  const subtotalInr = items.reduce((n, i) => n + i.unitPriceInr * i.quantity, 0);
  const taxableGross = items
    .filter((i) => i.kind === "course" || i.kind === "event")
    .reduce((n, i) => n + i.unitPriceInr * i.quantity, 0);

  const discountInr = Math.round(subtotalInr * rate);
  const shippingInr = hasPaperback(items) ? PAPERBACK_SHIPPING_INR : 0;
  const gstIncludedInr = Math.round((taxableGross * (1 - rate) * GST_RATE) / (1 + GST_RATE));

  return {
    subtotalInr,
    discountInr,
    shippingInr,
    gstIncludedInr,
    totalInr: subtotalInr - discountInr + shippingInr,
    coupon,
  };
}
