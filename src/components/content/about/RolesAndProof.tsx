import { person, press, proof } from "@/lib/data/site";

const indianNumber = new Intl.NumberFormat("en-IN");

/** All eight roles, typeset as one continuous line of the masthead. */
export function RolesRoll() {
  return (
    <section aria-labelledby="roles-title" className="bg-bg-alt py-[var(--section-y)]">
      <div className="page-wrap">
        <h2 id="roles-title" className="eyebrow">
          Eight roles, one person
        </h2>
        <ul className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2 font-display text-[length:var(--text-2xl)] leading-snug text-ink">
          {person.roles.map((role, i) => (
            <li key={role} className="inline-flex items-baseline gap-3">
              <span className={i === 0 ? "text-brand" : undefined}>{role}</span>
              {i < person.roles.length - 1 ? (
                <span aria-hidden="true" className="inline-block h-2 w-2 -translate-y-1 rounded-full bg-recall" />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Numbers from the profile sheet, and a text-only press masthead. */
export function ProofLedger() {
  return (
    <section aria-labelledby="proof-title" className="py-[var(--section-y)]">
      <div className="page-wrap">
        <p className="eyebrow">The work, counted</p>
        <h2 id="proof-title" className="mt-3 max-w-[22ch] text-[length:var(--text-3xl)]">
          Two decades, one classroom at a time
        </h2>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 lg:grid-cols-5">
          {proof.map((p, i) => (
            <div key={p.label} className={i === proof.length - 1 ? "col-span-2 lg:col-span-1" : undefined}>
              <dt className="sr-only">{p.label}</dt>
              <dd>
                <span className="block font-display text-[length:var(--text-3xl)] leading-none font-semibold text-brand tabular-nums">
                  {indianNumber.format(p.value)}
                  <span className="text-recall-text">{p.suffix}</span>
                </span>
                <span className="mt-3 block font-semibold text-ink" aria-hidden="true">
                  {p.label}
                </span>
                <span className="mt-1 block text-sm text-muted">{p.detail}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 rounded-lg border border-line bg-surface px-6 py-7 sm:px-10">
          <h3 className="eyebrow">Featured in</h3>
          <ul className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-10">
            {press.map((name) => (
              <li key={name} className="font-display text-[length:var(--text-xl)] italic text-ink">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
