import type { Book } from "@/lib/types";
import { RhythmMark } from "./RhythmMark";

/*
 * A typographic book cover drawn in code — stands in for real cover art
 * until the designed covers exist. Keeps a fixed 2:3 ratio (no layout shift).
 */
const tones: Record<Book["coverTone"], { bg: string; fg: string; band: string }> = {
  violet: { bg: "var(--violet)", fg: "var(--paper)", band: "var(--marigold)" },
  marigold: { bg: "var(--marigold)", fg: "var(--ink)", band: "var(--violet)" },
  ink: { bg: "var(--ink)", fg: "var(--paper)", band: "var(--marigold)" },
  rose: { bg: "#f6dfe6", fg: "var(--ink)", band: "var(--rose)" },
};

interface BookCoverProps {
  book: Pick<Book, "title" | "coverLine" | "coverTone">;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BookCover({ book, className = "", size = "md" }: BookCoverProps) {
  const t = tones[book.coverTone];
  const titleSize = size === "lg" ? "text-3xl md:text-4xl" : size === "sm" ? "text-[clamp(0.85rem,0.6rem+0.6vw,1.05rem)]" : "text-2xl";
  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-r-md rounded-l-sm shadow-2 ${className}`}
      style={{ background: t.bg, color: t.fg }}
      role="img"
      aria-label={`Cover of ${book.title}`}
    >
      {/* spine shading */}
      <div className="absolute inset-y-0 left-0 w-3 bg-black/15" aria-hidden="true" />
      <div className="absolute inset-y-0 left-3 w-px bg-white/20" aria-hidden="true" />
      <div className="flex h-full flex-col justify-between p-[9%] pl-[14%]">
        <p className={`font-bold uppercase opacity-80 ${size === "sm" ? "text-[0.5rem] tracking-[0.12em]" : "text-[0.62rem] tracking-[0.2em]"}`} aria-hidden="true">
          Kamlesh Chandra
        </p>
        <div aria-hidden="true">
          <p className={`font-display font-semibold leading-[1.05] ${titleSize}`}>{book.title}</p>
          <div className="mt-4 h-1 w-10 rounded-full" style={{ background: t.band }} />
          {size === "sm" ? null : <p className="mt-3 font-script text-sm opacity-90">{book.coverLine}</p>}
        </div>
        <RhythmMark className="w-12 opacity-90" />
      </div>
    </div>
  );
}
