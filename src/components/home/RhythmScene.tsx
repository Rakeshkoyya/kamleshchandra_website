/*
 * The showpiece: "the rhythm of remembering".
 * A forgetting curve that falls, then is lifted by recall on day 1, 7 and 30,
 * each time falling more gently — until the memory stays.
 * Authored in its FINISHED state; the scene engine animates from hidden.
 * Plot: x 60→560 (non-linear days), y 60 (100% memory) → 440 (0%).
 */
export function RhythmScene() {
  return (
    <svg viewBox="0 0 600 500" className="h-full w-full" fill="none">
      {/* axes + grid */}
      <g stroke="var(--color-border)" strokeWidth="1">
        <line x1="60" y1="60" x2="560" y2="60" strokeDasharray="2 6" />
        <line x1="60" y1="250" x2="560" y2="250" strokeDasharray="2 6" />
        <line x1="60" y1="440" x2="560" y2="440" />
        <line x1="60" y1="40" x2="60" y2="440" />
      </g>
      <g fill="var(--color-muted)" fontFamily="var(--font-mukta), sans-serif" fontSize="15">
        <text x="52" y="65" textAnchor="end">100%</text>
        <text x="52" y="445" textAnchor="end">0</text>
        <text x="60" y="468" textAnchor="middle">Day 0</text>
        <text x="150" y="468" textAnchor="middle">Day 1</text>
        <text x="270" y="468" textAnchor="middle">Day 7</text>
        <text x="420" y="468" textAnchor="middle">Day 30</text>
        <text x="18" y="250" transform="rotate(-90 18 250)" textAnchor="middle" letterSpacing="2">
          MEMORY
        </text>
      </g>

      {/* step 0 — learn, then forget */}
      <path data-step="0" data-enter="draw" d="M60 60 C 80 230, 110 300, 150 312" stroke="var(--violet)" strokeWidth="5" strokeLinecap="butt" />

      {/* step 1 — recall on day 1 lifts it; it falls more slowly */}
      <circle data-step="1" data-enter="pop" data-order="0" cx="150" cy="72" r="10" fill="var(--color-recall)" />
      <path
        data-step="1"
        data-enter="draw"
        data-order="1"
        d="M150 312 L150 72 C 180 170, 220 205, 270 215"
        stroke="var(--violet)"
        strokeWidth="5"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />

      {/* step 2 — day 7 */}
      <circle data-step="2" data-enter="pop" data-order="0" cx="270" cy="80" r="10" fill="var(--color-recall)" />
      <path
        data-step="2"
        data-enter="draw"
        data-order="1"
        d="M270 215 L270 80 C 320 130, 370 145, 420 150"
        stroke="var(--violet)"
        strokeWidth="5"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />

      {/* step 3 — day 30: it barely bends; and what happens without revisits */}
      <circle data-step="3" data-enter="pop" data-order="0" cx="420" cy="85" r="10" fill="var(--color-recall)" />
      <path
        data-step="3"
        data-enter="draw"
        data-order="1"
        d="M420 150 L420 85 C 470 100, 520 106, 560 108"
        stroke="var(--violet)"
        strokeWidth="5"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
      <path
        data-step="3"
        data-enter="draw"
        data-order="2"
        d="M150 312 C 250 350, 400 384, 560 398"
        stroke="var(--color-muted)"
        strokeWidth="2.5"
        opacity="0.55"
      />
      <g data-step="3" data-enter="fade" data-order="3" fontFamily="var(--font-mukta), sans-serif" fontSize="16" fontWeight="600">
        <text x="560" y="96" textAnchor="end" fill="var(--violet)">
          kept
        </text>
        <text x="556" y="426" textAnchor="end" fill="var(--color-muted)">
          without revisits
        </text>
      </g>
    </svg>
  );
}
