"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonClass } from "@/components/ui/Button";
import { cartActions, cartDrawer, useCart, useCartDrawerOpen } from "@/lib/cart/store";
import { formatInr } from "@/lib/format";
import { CartLines } from "./CartLines";

/* Slide-over cart built on native <dialog> (focus trap + Esc for free). */
export function CartDrawer() {
  const isOpen = useCartDrawerOpen();
  const { items, count, subtotalInr } = useCart();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) d.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="cart-title"
      onClose={cartDrawer.close}
      onClick={(e) => {
        if (e.target === ref.current) cartDrawer.close();
      }}
      className="cart-drawer m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-surface p-0 text-ink shadow-2 backdrop:bg-ink/45"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 id="cart-title" className="text-xl">
            Your cart <span className="font-sans text-base font-normal text-muted">({count})</span>
          </h2>
          <button
            type="button"
            onClick={cartDrawer.close}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-soft"
            aria-label="Close cart"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-xl">Nothing here yet.</p>
              <p className="mt-2 text-muted">Programs, books and event seats you add will appear here.</p>
              <Link href="/programs" onClick={cartDrawer.close} className={buttonClass("secondary", "md", "mt-6")}>
                Browse programs
              </Link>
            </div>
          ) : (
            <CartLines items={items} onRemove={cartActions.remove} onQuantity={cartActions.setQuantity} compact />
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-line px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-display text-2xl font-semibold">{formatInr(subtotalInr)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">GST and shipping (for paperbacks) are calculated at checkout.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href="/cart" onClick={cartDrawer.close} className={buttonClass("secondary", "md")}>
                View cart
              </Link>
              <Link href="/checkout" onClick={cartDrawer.close} className={buttonClass("primary", "md")}>
                Checkout
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
