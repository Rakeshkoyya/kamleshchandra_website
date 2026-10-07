import type { Metadata } from "next";
import Link from "next/link";
import { cardClass, Panel } from "@/components/studio/fields";
import { RevenueChart } from "@/components/studio/RevenueChart";
import { OrderStatusBadge } from "@/components/studio/StatusBadge";
import { buttonClass } from "@/components/ui/Button";
import { SampleNote } from "@/components/ui/misc";
import { getOrders, revenueSeries } from "@/lib/data/account";
import { getUpcomingEvents } from "@/lib/data/events";
import { dateParts, formatDate, formatInr } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

const compactNum = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });

function Kpi({ label, value, detail, isHero = false }: { label: string; value: string; detail: string; isHero?: boolean }) {
  return (
    <div className={`${cardClass} ${isHero ? "bg-ink text-paper sm:col-span-2 xl:col-span-1" : ""}`}>
      <p className={`text-sm ${isHero ? "text-on-ink-muted" : "text-muted"}`}>{label}</p>
      <p className={`mt-2 font-sans font-semibold leading-none ${isHero ? "text-5xl" : "text-4xl"}`}>{value}</p>
      <p className={`mt-3 text-xs ${isHero ? "text-on-ink-accent" : "text-muted"}`}>{detail}</p>
    </div>
  );
}

export default async function StudioDashboard() {
  // BACKEND: GET /api/admin/metrics?range=14d, /api/admin/orders?limit=5, /api/admin/events?status=upcoming
  const [orders, events] = await Promise.all([getOrders(), getUpcomingEvents()]);
  const revenue = revenueSeries.reduce((s, d) => s + d.inr, 0);
  const paid = orders.filter((o) => o.status === "paid").length;
  const learners = new Set(orders.map((o) => o.customerEmail)).size;
  const seatsTaken = events.reduce((s, e) => s + e.seatsTaken, 0);
  const seatsTotal = events.reduce((s, e) => s + e.seatsTotal, 0);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Wednesday, 7 Oct 2026</p>
          <h1 className="mt-2 max-w-[22ch] text-[length:var(--text-3xl)]">Good morning, Kamlesh ji.</h1>
          <p className="mt-2 max-w-[56ch] text-muted">
            Here is how the last two weeks went — what people bought, who joined, and which rooms are filling.
          </p>
        </div>
        <SampleNote>Sample numbers</SampleNote>
      </header>

      <section aria-label="Key figures" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi isHero label="Revenue, last 14 days" value={`₹${compactNum.format(revenue)}`} detail={`${formatInr(revenue)} across ${revenueSeries.length} days`} />
        <Kpi label="Orders" value={String(orders.length)} detail={`${paid} paid · ${orders.length - paid} pending, refunded or failed`} />
        <Kpi label="New learners" value={String(learners)} detail="Unique buyers this fortnight" />
        <Kpi label="Event seats booked" value={`${seatsTaken}`} detail={`of ${seatsTotal} seats across ${events.length} upcoming events`} />
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel id="revenue" eyebrow="Revenue" title="Daily takings, last 14 days">
          <RevenueChart data={revenueSeries} />
        </Panel>

        <Panel id="quick" eyebrow="Start something" title="Quick actions">
          <ul className="grid gap-3">
            {[
              { href: "/studio/programs/new", label: "New program", note: "Build modules and lessons" },
              { href: "/studio/journal/new", label: "Write a post", note: "For the journal" },
              { href: "/studio/events#announcements", label: "New announcement", note: "Shows on the site banner" },
            ].map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className="group flex items-center justify-between gap-4 rounded-md border border-line px-4 py-3 transition-colors duration-[var(--dur-fast)] hover:border-brand hover:bg-brand-soft"
                >
                  <span>
                    <span className="block font-display text-lg font-semibold">{a.label}</span>
                    <span className="text-sm text-muted">{a.note}</span>
                  </span>
                  <span aria-hidden="true" className="text-recall transition-transform duration-[var(--dur-base)] group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2">
        <Panel
          id="recent-orders"
          eyebrow="Orders"
          title="Recent orders"
          action={<Link href="/studio/orders" className={buttonClass("ghost", "sm")}>All orders →</Link>}
        >
          <ul className="divide-y divide-line">
            {orders.slice(0, 4).map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                <div className="min-w-0">
                  <p className="font-semibold">{o.customerName}</p>
                  <p className="truncate text-sm text-muted">
                    {o.items[0]?.title}
                    {o.items.length > 1 ? ` +${o.items.length - 1} more` : ""} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={o.status} />
                  <span className="w-20 text-right font-semibold tabular-nums">{formatInr(o.totalInr)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          id="upcoming"
          eyebrow="Events"
          title="Upcoming, and how full"
          action={<Link href="/studio/events" className={buttonClass("ghost", "sm")}>Manage →</Link>}
        >
          <ul className="space-y-4">
            {events.map((e) => {
              const { day, month } = dateParts(e.startsAt);
              const fill = e.seatsTaken / e.seatsTotal;
              return (
                <li key={e.slug} className="flex gap-4">
                  <div className="grid w-14 shrink-0 place-items-center rounded-md bg-bg-alt py-2 text-center leading-none">
                    <span className="font-display text-2xl font-semibold">{day}</span>
                    <span className="text-xs text-muted uppercase">{month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{e.title}</p>
                    <p className="text-sm text-muted">
                      {e.kind} · {e.mode === "online" ? "Online" : e.city}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div
                        className="h-2 flex-1 overflow-hidden rounded-full bg-brand-soft"
                        role="meter"
                        aria-valuemin={0}
                        aria-valuemax={e.seatsTotal}
                        aria-valuenow={e.seatsTaken}
                        aria-label={`${e.title} seats booked`}
                      >
                        <div
                          className={`h-full w-full origin-left rounded-full ${fill >= 0.8 ? "bg-recall" : "bg-brand"}`}
                          style={{ transform: `scaleX(${fill})` }}
                        />
                      </div>
                      <span className="w-20 text-right text-xs text-muted tabular-nums">
                        {e.seatsTaken}/{e.seatsTotal}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted">
            <span className="h-2 w-2 rounded-full bg-recall" aria-hidden="true" /> Marigold = 80% or more booked
          </p>
        </Panel>
      </div>
    </div>
  );
}
