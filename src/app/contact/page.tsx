import type { Metadata } from "next";
import { EnquiryForm } from "@/components/content/contact/EnquiryForm";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/misc";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { person } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Invite KC to your school",
  description:
    "Invite Kamlesh Chandra to your school for student memory workshops, parent seminars, teacher training or leadership sessions. Based in Bikaner, Rajasthan.",
};

const WHATSAPP_URL = `https://wa.me/91${person.phones[0]}`;

const NEXT_STEPS = [
  {
    title: "We read it properly",
    body: "Your enquiry reaches KC’s team, who look at your audience, numbers and timing.",
  },
  {
    title: "A conversation",
    body: "We call or WhatsApp to understand what your school needs — and suggest the right session.",
  },
  {
    title: "A plan, then a date",
    body: "You receive a short outline of the session and the practical details, and we fix the date together.",
  },
] as const;

function formatPhone(phone: string): string {
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Invite KC to your school"
        lead="Student workshops, parent evenings, teacher training and sessions for school leaders — on your campus or online."
      />

      <section aria-labelledby="reach-title" className="page-wrap">
        <h2 id="reach-title" className="sr-only">
          Ways to reach us
        </h2>
        <dl className="grid gap-px overflow-hidden rounded-lg bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-surface p-6">
            <dt className="eyebrow">Write</dt>
            <dd className="mt-2">
              <a href={`mailto:${person.email}`} className="draw-link inline-flex min-h-10 items-center font-semibold break-all text-brand">
                {person.email}
              </a>
            </dd>
          </div>
          <div className="bg-surface p-6">
            <dt className="eyebrow">Call</dt>
            {person.phones.map((p) => (
              <dd key={p}>
                <a href={`tel:+91${p}`} className="draw-link inline-flex min-h-10 items-center font-semibold text-brand tabular-nums">
                  {formatPhone(p)}
                </a>
              </dd>
            ))}
          </div>
          <div className="bg-surface p-6">
            <dt className="eyebrow">Based in</dt>
            <dd className="mt-2 font-semibold text-ink">{person.school.city}</dd>
            <dd className="text-sm text-muted">Sessions on your campus or online.</dd>
          </div>
          <div className="bg-brand p-6 text-paper">
            <dt className="eyebrow text-on-ink-accent!">Quickest</dt>
            <dd className="mt-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 font-semibold text-paper underline underline-offset-4"
              >
                Message on WhatsApp<span aria-hidden="true">→</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="form-title" className="page-wrap grid gap-12 py-[var(--section-y)] lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="eyebrow">The invitation</p>
          <h2 id="form-title" className="mt-3 text-[length:var(--text-3xl)]">
            Tell us about your school
          </h2>
          <p className="mt-5 max-w-[40ch] text-muted">
            A few details help us suggest the right session — a memory workshop before board exams, a parent evening,
            or a training day for your teachers.
          </p>
          <RhythmMark className="mt-8 hidden w-20 text-brand lg:block" />
        </div>
        <div className="rounded-lg bg-surface p-6 shadow-1 ring-1 ring-line sm:p-8">
          <EnquiryForm />
        </div>
      </section>

      <section aria-labelledby="next-title" className="bg-bg-alt py-[var(--section-y)]">
        <div className="page-wrap">
          <h2 id="next-title" className="text-[length:var(--text-2xl)]">
            What happens next
          </h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {NEXT_STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-recall font-display text-lg font-semibold text-ink">
                    {i + 1}
                  </span>
                  {i < NEXT_STEPS.length - 1 ? (
                    <span aria-hidden="true" className="hidden h-px flex-1 bg-line-strong md:block" />
                  ) : null}
                </div>
                <h3 className="mt-5 text-[length:var(--text-lg)]">{step.title}</h3>
                <p className="mt-2 max-w-[36ch] text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={WHATSAPP_URL} external variant="recall" size="lg">
              Prefer to talk? WhatsApp us
            </ButtonLink>
            <p className="text-sm text-muted">Or call {formatPhone(person.phones[1])}</p>
          </div>
        </div>
      </section>
    </>
  );
}
