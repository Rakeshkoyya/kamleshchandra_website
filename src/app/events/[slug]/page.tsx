import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCalendar } from "@/components/content/events/AddToCalendar";
import { DateChip, SeatsBar, eventDateLabel, eventTimeLabel, placeLabel } from "@/components/content/events/event-bits";
import { EventRegistration } from "@/components/content/events/EventRegistration";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, SampleNote } from "@/components/ui/misc";
import { getEvent, getEvents } from "@/lib/data/events";
import { formatInr } from "@/lib/format";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: `${event.kind} · ${eventDateLabel(event)} · ${event.summary}`,
  };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const isPast = event.status === "past";
  const modeLabel = event.mode === "online" ? "Online" : "In person";

  return (
    <>
      <header className="page-wrap pt-10 pb-10 md:pt-16">
        <nav aria-label="Breadcrumb">
          <Link href="/events" className="draw-link inline-flex min-h-10 items-center text-sm font-semibold text-brand">
            ← Notice board
          </Link>
        </nav>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="rise-in">
            <DateChip iso={event.startsAt} muted={isPast} size="lg" />
          </div>
          <div className="max-w-[46rem]">
            <div className="rise-in flex flex-wrap items-center gap-2" style={{ ["--i" as string]: 1 }}>
              <Badge tone="brand">{event.kind}</Badge>
              <Badge>{modeLabel}</Badge>
              {isPast ? <Badge>Held</Badge> : null}
            </div>
            <h1 className="rise-in mt-4 text-[length:var(--text-3xl)]" style={{ ["--i" as string]: 2 }}>
              {event.title}
            </h1>
            <p className="rise-in mt-4 text-lg text-muted" style={{ ["--i" as string]: 3 }}>
              {event.summary}
            </p>
            <SampleNote className="mt-5">Sample event — details to confirm</SampleNote>
          </div>
        </div>
      </header>

      <div className="page-wrap grid gap-12 pb-[var(--section-y)] lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
        <div>
          <dl className="grid gap-6 border-y border-line py-7 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">When</dt>
              <dd className="mt-2 font-display text-lg font-semibold text-ink">{eventDateLabel(event)}</dd>
              <dd className="text-muted">{eventTimeLabel(event)}</dd>
            </div>
            <div>
              <dt className="eyebrow">Where</dt>
              <dd className="mt-2 font-display text-lg font-semibold text-ink">{placeLabel(event)}</dd>
              <dd className="text-muted">
                {event.mode === "online" ? "The joining link is sent on WhatsApp and email." : "Venue directions are shared on WhatsApp after you register."}
              </dd>
            </div>
          </dl>

          <section aria-labelledby="agenda-title" className="mt-12">
            <h2 id="agenda-title" className="text-[length:var(--text-2xl)]">
              The session, step by step
            </h2>
            <ol className="relative mt-8 ml-3 border-l-2 border-line">
              {event.agenda.map((item, i) => (
                <li key={item} className="relative pb-8 pl-8 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute top-1 -left-[0.6rem] h-4 w-4 rounded-full ring-4 ring-bg ${
                      i === event.agenda.length - 1 ? "bg-recall" : "bg-brand"
                    }`}
                  />
                  <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">Part {i + 1}</p>
                  <p className="mt-1 font-display text-[length:var(--text-lg)] font-semibold text-ink">{item}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside
          aria-labelledby="register-title"
          className="self-start rounded-lg bg-surface p-6 shadow-2 ring-1 ring-line sm:p-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]"
        >
          <h2 id="register-title" className="eyebrow">
            {isPast ? "Registration closed" : "Register"}
          </h2>
          <p className="mt-3 font-display text-[length:var(--text-2xl)] font-semibold text-ink">
            {formatInr(event.priceInr)}
            {event.priceInr > 0 ? <span className="text-base font-normal text-muted"> per seat</span> : null}
          </p>
          {!isPast ? <SeatsBar event={event} className="mt-4" /> : null}
          <div className="mt-6">
            <EventRegistration event={event} />
          </div>
          {!isPast ? (
            <div className="mt-6 border-t border-line pt-6">
              <AddToCalendar event={event} />
            </div>
          ) : (
            <div className="mt-6">
              <ButtonLink href="/events" variant="secondary">
                See upcoming events
              </ButtonLink>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
