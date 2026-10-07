import type { Announcement, EventItem } from "@/lib/types";

/* SAMPLE EVENTS & ANNOUNCEMENTS — dates, venues and prices are demo data. */
const EVENTS: EventItem[] = [
  {
    slug: "memory-masterclass-bikaner-nov-2026",
    title: "Memory Masterclass for Board Students",
    kind: "Workshop",
    startsAt: "2026-11-14T10:00:00+05:30",
    endsAt: "2026-11-14T13:00:00+05:30",
    mode: "in-person",
    venue: "SHANA International School auditorium",
    city: "Bikaner",
    priceInr: 499,
    seatsTotal: 200,
    seatsTaken: 146,
    summary: "Three hours on recall, spacing and exam calm for classes 9–12, with a take-home revision planner.",
    agenda: ["How memory forms and fades", "Live recall drills", "Building your 30-day revision rhythm", "Q&A with parents"],
    status: "upcoming",
    isSample: true,
  },
  {
    slug: "parenting-webinar-oct-2026",
    title: "Your Child's Brain at Exam Time",
    kind: "Parent seminar",
    startsAt: "2026-10-25T19:00:00+05:30",
    endsAt: "2026-10-25T20:30:00+05:30",
    mode: "online",
    venue: "Live on Zoom",
    priceInr: 0,
    seatsTotal: 500,
    seatsTaken: 312,
    summary: "A free evening for parents: sleep, stress and the routines that help memory most in the weeks before exams.",
    agenda: ["What stress does to recall", "Sleep and consolidation", "A calm home timetable"],
    status: "upcoming",
    isSample: true,
  },
  {
    slug: "teacher-training-jaipur-dec-2026",
    title: "Neuroeducation Intensive for School Leaders",
    kind: "Teacher training",
    startsAt: "2026-12-05T09:30:00+05:30",
    endsAt: "2026-12-06T17:00:00+05:30",
    mode: "in-person",
    venue: "[Venue to be confirmed]",
    city: "Jaipur",
    priceInr: 7500,
    seatsTotal: 60,
    seatsTaken: 51,
    summary: "Two days for principals and coordinators on retention-first curriculum design under NEP 2020.",
    agenda: ["Schema theory for planners", "Retention across the term plan", "Teacher coaching cycles", "Competency-based assessment"],
    status: "upcoming",
    isSample: true,
  },
  {
    slug: "book-launch-ten-trillion-brain",
    title: "Book launch — Your $10 Trillion Brain",
    kind: "Book launch",
    startsAt: "2026-09-20T17:00:00+05:30",
    endsAt: "2026-09-20T19:00:00+05:30",
    mode: "in-person",
    venue: "SHANA International School",
    city: "Bikaner",
    priceInr: 0,
    seatsTotal: 300,
    seatsTaken: 300,
    summary: "An evening reading, a live memory demonstration and book signing.",
    agenda: ["Reading", "Live demonstration", "Signing"],
    status: "past",
    isSample: true,
  },
];

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    text: "Registrations open — Memory Masterclass, Bikaner, 14 Nov",
    href: "/events/memory-masterclass-bikaner-nov-2026",
    tone: "new",
    publishedAt: "2026-10-01T09:00:00+05:30",
    isSample: true,
  },
  {
    id: "a2",
    text: "Free parent webinar on 25 Oct — only a few hundred seats",
    href: "/events/parenting-webinar-oct-2026",
    tone: "info",
    publishedAt: "2026-09-29T09:00:00+05:30",
    isSample: true,
  },
];

export async function getEvents(): Promise<EventItem[]> {
  return [...EVENTS].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  return (await getEvents()).filter((e) => e.status === "upcoming");
}

export async function getEvent(slug: string): Promise<EventItem | undefined> {
  return EVENTS.find((e) => e.slug === slug);
}

export async function getAnnouncements(): Promise<Announcement[]> {
  return ANNOUNCEMENTS;
}
