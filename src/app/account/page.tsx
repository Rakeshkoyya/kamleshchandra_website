import type { Metadata } from "next";
import { AccountTabs } from "@/components/account/AccountTabs";
import { CourseProgressList } from "@/components/account/CourseProgressList";
import { MyBooks } from "@/components/account/MyBooks";
import type { OwnedBook } from "@/components/account/MyBooks";
import { OrdersTable } from "@/components/account/OrdersTable";
import { ProfileSettings } from "@/components/account/ProfileSettings";
import { RevisitPanel } from "@/components/account/RevisitPanel";
import { planRevisit } from "@/components/account/revisit";
import { ButtonLink } from "@/components/ui/Button";
import { demoLearner, getEnrolments, getOrders } from "@/lib/data/account";
import { getBooks } from "@/lib/data/books";
import { getCourses } from "@/lib/data/courses";
import { formatDate } from "@/lib/format";
import type { Course, Enrolment } from "@/lib/types";

export const metadata: Metadata = {
  title: "My learning",
  description: "Your courses, today's revisit, books and orders.",
  robots: { index: false },
};

/* SAMPLE: which books the demo learner owns. BACKEND: GET /api/me/library */
const OWNED_SAMPLE: { slug: string; format: OwnedBook["format"]; shipStep?: number; tracking?: string }[] = [
  { slug: "your-ten-trillion-dollar-brain", format: "ebook" },
  { slug: "learning-is-a-rhythm", format: "paperback", shipStep: 2, tracking: "EK 4821 9930 3IN" },
];

export default async function AccountPage() {
  // BACKEND: these become authenticated calls for the signed-in learner (GET /api/me/...).
  const [enrolments, courses, orders, books] = await Promise.all([getEnrolments(), getCourses(), getOrders(), getBooks()]);

  const rows = enrolments
    .map((enrolment) => ({ enrolment, course: courses.find((c) => c.slug === enrolment.courseSlug) }))
    .filter((r): r is { enrolment: Enrolment; course: Course } => Boolean(r.course));
  const plans = rows.map((r) => planRevisit(r.course, r.enrolment)).sort((a, b) => a.daysUntil - b.daysUntil);
  const myOrders = orders.filter((o) => o.customerEmail === demoLearner.email);
  const owned: OwnedBook[] = OWNED_SAMPLE.flatMap((o) => {
    const book = books.find((b) => b.slug === o.slug);
    return book ? [{ ...o, book }] : [];
  });
  const firstName = demoLearner.name.split(" ")[0];

  return (
    <div className="page-wrap pt-12 pb-[var(--section-y)] md:pt-16">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow rise-in">My learning</p>
          <h1 className="rise-in mt-3 text-[length:var(--text-3xl)]" style={{ ["--i" as string]: 1 }}>
            Namaste, {firstName}.
          </h1>
          <p className="rise-in mt-3 text-muted" style={{ ["--i" as string]: 2 }}>
            Learning with us since {formatDate(demoLearner.memberSince)} · {rows.length} courses in progress
          </p>
        </div>
        <ButtonLink href="/programs" variant="secondary">
          Find another program
        </ButtonLink>
      </header>

      <div className="rise-in mt-10" style={{ ["--i" as string]: 3 }}>
        <RevisitPanel plans={plans} />
      </div>

      <div className="mt-12">
        <AccountTabs
          label="My account"
          tabs={[
            { id: "courses", label: "Courses", content: <CourseProgressList rows={rows} /> },
            { id: "books", label: "My books", content: <MyBooks owned={owned} /> },
            { id: "orders", label: "Orders", content: <OrdersTable orders={myOrders} /> },
            { id: "profile", label: "Profile & settings", content: <ProfileSettings initial={demoLearner} /> },
          ]}
        />
      </div>
    </div>
  );
}
