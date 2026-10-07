import type { Metadata } from "next";
import { AboutHero, AboutOrigin, AboutTension } from "@/components/content/about/AboutStory";
import { Competencies } from "@/components/content/about/Competencies";
import { FrameworksDiagram } from "@/components/content/about/FrameworksDiagram";
import { ProofLedger, RolesRoll } from "@/components/content/about/RolesAndProof";
import { ShanaPromise } from "@/components/content/about/ShanaPromise";
import { ButtonLink } from "@/components/ui/Button";
import { RhythmDivider, RhythmMark } from "@/components/ui/RhythmMark";
import { mantra, person } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Kamlesh Chandra — Director – Academics at SHANA International School, Bikaner, and creator of Scientific Retention Management (SRM) and the Quantum Learning Mechanism (QLM).",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutOrigin />
      <AboutTension />

      <section aria-labelledby="frameworks-title" className="py-[var(--section-y)]">
        <div className="page-wrap">
          <div className="max-w-[60ch]">
            <p className="eyebrow">His answer, in two parts</p>
            <h2 id="frameworks-title" className="mt-3 text-[length:var(--text-3xl)]">
              First keep what you learn. Then let it multiply.
            </h2>
            <p className="mt-5 text-lg text-muted">
              Two frameworks sit at the centre of everything he teaches — one about holding on, one about growing
              outward. Together they turn a race into a rhythm.
            </p>
          </div>
          <div className="mt-14">
            <FrameworksDiagram />
          </div>
        </div>
      </section>

      <RhythmDivider />
      <Competencies />
      <RolesRoll />
      <ProofLedger />
      <ShanaPromise />

      <section aria-labelledby="invite-title" className="bg-bg-alt py-[var(--section-y)]">
        <div className="page-wrap flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[46ch]">
            <RhythmMark className="w-16 text-brand" />
            <h2 id="invite-title" className="mt-5 text-[length:var(--text-3xl)]">
              Bring the rhythm to your school — or join a class yourself.
            </h2>
            <p className="mt-5 font-script text-[length:var(--text-xl)] text-script">{mantra.invite}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/contact" size="lg">
              Invite KC to your school
            </ButtonLink>
            <ButtonLink href={person.classesFormUrl} external variant="secondary" size="lg">
              Join the online classes
              <span className="sr-only"> (opens a Google Form in a new tab)</span>
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
