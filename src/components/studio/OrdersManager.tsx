"use client";

import { useState } from "react";
import { formatDate, formatInr } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { cellClass, DataTable } from "./DataTable";
import { inputClass } from "./fields";
import { OrderDetail } from "./OrderDetail";
import { OrderStatusBadge } from "./StatusBadge";
import { StudioDialog } from "./StudioDialog";
import { useToast } from "./Toast";

type Filter = "all" | OrderStatus;
const FILTERS: Filter[] = ["all", "paid", "pending", "refunded", "failed"];

export function OrdersManager({ initial }: { initial: Order[] }) {
  const toast = useToast();
  const [orders, setOrders] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const visible = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (!q || [o.id, o.customerName, o.customerEmail].some((v) => v.toLowerCase().includes(q))),
  );
  const count = (f: Filter) => (f === "all" ? orders.length : orders.filter((o) => o.status === f).length);
  const openOrder = orders.find((o) => o.id === openId) ?? null;

  function handleRefund(order: Order) {
    // BACKEND: POST /api/admin/orders/{id}/refund → Razorpay refunds API; webhook confirms and revokes access.
    setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status: "refunded" } : o)));
    setOpenId(null);
    toast(`Refund of ${formatInr(order.totalInr)} issued for ${order.id} (demo).`);
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize ring-1 transition-colors duration-[var(--dur-fast)] ${
                filter === f ? "bg-ink text-paper ring-ink" : "bg-surface ring-line-strong hover:ring-brand"
              }`}
            >
              {f} <span className={`ml-1 tabular-nums ${filter === f ? "text-on-ink-accent" : "text-muted"}`}>{count(f)}</span>
            </button>
          ))}
        </div>
        <label className="w-full sm:w-72">
          <span className="sr-only">Search orders</span>
          <input
            type="search"
            className={inputClass}
            placeholder="Search name, email or order ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <p aria-live="polite" className="sr-only">
        {visible.length} orders shown
      </p>

      <DataTable caption="Orders" head={["Order", "Customer", "Date", "Method", "Status", "Total"]}>
        {visible.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-5 py-10 text-center text-muted">
              No orders match. Try another filter or search.
            </td>
          </tr>
        ) : null}
        {visible.map((o) => (
          <tr key={o.id} onClick={() => setOpenId(o.id)} className="cursor-pointer hover:bg-brand-soft/40">
            <td className={cellClass}>
              <button type="button" className="font-semibold whitespace-nowrap text-brand tabular-nums hover:underline" onClick={() => setOpenId(o.id)}>
                {o.id}
                <span className="sr-only">, view details</span>
              </button>
            </td>
            <td className={cellClass}>
              <p className="font-semibold">{o.customerName}</p>
              <p className="text-xs text-muted">{o.customerEmail}</p>
            </td>
            <td className={`${cellClass} whitespace-nowrap text-muted`}>{formatDate(o.createdAt)}</td>
            <td className={`${cellClass} text-muted`}>{o.method}</td>
            <td className={cellClass}>
              <OrderStatusBadge status={o.status} />
            </td>
            <td className={`${cellClass} text-right font-semibold tabular-nums`}>{formatInr(o.totalInr)}</td>
          </tr>
        ))}
      </DataTable>

      <StudioDialog isOpen={openOrder !== null} onClose={() => setOpenId(null)} title={openOrder ? `Order ${openOrder.id}` : "Order"}>
        {openOrder ? <OrderDetail key={openOrder.id} order={openOrder} onRefund={handleRefund} /> : null}
      </StudioDialog>
    </>
  );
}
