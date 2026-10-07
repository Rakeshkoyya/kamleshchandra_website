import { SampleNote } from "@/components/ui/misc";
import { FORMAT_LABEL } from "@/lib/data/courses";
import type { Course } from "@/lib/types";

type Props = {
  course: Course;
};

function faqFor(course: Course): { q: string; a: string }[] {
  const access =
    course.format === "self-paced"
      ? "Lessons open in My learning straight after payment, and stay available for 12 months. [to confirm]"
      : "You'll receive the joining link and calendar invites by email after payment; recordings are shared within 48 hours. [to confirm]";
  return [
    { q: `How does the ${FORMAT_LABEL[course.format].toLowerCase()} format work?`, a: access },
    {
      q: "What is the refund policy?",
      a: "Full refund within 7 days of purchase if you have completed less than 20% of the program. [Sample policy — to confirm]",
    },
    { q: "Is the price inclusive of GST?", a: "Yes. The listed price includes 18% GST, and you get a GST invoice by email." },
    {
      q: "Can a school enrol a group?",
      a: "Yes — write to us through the contact page for group pricing and on-campus delivery. [to confirm]",
    },
  ];
}

export function CourseFaq({ course }: Props) {
  return (
    <section aria-labelledby="faq-title">
      <p className="eyebrow">Questions</p>
      <h2 id="faq-title" className="mt-3 text-[length:var(--text-2xl)]">
        Before you enrol
      </h2>
      <SampleNote className="mt-4">Policies below are sample text</SampleNote>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {faqFor(course).map((item) => (
          <details key={item.q} className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-5 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
