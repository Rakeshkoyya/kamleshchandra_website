/*
 * A drawn QR *placeholder* — not a scannable code. Deterministic pattern so
 * server and client render identically.
 * BACKEND: render the real UPI intent QR returned by the gateway's create-order call.
 */
const SIZE = 25;

function isFinder(x: number, y: number): boolean {
  const inBox = (bx: number, by: number) => x >= bx && x < bx + 7 && y >= by && y < by + 7;
  return inBox(0, 0) || inBox(SIZE - 7, 0) || inBox(0, SIZE - 7);
}

function cells(): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  let seed = 7;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      if (!isFinder(x, y) && seed % 5 < 2) out.push({ x, y });
    }
  }
  return out;
}

const CELLS = cells();
const FINDERS = [
  [0, 0],
  [SIZE - 7, 0],
  [0, SIZE - 7],
] as const;

export function UpiQr({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`-2 -2 ${SIZE + 4} ${SIZE + 4}`} className={className} role="img" aria-label="UPI QR code placeholder (demo)">
      <rect x={-2} y={-2} width={SIZE + 4} height={SIZE + 4} rx={2} fill="var(--color-surface)" />
      {CELLS.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width={1} height={1} fill="var(--color-text)" />
      ))}
      {FINDERS.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x + 0.5} y={y + 0.5} width={6} height={6} fill="none" stroke="var(--color-text)" strokeWidth={1} />
          <rect x={x + 2} y={y + 2} width={3} height={3} fill="var(--color-recall)" />
        </g>
      ))}
    </svg>
  );
}
