"use client";

import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { cartActions } from "@/lib/cart/store";
import { formatDate, formatInr } from "@/lib/format";
import { couponActions } from "@/components/commerce/cart/coupon-store";
import { TotalsRows } from "@/components/commerce/cart/TotalsRows";
import { useLastOrder, type LastOrder } from "./last-order";

function nextSteps(order: LastOrder): { title: string; body: string }[] {
  const has = (pred: (i: LastOrder["items"][number]) => boolean) => order.items.some(pred);
  const steps: { title: string; body: string }[] = [];
  if (has((i) => i.kind === "course")) {
    steps.push({ title: "Your programs are ready", body: "They now appear in My learning — start the first lesson whenever you like." });
  }
  if (has((i) => i.kind === "book" && i.variant === "ebook")) {
    steps.push({ title: "Download your ebook", body: "A download link (PDF & EPUB) is in your email and in My learning." });
  }
  if (has((i) => i.kind === "book" && i.variant === "paperback")) {
    steps.push({ title: "Your paperback ships soon", body: "Expect delivery in 3–5 working days. We'll email the tracking link." });
  }
  if (has((i) => i.kind === "event")) {
    steps.push({ title: "Your seat is reserved", body: "Joining details and a calendar invite are on their way to your inbox." });
  }
  return steps;
}

export function SuccessView() {
  const order = useLastOrder();

  // The order is confirmed — empty the cart and forget the coupon (external stores, no React state).
  useEffect(() => {
    if (!order) return;
    cartActions.clear();
    couponActions.clear();
  }, [order]);

  if (order === undefined) {
    return <div className="page-wrap min-h-[50vh]" aria-busy="true" />;
  }

  if (order === null) {
    return (
      <div className="page-wrap pb-[var(--section-y)]">
        <div className="max-w-xl rounded-lg bg-bg-alt p-8">
          <h1 className="text-[length:var(--text-2xl)]">We couldn&rsquo;t find a recent order in this tab.</h1>
          <p className="mt-3 text-muted">If you&rsquo;ve just paid, your confirmation email has the details, and your purchases are in My learning.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/account">Go to My learning</ButtonLink>
            <ButtonLink href="/programs" variant="secondary">
              Browse programs
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  const hasShippable = order.items.some((i) => i.kind === "book" && i.variant === "paperback");

  return (
    <div className="page-wrap grid gap-12 pt-10 pb-[var(--section-y)] md:pt-16 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
      <div className="min-w-0">
        <RhythmMark className="rise-in w-20 text-brand" />
        <p className="eyebrow rise-in mt-6" style={{ ["--i" as string]: 1 }}>
          Payment received
        </p>
        <h1 className="rise-in mt-3 text-[length:var(--text-3xl)]" style={{ ["--i" as string]: 1 }}>
          Thank you, {order.customerName.split(" ")[0]}.
        </h1>
        <p className="rise-in mt-4 max-w-[56ch] text-lg text-muted" style={{ ["--i" as string]: 2 }}>
          Order <span className="font-semibold text-ink">{order.id}</span> is confirmed. A receipt is on its way to{" "}
          <span className="font-semibold text-ink">{order.customerEmail}</span>.
        </p>

        <section aria-labelledby="next-title" className="rise-in mt-12" style={{ ["--i" as string]: 3 }}>
          <h2 id="next-title" className="text-[length:var(--text-xl)]">
            What happens next
          </h2>
          <ol className="mt-6 space-y-6 border-l-2 border-line pl-6">
            {nextSteps(order).map((s) => (
              <li key={s.title} className="relative">
                <span className="absolute top-1.5 -left-[1.95rem] h-3.5 w-3.5 rounded-full bg-recall ring-4 ring-bg" aria-hidden="true" />
                <p className="font-semibold">{s.title}</p>
                <p className="text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/account" size="lg">
            Go to My learning
          </ButtonLink>
          <ButtonLink href="/programs" variant="secondary" size="lg">
            Keep exploring
          </ButtonLink>
        </div>
      </div>

      <aside aria-labelledby="receipt-title" className="lg:pt-24">
        <div className="rounded-lg bg-surface p-6 shadow-2 ring-1 ring-line">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="receipt-title" className="text-xl">
              Receipt
            </h2>
            <p className="text-sm text-muted">{formatDate(order.createdAt)}</p>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <dt className="text-muted">Order</dt>
            <dd className="text-right font-semibold">{order.id}</dd>
            <dt className="text-muted">Paid with</dt>
            <dd className="text-right">{order.method}</dd>
          </dl>
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {order.items.map((i) => (
              <li key={`${i.kind}:${i.slug}:${i.variant}`} className="flex justify-between gap-3 py-3">
                <span className="min-w-0">
                  <span className="block leading-snug">{i.title}</span>
                  <span className="block text-sm text-muted capitalize">
                    {i.variant.replace("-", " ")}
                    {i.quantity > 1 ? ` × ${i.quantity}` : ""}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums">{formatInr(i.unitPriceInr * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-line pt-4">
            <TotalsRows totals={order.totals} hasShippable={hasShippable} />
          </div>
        </div>
      </aside>
    </div>
  );
}
