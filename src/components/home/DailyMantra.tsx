import { mantra } from "@/lib/data/site";
import { TextHighlight } from "./TextHighlight";

/* Chapter 6 — his voice. The morning mantra, read word by word. */
export function DailyMantra() {
  return (
    <section aria-labelledby="mantra-title" className="page-wrap py-[var(--section-y)]">
      <h2 id="mantra-title" className="font-script text-[length:var(--text-2xl)] font-bold text-script">
        Remember this mantra. Practise it every day…
      </h2>
      <TextHighlight className="mt-8 font-display text-ink [--th-measure:30ch] [--th-size:clamp(1.6rem,1rem+2.4vw,2.75rem)]">
        {mantra.practice}
      </TextHighlight>
      <p className="mt-8 font-script text-4xl text-script" aria-label="Signed, KC">
        KC
      </p>
    </section>
  );
}
