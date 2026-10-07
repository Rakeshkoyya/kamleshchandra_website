import type { Metadata } from "next";
import { AnnouncementStrip } from "@/components/content/events/AnnouncementStrip";
import { EventRow } from "@/components/content/events/EventRow";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader, SampleNote } from "@/components/ui/misc";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { getAnnouncements, getEvents } from "@/lib/data/events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Workshops, parent seminars, webinars and teacher trainings with Kamlesh Chandra — in Bikaner, across Rajasthan and online.",
};

export default async function EventsPage() {
  const [events, announcements] = await Promise.all([getEvents(), getAnnouncements()]);
  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past").reverse();

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="The notice board"
        lead="Workshops for students, evenings for parents, intensives for teachers and school leaders — in person and online."
      >
        <SampleNote>Sample events for the demo — dates, venues and prices to confirm</SampleNote>
      </PageHeader>

      <AnnouncementStrip items={announcements} />

      <section aria-labelledby="upcoming-title" className="page-wrap py-[var(--section-y)]">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="upcoming-title" className="text-[length:var(--text-2xl)]">
            Coming up
          </h2>
          <p className="text-sm text-muted">All times in IST</p>
        </div>
        {upcoming.length > 0 ? (
          <ol className="mt-6 border-t border-line">
            {upcoming.map((e, i) => (
              <EventRow key={e.slug} event={e} index={i} />
            ))}
          </ol>
        ) : (
          <p className="mt-6 text-muted">Nothing scheduled just now — new dates are added every month.</p>
        )}
      </section>

      {past.length > 0 ? (
        <section aria-labelledby="past-title" className="bg-bg-alt py-[var(--section-y)]">
          <div className="page-wrap">
            <h2 id="past-title" className="text-[length:var(--text-xl)] text-muted">
              Already held
            </h2>
            <ol className="mt-4 border-t border-line">
              {past.map((e) => (
                <EventRow key={e.slug} event={e} />
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="host-title" className="page-wrap py-[var(--section-y)]">
        <div className="flex flex-col items-start gap-6 border-l-4 border-recall pl-6 md:flex-row md:items-center md:justify-between md:pl-10">
          <div className="max-w-[48ch]">
            <RhythmMark className="w-12 text-brand" />
            <h2 id="host-title" className="mt-3 text-[length:var(--text-2xl)]">
              Want a session like these at your school?
            </h2>
            <p className="mt-3 text-muted">
              Workshops for students, parent evenings and teacher trainings can be brought to your campus.
            </p>
          </div>
          <ButtonLink href="/contact" size="lg">
            Invite KC to your school
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
