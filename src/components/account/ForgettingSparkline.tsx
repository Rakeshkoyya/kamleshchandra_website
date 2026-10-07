import { forgettingCurve, REVISIT_DAYS } from "./revisit";

type Props = {
  /** Index into REVISIT_DAYS of the review that is due next */
  stageIndex: number;
  className?: string;
};

const W = 168;
const H = 52;

/*
 * Inline forgetting-curve sparkline: the line falls, each marigold dot is a
 * revisit lifting it back up. Done reviews are filled; the one due next wears
 * a halo; later ones are hollow.
 */
export function ForgettingSparkline({ stageIndex, className = "" }: Props) {
  const { path, dots } = forgettingCurve(W, H);
  const label = `Forgetting curve with revisits on day ${REVISIT_DAYS.join(", day ")}. ${stageIndex} of ${REVISIT_DAYS.length} done; day ${REVISIT_DAYS[stageIndex]} review is next.`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`h-auto w-full max-w-[168px] ${className}`} role="img" aria-label={label}>
      <line x1="5" x2={W - 5} y1={H - 5} y2={H - 5} stroke="var(--color-border)" strokeWidth="1" />
      <path d={path} fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {dots.map((d, i) => {
        const isDone = i < stageIndex;
        const isNext = i === stageIndex;
        return (
          <g key={d.day}>
            {isNext ? <circle cx={d.cx} cy={d.cy} r="7.5" fill="var(--marigold-soft)" /> : null}
            <circle
              cx={d.cx}
              cy={d.cy}
              r="4"
              fill={isDone || isNext ? "var(--color-recall)" : "var(--color-surface)"}
              stroke={isDone || isNext ? "var(--color-surface)" : "var(--color-recall)"}
              strokeWidth="2"
            />
          </g>
        );
      })}
    </svg>
  );
}
