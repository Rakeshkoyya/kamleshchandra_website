import { StoryScroll } from "@/components/story/StoryScroll";
import { RhythmScene } from "./RhythmScene";

/*
 * Chapter 3 — the showpiece. Step copy explains Scientific Retention
 * Management as spaced recall. [confirm wording of the method with KC]
 */
const steps = [
  {
    id: "learn",
    day: "Day 0",
    title: "You learn it.",
    body: "A lesson goes in bright and clear. By the next day most of it is already slipping away — the forgetting curve Hermann Ebbinghaus first drew in 1885.",
  },
  {
    id: "recall",
    day: "Day 1",
    title: "Recall, don't reread.",
    body: "Close the book and pull it back out of memory. The curve jumps back up — and this time it falls more slowly.",
  },
  {
    id: "revisit",
    day: "Day 7",
    title: "Revisit in rhythm.",
    body: "A second recall a week later. Each revisit tells the brain: this matters, keep it.",
  },
  {
    id: "yours",
    day: "Day 30",
    title: "Now it's yours.",
    body: "By the third revisit the curve barely bends. That is the heart of Scientific Retention Management — not more hours, but the right moments.",
  },
];

export function RhythmOfRemembering() {
  return (
    <div className="bg-bg-alt pt-[var(--section-y)] pb-6">
      <div className="page-wrap">
        <p className="eyebrow">Scientific Retention Management</p>
        <h2 className="mt-3 max-w-[20ch] text-[length:var(--text-3xl)]">The rhythm of remembering</h2>
        <p className="mt-4 max-w-[52ch] text-lg text-muted">
          Forgetting isn&apos;t failure. It&apos;s the brain asking a question: <em>does this matter?</em> Here is how
          you answer it.
        </p>
        <StoryScroll
          label="The rhythm of remembering"
          layout="stage-right"
          language="organic"
          mode="scrub"
          className="mt-6 [--story-cols:minmax(0,5fr)_minmax(0,7fr)] [--story-step-min:70svh]"
          stage={<RhythmScene />}
          steps={steps.map((s) => ({
            id: s.id,
            content: (
              <>
                <p className="font-script text-xl text-recall-text">{s.day}</p>
                <h3 className="mt-1 text-[length:var(--text-2xl)]">{s.title}</h3>
                <p className="mt-3 max-w-[40ch] text-lg text-muted">{s.body}</p>
              </>
            ),
          }))}
        />
      </div>
    </div>
  );
}
