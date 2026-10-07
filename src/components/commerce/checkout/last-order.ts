"use client";

/*
 * Hand-off between /checkout and /checkout/success without query strings:
 * the confirmed order is kept in sessionStorage for this tab.
 * BACKEND: replace with GET /api/orders/:id after payment verification.
 */
import { useMemo, useSyncExternalStore } from "react";
import type { CartItem, Order } from "@/lib/types";
import type { OrderTotals } from "@/components/commerce/cart/pricing";

const KEY = "kc-last-order-v1";

export interface LastOrder extends Omit<Order, "items" | "totalInr"> {
  items: Pick<CartItem, "kind" | "slug" | "title" | "variant" | "quantity" | "unitPriceInr">[];
  totals: OrderTotals;
}

export function saveLastOrder(order: LastOrder): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Storage blocked: the success page will show its generic fallback.
  }
}

export function makeOrderId(): string {
  return `KC-${Math.floor(10000 + Math.random() * 90000)}`;
}

function readRaw(): string | null {
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

const noopSubscribe = () => () => {};

/** `undefined` while server-rendering, `null` when nothing stored. */
export function useLastOrder(): LastOrder | null | undefined {
  const raw = useSyncExternalStore(noopSubscribe, readRaw, () => undefined);
  return useMemo(() => {
    if (raw === undefined) return undefined;
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as LastOrder;
      return typeof parsed?.id === "string" && Array.isArray(parsed.items) ? parsed : null;
    } catch {
      return null;
    }
  }, [raw]);
}
