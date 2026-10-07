import Image from "next/image";
import { person } from "@/lib/data/site";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { Photo } from "../Photo";
import { photoMeta } from "../photos";

/** Opening: who he is, with the portrait kept small and honest. */
export function AboutHero() {
  const portrait = photoMeta(person.portrait);
  return (
    <header className="page-wrap grid items-end gap-10 pt-12 pb-[var(--section-y)] md:grid-cols-[minmax(0,1fr)_auto] md:gap-16 md:pt-20">
      <div>
        <p className="eyebrow rise-in">About</p>
        <h1 className="rise-in mt-3 text-[length:var(--text-4xl)]" style={{ ["--i" as string]: 1 }}>
          {person.name}
        </h1>
        <p className="rise-in mt-4 font-display text-[length:var(--text-xl)] text-brand" style={{ ["--i" as string]: 2 }}>
          {person.roles[0]} · {person.roles[1]}
        </p>
        <p className="rise-in mt-6 max-w-[54ch] text-lg text-muted" style={{ ["--i" as string]: 3 }}>
          An educator for more than twenty years, and for over fifteen of them Director – Academics at SHANA
          International School in Bikaner. His work is simple to say and hard to do: help people keep what they
          learn — and believe in the minds that learned it.
        </p>
      </div>
      <figure className="rise-in w-full max-w-[18rem] justify-self-center md:justify-self-end" style={{ ["--i" as string]: 2 }}>
        <div className="relative isolate">
          <span aria-hidden="true" className="absolute -inset-3 -z-10 translate-x-4 translate-y-4 rounded-lg bg-brand-soft" />
          <Image
            src={person.portrait}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            sizes="288px"
            loading="eager"
            fetchPriority="high"
            className="h-auto w-full rounded-lg grayscale"
          />
        </div>
        <figcaption className="mt-3 flex items-center gap-2 text-xs text-muted">
          <RhythmMark className="w-8 text-brand" />
          {person.school.city}
        </figcaption>
      </figure>
    </header>
  );
}

/** Origin: two decades inside schools, and the garden idea. */
export function AboutOrigin() {
  return (
    <section aria-labelledby="origin-title" className="page-wrap grid gap-12 pb-[var(--section-y)] lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center">
      <Photo
        src="/images/teacher-training.jpg"
        sizes="(min-width: 1024px) 50vw, 100vw"
        imgClassName="rounded-lg shadow-1"
        caption="Stand-in photograph of a teacher workshop."
        className="lg:order-2"
      />
      <div className="lg:order-1">
        <p className="eyebrow">Where it began</p>
        <h2 id="origin-title" className="mt-3 max-w-[20ch] text-[length:var(--text-3xl)]">
          Schools built like gardens
        </h2>
        <div className="mt-6 max-w-[58ch] space-y-4 text-ink">
          <p>
            Kamlesh Chandra’s career has been spent inside schools — planning curricula, coaching teachers, sitting
            with parents and, above all, watching how children actually learn. At SHANA International, the school
            he helps lead as Director – Academics, that work grew into a philosophy.
          </p>
          <p>
            SHANA puts it plainly in its promise: “We build schools like gardens, where learning smells of earth and
            laughter and every question is a seed of discovery.” A garden does not hurry. It prepares the soil,
            waters, waits and trusts.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Tension: learning treated as a race. */
export function AboutTension() {
  return (
    <section aria-labelledby="tension-title" className="bg-ink py-[var(--section-y)] text-paper">
      <div className="page-wrap">
        <p className="eyebrow text-on-ink-accent!">The problem he kept meeting</p>
        <h2 id="tension-title" className="mt-4 max-w-[18ch] text-[length:var(--text-4xl)] text-paper">
          Too often, learning is treated as a race.
        </h2>
        <div className="mt-10 grid gap-8 text-lg text-on-ink-muted md:grid-cols-3">
          <p>
            <strong className="block font-display text-[length:var(--text-xl)] text-paper">Cram.</strong>
            A chapter learned perfectly on Sunday night.
          </p>
          <p>
            <strong className="block font-display text-[length:var(--text-xl)] text-paper">Re-read.</strong>
            The same pages again, because they feel familiar.
          </p>
          <p>
            <strong className="block font-display text-[length:var(--text-xl)] text-paper">Forget.</strong>
            Gone by Thursday’s test — and the child decides they are “not good at studies”.
          </p>
        </div>
        <p className="mt-12 max-w-[56ch] text-lg">
          The forgetting is biology, not carelessness. But the fear it breeds is real — and fear is the opposite of
          the freedom real learning needs. His answer was to stop fighting forgetting and start designing for it.
        </p>
      </div>
    </section>
  );
}
