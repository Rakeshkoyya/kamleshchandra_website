import Image from "next/image";
import Link from "next/link";
import { person, proof } from "@/lib/data/site";

/* Facts only from lib/data/site.ts — never add numbers or awards here. */
export function InstructorBlock() {
  const facts = proof.slice(0, 3);

  return (
    <section aria-labelledby="instructor-title" className="grid gap-8 rounded-lg bg-bg-alt p-6 md:grid-cols-[12rem_minmax(0,1fr)] md:p-10">
      <div className="relative aspect-[4/5] w-40 overflow-hidden rounded-lg md:w-full">
        <Image src={person.portrait} alt={`Portrait of ${person.name}`} fill sizes="12rem" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="eyebrow">Your guide</p>
        <h2 id="instructor-title" className="mt-3 text-[length:var(--text-2xl)]">
          {person.name}
        </h2>
        <p className="mt-2 text-muted">
          {person.roles[0]}, {person.school.name}, {person.school.city} · {person.roles[1]} · {person.roles[4]}
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="border-l-2 border-recall pl-3">
              <dt className="text-sm text-muted">{f.label}</dt>
              <dd className="font-display text-2xl font-semibold">
                {f.value.toLocaleString("en-IN")}
                {f.suffix}
              </dd>
            </div>
          ))}
        </dl>
        <Link href="/about" className="draw-link mt-6 inline-flex min-h-10 items-center font-semibold text-brand">
          Read his story →
        </Link>
      </div>
    </section>
  );
}
