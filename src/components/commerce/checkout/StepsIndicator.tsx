const STEPS = ["Details", "Payment", "Confirmation"] as const;

type Props = {
  current: 0 | 1 | 2;
};

/* The three steps drawn as revisits on a line — completed steps get the marigold dot. */
export function StepsIndicator({ current }: Props) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="flex items-center gap-2 sm:gap-3">
        {STEPS.map((label, i) => {
          const isDone = i < current;
          const isCurrent = i === current;
          return (
            <li key={label} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3" aria-current={isCurrent ? "step" : undefined}>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-[background-color,color] duration-[var(--dur-base)] ease-[var(--ease-out)] ${
                  isDone ? "bg-recall text-ink" : isCurrent ? "bg-brand text-paper" : "bg-bg-alt text-muted ring-1 ring-line"
                }`}
                aria-hidden="true"
              >
                {isDone ? "✓" : i + 1}
              </span>
              <span className={`truncate text-sm ${isCurrent ? "font-semibold" : "text-muted"}`}>
                {label}
                <span className="sr-only">{isDone ? " (completed)" : isCurrent ? " (current step)" : ""}</span>
              </span>
              {i < STEPS.length - 1 ? (
                <span className={`hidden h-px flex-1 sm:block ${isDone ? "bg-recall" : "bg-line"}`} aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
