import { Badge } from "@/components/ui/misc";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { AUDIENCE_LABEL, FORMAT_LABEL } from "@/lib/data/courses";
import { formatInr } from "@/lib/format";
import type { Audience, Course } from "@/lib/types";

type Props = {
  title: string;
  subtitle: string;
  audience: Audience[];
  format: Course["format"];
  level: Course["level"];
  price: number | null;
  compareAt: number | null;
  lessonCount: number;
  minutes: number;
  coverUrl: string | null;
};

/** How the program card will read on /programs — updates as the form changes. */
export function CoursePreviewCard(p: Props) {
  const hasCompare = p.compareAt !== null && p.price !== null && p.compareAt > p.price;
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-2">
      <div className="relative aspect-[16/10] bg-brand">
        {p.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- local preview of an unsaved upload
          <img src={p.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center">
            <RhythmMark className="w-24 text-paper/80" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge tone="recall">{FORMAT_LABEL[p.format]}</Badge>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5">
          {p.audience.map((a) => (
            <Badge key={a} tone="brand">
              {AUDIENCE_LABEL[a]}
            </Badge>
          ))}
          <Badge>{p.level}</Badge>
        </div>
        <p className="mt-3 font-display text-xl leading-snug font-semibold">{p.title || "Untitled program"}</p>
        <p className="mt-1.5 line-clamp-3 text-sm text-muted">{p.subtitle || "A one-line promise for learners appears here."}</p>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-3">
          <span className="text-xs text-muted">
            {p.lessonCount} lessons · {p.minutes} min
          </span>
          <span className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold">{p.price === null || Number.isNaN(p.price) ? "—" : formatInr(p.price)}</span>
            {hasCompare ? <s className="text-xs text-muted">{formatInr(p.compareAt ?? 0)}</s> : null}
          </span>
        </div>
      </div>
    </div>
  );
}
