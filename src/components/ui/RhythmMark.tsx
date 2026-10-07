/*
 * The rhythm mark — the brand's signature in miniature.
 * A forgetting curve that is lifted three times by recall (the marigold dots)
 * and ends higher than it started. Used as logo, divider and bullet.
 */

interface RhythmMarkProps {
  className?: string;
  title?: string;
}

export function RhythmMark({ className = "", title }: RhythmMarkProps) {
  return (
    <svg
      viewBox="0 0 64 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      <path
        d="M3 6 C 8 20, 12 24, 18 25 L 18 10 C 24 20, 28 22, 34 22 L 34 9 C 40 16, 46 17, 52 17 L 52 8 C 56 11, 59 11, 62 11"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="10" r="3.2" fill="var(--color-recall)" />
      <circle cx="34" cy="9" r="3.2" fill="var(--color-recall)" />
      <circle cx="52" cy="8" r="3.2" fill="var(--color-recall)" />
    </svg>
  );
}

/** Full-width section divider drawn from the same line. */
export function RhythmDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`page-wrap ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="h-8 w-full text-line-strong/60" fill="none">
        <path
          d="M0 8 C 60 30, 120 34, 200 34 L 200 14 C 300 30, 360 31, 440 31 L 440 12 C 560 26, 640 27, 720 27 L 720 10 C 860 22, 940 22, 1000 22 L 1000 9 C 1080 16, 1140 16, 1200 16"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
