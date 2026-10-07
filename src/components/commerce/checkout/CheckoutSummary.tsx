import { formatInr } from "@/lib/format";
import type { CartItem } from "@/lib/types";
import { TotalsRows } from "@/components/commerce/cart/TotalsRows";
import type { OrderTotals } from "@/components/commerce/cart/pricing";

type Props = {
  items: CartItem[];
  totals: OrderTotals;
  hasShippable: boolean;
};

const KIND: Record<CartItem["kind"], string> = { course: "Program", book: "Book", event: "Event seat" };

function SummaryBody({ items, totals, hasShippable }: Props) {
  return (
    <>
      <ul className="divide-y divide-line">
        {items.map((i) => (
          <li key={i.id} className="flex gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wider text-recall-text uppercase">{KIND[i.kind]}</p>
              <p className="leading-snug">{i.title}</p>
              <p className="text-sm text-muted capitalize">
                {i.variant.replace("-", " ")}
                {i.quantity > 1 ? ` × ${i.quantity}` : ""}
              </p>
            </div>
            <p className="shrink-0 tabular-nums">{formatInr(i.unitPriceInr * i.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t border-line pt-4">
        <TotalsRows totals={totals} hasShippable={hasShippable} />
      </div>
    </>
  );
}

/* Collapsible on phones (native <details>), sticky card on desktop. */
export function CheckoutSummary(props: Props) {
  return (
    <>
      <details className="group rounded-lg bg-surface ring-1 ring-line lg:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="font-semibold">
            <span className="group-open:hidden">Show</span>
            <span className="hidden group-open:inline">Hide</span> order summary
          </span>
          <span className="font-display text-lg font-semibold tabular-nums">{formatInr(props.totals.totalInr)}</span>
        </summary>
        <div className="border-t border-line px-5 pb-5">
          <SummaryBody {...props} />
        </div>
      </details>

      <aside aria-labelledby="checkout-summary-title" className="hidden lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:block">
        <div className="rounded-lg bg-surface p-6 shadow-2 ring-1 ring-line">
          <h2 id="checkout-summary-title" className="text-xl">
            Order summary
          </h2>
          <div className="mt-2">
            <SummaryBody {...props} />
          </div>
        </div>
      </aside>
    </>
  );
}
