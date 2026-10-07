import type { Enrolment, Order } from "@/lib/types";

/* SAMPLE learner + studio data for the demo dashboards. */

export const demoLearner = {
  name: "Ananya Sharma",
  email: "ananya@example.com",
  phone: "98xxxxxx21",
  memberSince: "2026-06-02",
} as const;

const ENROLMENTS: Enrolment[] = [
  {
    courseSlug: "memory-mastery-for-students",
    progress: 0.44,
    lastLessonId: "l5",
    nextRevisitAt: "2026-10-08T07:00:00+05:30",
    isSample: true,
  },
  {
    courseSlug: "inner-growth-life-design",
    progress: 0.15,
    lastLessonId: "l2",
    nextRevisitAt: "2026-10-10T07:00:00+05:30",
    isSample: true,
  },
];

const ORDERS: Order[] = [
  {
    id: "KC-24117",
    createdAt: "2026-10-06T18:42:00+05:30",
    customerName: "Ananya Sharma",
    customerEmail: "ananya@example.com",
    items: [{ title: "Memory Mastery for Students", variant: "Self-paced", quantity: 1, unitPriceInr: 2499 }],
    totalInr: 2499,
    method: "UPI",
    status: "paid",
    isSample: true,
  },
  {
    id: "KC-24116",
    createdAt: "2026-10-06T11:05:00+05:30",
    customerName: "Rohit Verma",
    customerEmail: "rohit@example.com",
    items: [{ title: "Your $10 Trillion Brain", variant: "Paperback", quantity: 2, unitPriceInr: 399 }],
    totalInr: 798,
    method: "Card",
    status: "paid",
    isSample: true,
  },
  {
    id: "KC-24115",
    createdAt: "2026-10-05T20:17:00+05:30",
    customerName: "Meena Joshi",
    customerEmail: "meena@example.com",
    items: [{ title: "Neuroeducation Intensive for School Leaders", variant: "Seat", quantity: 3, unitPriceInr: 7500 }],
    totalInr: 22500,
    method: "Netbanking",
    status: "pending",
    isSample: true,
  },
  {
    id: "KC-24114",
    createdAt: "2026-10-04T09:51:00+05:30",
    customerName: "Sanjay Purohit",
    customerEmail: "sanjay@example.com",
    items: [{ title: "Parenting the Learning Brain", variant: "Live online", quantity: 1, unitPriceInr: 1999 }],
    totalInr: 1999,
    method: "UPI",
    status: "refunded",
    isSample: true,
  },
  {
    id: "KC-24113",
    createdAt: "2026-10-03T16:30:00+05:30",
    customerName: "Kavya Rathore",
    customerEmail: "kavya@example.com",
    items: [
      { title: "Be Better Everyday", variant: "eBook", quantity: 1, unitPriceInr: 249 },
      { title: "Inner Growth & Life Design", variant: "Self-paced", quantity: 1, unitPriceInr: 1499 },
    ],
    totalInr: 1748,
    method: "UPI",
    status: "paid",
    isSample: true,
  },
];

/** Daily revenue for the last 14 days, INR — studio chart sample */
export const revenueSeries: { date: string; inr: number }[] = [
  { date: "2026-09-23", inr: 8400 },
  { date: "2026-09-24", inr: 5200 },
  { date: "2026-09-25", inr: 11900 },
  { date: "2026-09-26", inr: 7300 },
  { date: "2026-09-27", inr: 14600 },
  { date: "2026-09-28", inr: 9800 },
  { date: "2026-09-29", inr: 6100 },
  { date: "2026-09-30", inr: 12700 },
  { date: "2026-10-01", inr: 18200 },
  { date: "2026-10-02", inr: 15400 },
  { date: "2026-10-03", inr: 9900 },
  { date: "2026-10-04", inr: 7600 },
  { date: "2026-10-05", inr: 24300 },
  { date: "2026-10-06", inr: 13100 },
];

export async function getEnrolments(): Promise<Enrolment[]> {
  return ENROLMENTS;
}

export async function getOrders(): Promise<Order[]> {
  return ORDERS;
}
