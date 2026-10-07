"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatDate, formatInr, formatTime } from "@/lib/format";
import type { Order } from "@/lib/types";
import { OrderStatusBadge } from "./StatusBadge";

type Props = { order: Order; onRefund: (order: Order) => void };

/** Body of the order dialog: items, totals, payment, and a two-step refund. */
export function OrderDetail({ order, onRefund }: Props) {
  const [isConfirming, setIsConfirming] = useState(false);
  const subtotal = order.items.reduce((s, it) => s + it.unitPriceInr * it.quantity, 0);
  const canRefund = order.status === "paid";

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt className="text-muted">Order</dt>
          <dd className="font-semibold tabular-nums">{order.id}</dd>
        </div>
        <div>
          <dt className="text-muted">Status</dt>
          <dd>
            <OrderStatusBadge status={order.status} />
          </dd>
        </div>
        <div>
          <dt className="text-muted">Customer</dt>
          <dd className="font-semibold">{order.customerName}</dd>
          <dd className="truncate text-muted">{order.customerEmail}</dd>
        </div>
        <div>
          <dt className="text-muted">Placed</dt>
          <dd>
            {formatDate(order.createdAt)}, {formatTime(order.createdAt)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Payment method</dt>
          <dd>{order.method} · via Razorpay (demo)</dd>
        </div>
      </dl>

      <table className="w-full text-sm">
        <caption className="sr-only">Items in order {order.id}</caption>
        <thead className="border-b border-line text-left text-xs tracking-wide text-muted uppercase">
          <tr>
            <th scope="col" className="py-2 font-semibold">Item</th>
            <th scope="col" className="py-2 text-right font-semibold">Qty</th>
            <th scope="col" className="py-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {order.items.map((it) => (
            <tr key={`${it.title}-${it.variant}`}>
              <td className="py-2.5">
                {it.title}
                <span className="block text-xs text-muted">
                  {it.variant} · {formatInr(it.unitPriceInr)} each
                </span>
              </td>
              <td className="py-2.5 text-right tabular-nums">{it.quantity}</td>
              <td className="py-2.5 text-right tabular-nums">{formatInr(it.unitPriceInr * it.quantity)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t border-line-strong">
          <tr>
            <th scope="row" colSpan={2} className="pt-3 text-right font-normal text-muted">
              Subtotal (incl. GST)
            </th>
            <td className="pt-3 text-right tabular-nums">{formatInr(subtotal)}</td>
          </tr>
          <tr>
            <th scope="row" colSpan={2} className="pt-1 text-right">
              Total
            </th>
            <td className="pt-1 text-right font-display text-xl font-semibold">{formatInr(order.totalInr)}</td>
          </tr>
        </tfoot>
      </table>

      {canRefund ? (
        <div className="rounded-md border border-line bg-bg-alt p-4" aria-live="polite">
          {isConfirming ? (
            <div className="space-y-3">
              <p className="text-sm">
                Refund <strong>{formatInr(order.totalInr)}</strong> to {order.customerName}&rsquo;s {order.method}? Course access
                will be removed. This can&rsquo;t be undone.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button className="bg-danger hover:bg-danger hover:brightness-110" onClick={() => onRefund(order)}>
                  Yes, refund {formatInr(order.totalInr)}
                </Button>
                <Button variant="ghost" onClick={() => setIsConfirming(false)}>
                  Keep order
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">Full refunds return to the original payment method in 5–7 days.</p>
              <Button variant="secondary" onClick={() => setIsConfirming(true)}>
                Issue refund
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
