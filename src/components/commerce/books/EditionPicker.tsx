"use client";

import { useId, useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BOOK_FORMAT_LABEL } from "@/lib/data/books";
import { formatInr } from "@/lib/format";
import type { Book, BookFormat } from "@/lib/types";

type Props = {
  book: Book;
};

const MAX_QTY = 20;

const FORMAT_NOTE: Record<BookFormat, string> = {
  paperback: "Ships in 3–5 days · ₹60 delivery",
  ebook: "Instant download (PDF & EPUB)",
  audiobook: "Stream or download",
};

export function EditionPicker({ book }: Props) {
  const groupId = useId();
  const firstInStock = book.editions.find((e) => e.inStock);
  const [format, setFormat] = useState<BookFormat | undefined>(firstInStock?.format);
  const [quantity, setQuantity] = useState(1);
  const edition = book.editions.find((e) => e.format === format);
  const isPreOrder = book.status === "pre-order";
  const canBuyMany = format === "paperback";
  const qty = canBuyMany ? quantity : 1;

  return (
    <div>
      <fieldset>
        <legend className="text-sm font-semibold">Choose an edition</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {book.editions.map((e) => {
            const id = `${groupId}-${e.format}`;
            const isChecked = e.format === format;
            return (
              <label
                key={e.format}
                htmlFor={id}
                className={`relative flex min-h-20 cursor-pointer flex-col justify-center rounded-md bg-surface p-4 ring-1 transition-shadow duration-[var(--dur-fast)] ease-[var(--ease-out)] has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-recall-text ${
                  isChecked ? "ring-2 ring-brand" : "ring-line-strong hover:ring-brand"
                } ${e.inStock ? "" : "cursor-not-allowed opacity-60"}`}
              >
                <input
                  id={id}
                  type="radio"
                  name={groupId}
                  value={e.format}
                  checked={isChecked}
                  disabled={!e.inStock}
                  onChange={() => setFormat(e.format)}
                  className="sr-only"
                />
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{BOOK_FORMAT_LABEL[e.format]}</span>
                  <span className="font-display text-lg font-semibold">{formatInr(e.priceInr)}</span>
                </span>
                <span className="mt-1 text-xs text-muted">{e.inStock ? FORMAT_NOTE[e.format] : "Out of stock"}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {canBuyMany ? (
        <div className="mt-5 flex items-center gap-4">
          <span id={`${groupId}-qty`} className="text-sm font-semibold">
            Quantity
          </span>
          <div className="inline-flex items-center rounded-full ring-1 ring-line-strong" role="group" aria-labelledby={`${groupId}-qty`}>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-soft disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center tabular-nums" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-soft disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
              disabled={quantity >= MAX_QTY}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {edition ? (
          <AddToCartButton
            item={{ kind: "book", slug: book.slug, title: book.title, variant: edition.format, unitPriceInr: edition.priceInr }}
            quantity={qty}
            label={isPreOrder ? `Pre-order · ${formatInr(edition.priceInr * qty)}` : `Add to cart · ${formatInr(edition.priceInr * qty)}`}
          />
        ) : (
          <p className="text-danger" role="status">
            All editions are out of stock right now.
          </p>
        )}
      </div>
      {isPreOrder ? (
        <p className="mt-3 text-sm text-muted">Pre-order now; you&rsquo;ll be charged today and notified on release. [Release date to confirm]</p>
      ) : null}
    </div>
  );
}
