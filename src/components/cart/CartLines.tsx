"use client";

import { formatInr } from "@/lib/format";
import type { CartItem } from "@/lib/types";

type Props = {
  items: CartItem[];
  onRemove: (id: string) => void;
  onQuantity: (id: string, quantity: number) => void;
  compact?: boolean;
};

const KIND_LABEL: Record<CartItem["kind"], string> = { course: "Program", book: "Book", event: "Event seat" };

export function CartLines({ items, onRemove, onQuantity, compact }: Props) {
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.id} className={`flex gap-4 ${compact ? "py-4" : "py-6"}`}>
          <div
            className="grid h-16 w-12 shrink-0 place-items-center rounded-sm text-[0.6rem] font-bold tracking-wider text-paper uppercase"
            style={{ background: item.kind === "book" ? "var(--violet)" : item.kind === "course" ? "var(--ink)" : "var(--marigold-deep)" }}
            aria-hidden="true"
          >
            {KIND_LABEL[item.kind].split(" ")[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-wider text-recall-text uppercase">{KIND_LABEL[item.kind]}</p>
            <p className="font-display text-lg leading-snug">{item.title}</p>
            <p className="text-sm text-muted capitalize">{item.variant.replace("-", " ")}</p>
            <div className="mt-2 flex items-center gap-3">
              {item.kind === "course" ? (
                <span className="text-sm text-muted">Single enrolment</span>
              ) : (
                <div className="inline-flex items-center rounded-full ring-1 ring-line-strong" role="group" aria-label={`Quantity for ${item.title}`}>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-soft"
                    onClick={() => onQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-soft"
                    onClick={() => onQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}
              <button type="button" onClick={() => onRemove(item.id)} className="text-sm text-muted underline underline-offset-2 hover:text-danger">
                Remove
              </button>
            </div>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">{formatInr(item.unitPriceInr * item.quantity)}</p>
        </li>
      ))}
    </ul>
  );
}
