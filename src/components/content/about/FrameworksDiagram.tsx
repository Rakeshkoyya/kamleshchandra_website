import { frameworks } from "@/lib/data/site";

/*
 * SRM and QLM as one two-part diagram: the first half KEEPS (a forgetting curve
 * lifted by recall), the second half CONNECTS (one idea branching into many).
 * Deliberately two different drawings, joined on a shared spine.
 */

const [srm, qlm] = frameworks;

function RetentionCurve() {
  return (
    <svg
      viewBox="0 0 400 210"
      className="h-auto w-full text-brand"
      role="img"
      aria-label="Diagram: without revisits, memory falls steadily. With three timed recalls, the curve is lifted each time and ends high."
    >
      {/* axes */}
      <path d="M24 16 V186 H392" className="stroke-line-strong" strokeWidth="1.25" fill="none" />
      <text x="28" y="14" className="fill-muted text-[13px]">
        memory
      </text>
      <text x="392" y="204" textAnchor="end" className="fill-muted text-[13px]">
        time
      </text>
      {/* the curve without revisits */}
      <path
        d="M30 30 C 70 120, 120 160, 200 172 S 340 182, 388 183"
        className="stroke-line-strong"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        fill="none"
      />
      <text x="300" y="172" className="fill-muted text-[13px]">
        crammed once
      </text>
      {/* the curve with recall */}
      <path
        d="M30 30 C 52 90, 74 118, 104 126 L 104 52 C 130 96, 160 108, 196 110 L 196 44 C 228 76, 262 84, 296 86 L 296 38 C 330 52, 360 54, 388 54"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {[
        [104, 52, "recall"],
        [196, 44, "recall"],
        [296, 38, "recall"],
      ].map(([x, y, label]) => (
        <g key={`${x}`}>
          <circle cx={x} cy={y} r="6" fill="var(--color-recall)" />
          <text x={Number(x)} y={Number(y) - 12} textAnchor="middle" className="fill-recall-text text-[13px] font-semibold">
            {label}
          </text>
        </g>
      ))}
      <text x="388" y="70" textAnchor="end" className="fill-brand text-[13px] font-semibold">
        kept
      </text>
    </svg>
  );
}

const TREE = {
  root: [200, 196],
  l1: [
    [130, 146],
    [270, 146],
  ],
  l2: [
    [90, 98],
    [170, 98],
    [230, 98],
    [310, 98],
  ],
  l3: [
    [60, 40],
    [112, 30],
    [150, 46],
    [186, 28],
    [214, 28],
    [250, 46],
    [288, 30],
    [340, 40],
  ],
} as const;

function ConnectionTree() {
  const lines: [readonly number[], readonly number[]][] = [
    ...TREE.l1.map((p) => [TREE.root, p] as [readonly number[], readonly number[]]),
    ...TREE.l2.map((p, i) => [TREE.l1[Math.floor(i / 2)], p] as [readonly number[], readonly number[]]),
    ...TREE.l3.map((p, i) => [TREE.l2[Math.floor(i / 2)], p] as [readonly number[], readonly number[]]),
  ];
  return (
    <svg
      viewBox="0 0 400 214"
      className="h-auto w-full text-paper"
      role="img"
      aria-label="Diagram: one rooted idea branches into two, then four, then eight connected ideas — each new idea hooked onto what is already known."
    >
      {lines.map(([a, b]) => (
        <path
          key={`${a.join()}-${b.join()}`}
          d={`M${a[0]} ${a[1]} C ${a[0]} ${(a[1] + b[1]) / 2}, ${b[0]} ${(a[1] + b[1]) / 2}, ${b[0]} ${b[1]}`}
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="1.75"
          fill="none"
        />
      ))}
      <circle cx={TREE.root[0]} cy={TREE.root[1]} r="9" fill="currentColor" />
      {[...TREE.l1, ...TREE.l2].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="currentColor" />
      ))}
      {TREE.l3.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5.5" fill="var(--color-recall)" />
      ))}
    </svg>
  );
}

export function FrameworksDiagram() {
  return (
    <div className="grid rounded-lg shadow-2 md:grid-cols-2">
      <article className="relative rounded-t-lg bg-surface p-6 sm:p-9 md:rounded-l-lg md:rounded-tr-none" aria-labelledby="fw-srm">
        <p className="eyebrow">Part one · keep</p>
        <h3 id="fw-srm" className="mt-3 text-[length:var(--text-2xl)]">
          <span className="font-display text-recall-text">{srm.short}</span>
          <span className="mt-1 block text-[length:var(--text-lg)] text-ink">{srm.name}</span>
        </h3>
        <p className="mt-4 font-display text-lg italic text-ink">{srm.line}</p>
        <div className="mt-6">
          <RetentionCurve />
        </div>
        <p className="mt-5 text-muted">{srm.body}</p>
      </article>

      <article className="relative rounded-b-lg bg-ink p-6 pt-10 text-paper sm:p-9 sm:pt-12 md:rounded-r-lg md:rounded-bl-none md:pt-9" aria-labelledby="fw-qlm">
        {/* the joint between the two halves */}
        <span
          aria-hidden="true"
          className="absolute -top-6 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full bg-recall font-display text-2xl font-semibold text-ink shadow-1 md:top-1/2 md:-left-6 md:translate-x-0 md:-translate-y-1/2"
        >
          +
        </span>
        <p className="eyebrow text-on-ink-accent!">Part two · connect</p>
        <h3 id="fw-qlm" className="mt-3 text-[length:var(--text-2xl)]">
          <span className="font-display text-on-ink-accent">{qlm.short}</span>
          <span className="mt-1 block text-[length:var(--text-lg)] text-paper">{qlm.name}</span>
        </h3>
        <p className="mt-4 font-display text-lg italic">{qlm.line}</p>
        <div className="mt-6">
          <ConnectionTree />
        </div>
        <p className="mt-5 text-on-ink-muted">{qlm.body}</p>
      </article>
    </div>
  );
}
