import type { Metadata } from "next";
import { cellClass, DataTable } from "@/components/studio/DataTable";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { SampleNote } from "@/components/ui/misc";
import { getOrders } from "@/lib/data/account";
import { formatDate, formatInr } from "@/lib/format";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "Learners" };

type Learner = { name: string; email: string; orders: number; spent: number; lastAt: string; items: string[] };

/** Sample learner rows derived from orders. BACKEND: GET /api/admin/learners (with enrolments + progress). */
function toLearners(orders: Order[]): Learner[] {
  const byEmail = new Map<string, Learner>();
  for (const o of orders) {
    const prev = byEmail.get(o.customerEmail);
    const counted = o.status === "paid" ? o.totalInr : 0;
    const titles = o.items.map((i) => i.title);
    byEmail.set(
      o.customerEmail,
      prev
        ? {
            ...prev,
            orders: prev.orders + 1,
            spent: prev.spent + counted,
            lastAt: o.createdAt > prev.lastAt ? o.createdAt : prev.lastAt,
            items: [...new Set([...prev.items, ...titles])],
          }
        : { name: o.customerName, email: o.customerEmail, orders: 1, spent: counted, lastAt: o.createdAt, items: titles },
    );
  }
  return [...byEmail.values()].sort((a, b) => b.lastAt.localeCompare(a.lastAt));
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function StudioLearnersPage() {
  const learners = toLearners(await getOrders());

  return (
    <>
      <StudioPageHeader
        eyebrow="People"
        title="Learners"
        lead="Everyone who has bought a program, book or seat — the people this work is for."
        actions={<SampleNote>Derived from sample orders</SampleNote>}
      />
      <DataTable caption="Learners" head={["Learner", "Bought", "Orders", "Paid total", "Last order"]}>
        {learners.map((l) => (
          <tr key={l.email}>
            <td className={cellClass}>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft font-display text-sm font-semibold text-brand">
                  {initials(l.name)}
                </span>
                <span>
                  <span className="block font-semibold">{l.name}</span>
                  <span className="text-xs text-muted">{l.email}</span>
                </span>
              </div>
            </td>
            <td className={`${cellClass} max-w-[22rem] text-muted`}>{l.items.join(", ")}</td>
            <td className={`${cellClass} tabular-nums`}>{l.orders}</td>
            <td className={`${cellClass} font-semibold tabular-nums`}>{l.spent ? formatInr(l.spent) : "—"}</td>
            <td className={`${cellClass} whitespace-nowrap text-muted`}>{formatDate(l.lastAt)}</td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
