import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { mantra, person } from "@/lib/data/site";

/* Chapter 8 — the invitation, in the words of his cards. */
export function Invitation() {
  return (
    <section aria-labelledby="invite-title" className="page-wrap pt-[var(--section-y)]">
      <div className="grid overflow-hidden rounded-lg bg-brand text-paper md:grid-cols-2">
        <figure className="relative min-h-64">
          <Image
            src="/images/teacher-training.jpg"
            alt="Teachers working in small groups at round tables during a training session"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <figcaption className="absolute bottom-2 left-3 rounded bg-ink/70 px-2 py-0.5 text-[0.7rem] text-paper">
            Photo: TESS-India, CC BY-SA 2.0
          </figcaption>
        </figure>
        <div className="p-8 md:p-12">
          <p className="font-script text-xl text-on-ink-accent">{mantra.invite}</p>
          <h2 id="invite-title" className="mt-4 text-[length:var(--text-2xl)]">
            Bring KC to your school, or join his online classes.
          </h2>
          <p className="mt-4 text-on-ink-muted">
            Workshops for students, capacity-building for teachers, and parent seminars — in person across India or
            live online.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact" variant="recall" size="lg">
              Invite KC to your school
            </ButtonLink>
            <ButtonLink
              href={person.classesFormUrl}
              external
              size="lg"
              variant="ghost"
              className="text-paper ring-1 ring-paper/50 hover:bg-paper/10"
            >
              Join online classes
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
