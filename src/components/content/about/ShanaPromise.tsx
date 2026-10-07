import Image from "next/image";
import { person } from "@/lib/data/site";
import { Photo } from "../Photo";
import { photoMeta } from "../photos";

/* Lines quoted verbatim from SHANA International's promise (client docs). */
const PROMISE_LINES = [
  "Every child is born whole, wise and wondrous — and our mission is to protect that wonder.",
  "Our classrooms become communities — not of competition, but collaboration; not of fear, but freedom.",
  "We empower teachers as artists of awakening, parents as partners and children as co-creators of a wiser world.",
] as const;

const PATTERN = "/images/bikaner-pattern.jpg";

/** The Junagarh ornament as a thin texture band (decorative). */
export function PatternBand({ className = "" }: { className?: string }) {
  const meta = photoMeta(PATTERN);
  return (
    <figure className={className}>
      <div className="h-20 overflow-hidden sm:h-28">
        <Image
          src={PATTERN}
          alt=""
          width={meta.width}
          height={meta.height}
          sizes="100vw"
          className="h-full w-full object-cover object-[50%_40%]"
        />
      </div>
      <figcaption className="page-wrap mt-2 text-right text-xs text-muted">
        Junagarh Fort, Bikaner. {meta.credit}
      </figcaption>
    </figure>
  );
}

export function ShanaPromise() {
  return (
    <section aria-labelledby="promise-title" className="pb-[var(--section-y)]">
      <PatternBand />
      <div className="page-wrap mt-[var(--section-y)] grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <p className="eyebrow">The school he helps lead</p>
          <h2 id="promise-title" className="mt-3 text-[length:var(--text-xl)] text-muted">
            {person.school.name}, {person.school.city}
          </h2>
          <blockquote className="mt-8">
            <p className="font-display text-[length:var(--text-3xl)] leading-[1.1] font-semibold text-ink">
              “We dream of a school where learning is not a race, but a{" "}
              <span className="text-recall-text">rhythm</span> —
            </p>
            <p className="mt-4 max-w-[34ch] font-display text-[length:var(--text-xl)] italic text-brand">
              where every child grows like a tree, deeply rooted yet reaching for the infinite sky.”
            </p>
            <footer className="mt-5 text-sm text-muted">
              — from SHANA International’s promise.{" "}
              <span className="text-ink">{person.school.recognition}.</span>
            </footer>
          </blockquote>

          <ul className="mt-12 space-y-5 border-l-2 border-recall pl-6">
            {PROMISE_LINES.map((line) => (
              <li key={line} className="max-w-[56ch] text-ink">
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <a
              href={person.school.url}
              target="_blank"
              rel="noopener noreferrer"
              className="draw-link inline-flex min-h-10 items-center font-semibold text-brand"
            >
              Visit SHANA International<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>

        <Photo
          src="/images/schoolgirls.jpg"
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="lg:mt-24"
          imgClassName="rounded-lg shadow-2"
          caption="Stand-in photograph."
        />
      </div>
    </section>
  );
}
