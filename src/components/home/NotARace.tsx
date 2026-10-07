/* Chapter 2 — the tension, said in his school's own words. Quiet: no scene. */
export function NotARace() {
  return (
    <section aria-labelledby="race-title" className="page-wrap py-[var(--section-y)]">
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <h2 id="race-title" className="text-[length:var(--text-3xl)] leading-[1.05]">
          Learning is not a race.
          <span className="mt-2 block text-recall-text">It&apos;s a rhythm.</span>
        </h2>
        <div className="space-y-5 text-lg text-muted md:pb-2">
          <p>
            Most of us were taught to cram: read it again, stay up late, hope it holds until the exam. Then we
            forget — and decide we were never good at studying.
          </p>
          <p className="text-ink">
            Kamlesh Chandra teaches the opposite. Every child is born whole, wise and wondrous; the work is to
            protect that wonder and give the mind a rhythm it can trust.
          </p>
        </div>
      </div>
    </section>
  );
}
