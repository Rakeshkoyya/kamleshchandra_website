import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatInr } from "@/lib/format";
import type { CartItem } from "@/lib/types";

type Props = {
  title: string;
  priceInr: number;
  compareAtInr?: number;
  item: Omit<CartItem, "id" | "quantity">;
  label?: string;
};

/* Pinned buy bar for phones; the page adds bottom padding so nothing hides behind it. */
export function MobileBuyBar({ title, priceInr, compareAtInr, item, label = "Add to cart" }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden">
      <div className="page-wrap flex items-center justify-between gap-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted">{title}</p>
          <p className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold">{formatInr(priceInr)}</span>
            {compareAtInr ? (
              <s className="text-xs text-muted">
                <span className="sr-only">was </span>
                {formatInr(compareAtInr)}
              </s>
            ) : null}
          </p>
        </div>
        <AddToCartButton item={item} label={label} size="md" />
      </div>
    </div>
  );
}
