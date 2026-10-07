import { competencies } from "@/lib/data/site";

/** Five core competencies as an editorial numbered list, with a sticky heading. */
export function Competencies() {
  return (
    <section aria-labelledby="competencies-title" className="py-[var(--section-y)]">
      <div className="page-wrap grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div className="md:sticky md:top-[calc(var(--header-h)+2rem)] md:self-start">
          <p className="eyebrow">What he works on</p>
          <h2 id="competencies-title" className="mt-3 text-[length:var(--text-3xl)]">
            Five crafts, one practice
          </h2>
          <p className="mt-5 max-w-[42ch] text-muted">
            Curriculum, teachers, parents, students and the inner life — the same principles of memory and meaning
            run through all five.
          </p>
        </div>

        <ol className="border-t border-line">
          {competencies.map((c, i) => (
            <li key={c.title} className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 border-b border-line py-7 sm:grid-cols-[5rem_minmax(0,1fr)] sm:py-9">
              <span
                aria-hidden="true"
                className="font-display text-[length:var(--text-2xl)] leading-none font-semibold text-recall-text tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[length:var(--text-xl)]">{c.title}</h3>
                <p className="mt-3 max-w-[60ch] text-muted">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
