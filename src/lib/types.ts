/*
 * Domain types — the contract the future backend should satisfy.
 * Every list in src/lib/data/* is mock data shaped by these types; swap the
 * data modules for API calls (or server actions) without touching the UI.
 */

export type Audience = "students" | "parents" | "teachers" | "schools";

export type ProductKind = "course" | "book" | "event";

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  isPreview?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export type CourseFormat = "self-paced" | "live-online" | "in-person";

export interface Course {
  slug: string;
  title: string;
  subtitle: string;
  audience: Audience[];
  format: CourseFormat;
  level: "Foundation" | "Intermediate" | "Advanced";
  priceInr: number;
  compareAtInr?: number;
  durationLabel: string; // e.g. "6 weeks · 18 lessons"
  language: string;
  outcomes: string[];
  modules: Module[];
  /** Image in /public/images, or undefined to use the drawn cover */
  image?: string;
  coverTone: "violet" | "marigold" | "ink";
  status: "published" | "draft";
  isSample: true;
}

export type BookFormat = "paperback" | "ebook" | "audiobook";

export interface BookEdition {
  format: BookFormat;
  priceInr: number;
  inStock: boolean;
}

export interface Book {
  slug: string;
  title: string;
  subtitle: string;
  blurb: string;
  pages: number;
  language: string;
  editions: BookEdition[];
  coverTone: "violet" | "marigold" | "ink" | "rose";
  /** The short line printed on the drawn cover */
  coverLine: string;
  contents: string[];
  status: "published" | "pre-order" | "draft";
  isSample: true;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: "Memory" | "Parenting" | "Teaching" | "Inner growth" | "Announcements";
  publishedAt: string; // ISO date
  readMinutes: number;
  image?: string;
  /** Paragraph blocks; "## " prefix = subheading, "> " prefix = quote */
  body: string[];
  status: "published" | "draft" | "scheduled";
  isSample: true;
}

export interface EventItem {
  slug: string;
  title: string;
  kind: "Workshop" | "Webinar" | "Parent seminar" | "Teacher training" | "Book launch";
  startsAt: string; // ISO datetime, IST
  endsAt: string;
  mode: "online" | "in-person";
  venue: string;
  city?: string;
  priceInr: number; // 0 = free registration
  seatsTotal: number;
  seatsTaken: number;
  summary: string;
  agenda: string[];
  status: "upcoming" | "past";
  isSample: true;
}

export interface Announcement {
  id: string;
  text: string;
  href?: string;
  tone: "info" | "new" | "urgent";
  publishedAt: string;
  isSample: true;
}

export interface CartItem {
  /** `${kind}:${slug}:${variant}` */
  id: string;
  kind: ProductKind;
  slug: string;
  title: string;
  variant: string; // e.g. "paperback", "self-paced", "seat"
  unitPriceInr: number;
  quantity: number;
}

export type OrderStatus = "paid" | "pending" | "refunded" | "failed";

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  items: { title: string; variant: string; quantity: number; unitPriceInr: number }[];
  totalInr: number;
  method: "UPI" | "Card" | "Netbanking";
  status: OrderStatus;
  isSample: true;
}

export interface Enrolment {
  courseSlug: string;
  progress: number; // 0..1
  lastLessonId: string;
  /** Next spaced-revision date — the product expression of the retention curve */
  nextRevisitAt: string;
  isSample: true;
}
