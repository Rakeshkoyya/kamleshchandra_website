import { OrderStatusBadge } from "@/components/studio/StatusBadge";
import { formatDate, formatInr } from "@/lib/format";
import type { Order } from "@/lib/types";

/** Learner's orders: a real table on desktop; each row stacks into a card under `md`. */
export function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className="text-muted">No orders yet.</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <caption className="sr-only">Your orders</caption>
      <thead className="hidden border-b border-line text-xs tracking-wide text-muted uppercase md:table-header-group">
        <tr>
          <th scope="col" className="py-3 pr-4 font-semibold">Order</th>
          <th scope="col" className="py-3 pr-4 font-semibold">Date</th>
          <th scope="col" className="py-3 pr-4 font-semibold">Items</th>
          <th scope="col" className="py-3 pr-4 font-semibold">Paid with</th>
          <th scope="col" className="py-3 pr-4 font-semibold">Status</th>
          <th scope="col" className="py-3 text-right font-semibold">Total</th>
        </tr>
      </thead>
      <tbody className="grid gap-3 md:table-row-group">
        {orders.map((o) => (
          <tr
            key={o.id}
            className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-md border border-line bg-surface p-4 md:table-row md:rounded-none md:border-0 md:border-b md:bg-transparent md:p-0"
          >
            <th scope="row" className="font-semibold tabular-nums md:py-4 md:pr-4">
              {o.id}
            </th>
            <td className="text-right text-muted md:py-4 md:pr-4 md:text-left">{formatDate(o.createdAt)}</td>
            <td className="col-span-2 md:py-4 md:pr-4">
              {o.items.map((it) => (
                <span key={`${it.title}-${it.variant}`} className="block">
                  {it.title} <span className="text-muted">· {it.variant}{it.quantity > 1 ? ` × ${it.quantity}` : ""}</span>
                </span>
              ))}
            </td>
            <td className="text-muted md:py-4 md:pr-4">
              <span className="md:sr-only">Paid with </span>
              {o.method}
            </td>
            <td className="text-right md:py-4 md:pr-4 md:text-left">
              <OrderStatusBadge status={o.status} />
            </td>
            <td className="col-span-2 border-t border-line pt-2 text-right font-display text-lg font-semibold md:border-0 md:py-4 md:pt-4">
              <span className="mr-2 font-sans text-sm font-normal text-muted md:sr-only">Total</span>
              {formatInr(o.totalInr)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
