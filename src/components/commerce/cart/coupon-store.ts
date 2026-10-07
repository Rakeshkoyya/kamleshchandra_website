"use client";

/*
 * Applied coupon code, shared by /cart and /checkout for this browser tab.
 * BACKEND: attach the coupon to the server cart instead.
 */
import { useSyncExternalStore } from "react";

const KEY = "kc-coupon-v1";
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function write(code: string | null): void {
  try {
    if (code) window.sessionStorage.setItem(KEY, code);
    else window.sessionStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the coupon simply won't carry over to checkout.
  }
  listeners.forEach((l) => l());
}

export const couponActions = {
  apply: (code: string) => write(code),
  clear: () => write(null),
};

export function useAppliedCoupon(): string | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => null,
  );
}
