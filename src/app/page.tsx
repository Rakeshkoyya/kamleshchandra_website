import { ColdOpen } from "@/components/home/ColdOpen";
import { DailyMantra } from "@/components/home/DailyMantra";
import { Invitation } from "@/components/home/Invitation";
import { LearnWithKC } from "@/components/home/LearnWithKC";
import { Ledger } from "@/components/home/Ledger";
import { NoticeBoard } from "@/components/home/NoticeBoard";
import { NotARace } from "@/components/home/NotARace";
import { RhythmOfRemembering } from "@/components/home/RhythmOfRemembering";
import { RhythmDivider } from "@/components/ui/RhythmMark";

/* Chapters in the order of the Structure plan (.ui-craft/design.md). */
export default function HomePage() {
  return (
    <>
      <ColdOpen />
      <RhythmDivider />
      <NotARace />
      <RhythmOfRemembering />
      <Ledger />
      <LearnWithKC />
      <DailyMantra />
      <NoticeBoard />
      <Invitation />
    </>
  );
}
