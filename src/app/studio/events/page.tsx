import type { Metadata } from "next";
import { AnnouncementsManager } from "@/components/studio/AnnouncementsManager";
import { EventsManager } from "@/components/studio/EventsManager";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { getAnnouncements, getEvents } from "@/lib/data/events";

export const metadata: Metadata = { title: "Events & announcements" };

export default async function StudioEventsPage() {
  // BACKEND: GET /api/admin/events and /api/admin/announcements
  const [events, announcements] = await Promise.all([getEvents(), getAnnouncements()]);

  return (
    <>
      <StudioPageHeader
        eyebrow="Gatherings"
        title="Events & announcements"
        lead="Workshops, webinars and seminars — and the short notices that point people to them."
      />
      <div className="space-y-14">
        <EventsManager initial={events} />
        <AnnouncementsManager initial={announcements} />
      </div>
    </>
  );
}
