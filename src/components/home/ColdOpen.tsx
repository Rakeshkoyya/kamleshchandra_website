import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { person } from "@/lib/data/site";

/* Chapter 1 — the cold open: his face, his line, and the rhythm line drawing itself across. */
export function ColdOpen() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="page-wrap grid items-center gap-12 pt-10 pb-16 md:grid-cols-[1.15fr_0.85fr] md:pt-16 md:pb-24">
        <div>
          <p className="eyebrow rise-in">Memory · Learning · Life design</p>
          <h1
            id="hero-title"
            className="rise-in mt-5 max-w-[13ch] text-[length:var(--text-4xl)] leading-[1.02]"
            style={{ ["--i" as string]: 1 }}
          >
            Your brain is worth <span className="whitespace-nowrap text-brand">$10 trillion.</span>
          </h1>
          <p className="rise-in mt-6 max-w-[46ch] text-lg text-muted" style={{ ["--i" as string]: 2 }}>
            For more than twenty years, Kamlesh Chandra has taught students, parents and teachers how memory really
            works — and how to keep what you learn, for life.
          </p>
          <div className="rise-in mt-9 flex flex-wrap gap-3" style={{ ["--i" as string]: 3 }}>
            <ButtonLink href="/programs" size="lg">
              Explore programs
            </ButtonLink>
            <ButtonLink href="/about" size="lg" variant="secondary">
              Read his story
            </ButtonLink>
          </div>
          <ul className="rise-in mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" style={{ ["--i" as string]: 4 }}>
            {person.roles.slice(1, 5).map((r) => (
              <li key={r} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-recall" aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <figure className="mx-auto w-full max-w-[22rem]">
          <div className="relative">
            {/* arch frame — multiply tints the grey photo into the violet paper */}
            <div className="overflow-hidden rounded-t-[999px] rounded-b-lg bg-brand-soft shadow-2">
              <Image
                src={person.portrait}
                alt="Kamlesh Chandra, smiling, in a dark sweater"
                width={286}
                height={452}
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 768px) 22rem, 80vw"
                className="h-auto w-full mix-blend-multiply grayscale contrast-[1.05]"
              />
            </div>
            {/* the rhythm line crosses the frame: fall, recall, rise */}
            <svg
              viewBox="0 0 400 120"
              className="hero-rhythm pointer-events-none absolute -bottom-10 left-1/2 w-[125%] -translate-x-1/2 text-brand"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 18 C 30 70, 52 86, 86 90 L 86 34 C 120 74, 146 80, 178 80 L 178 30 C 214 58, 250 62, 286 62 L 286 26 C 316 38, 350 40, 396 40"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="86" cy="34" r="8" fill="var(--color-recall)" />
              <circle cx="178" cy="30" r="8" fill="var(--color-recall)" />
              <circle cx="286" cy="26" r="8" fill="var(--color-recall)" />
            </svg>
          </div>
          <figcaption className="mt-16 text-center font-script text-xl whitespace-nowrap text-script md:text-2xl">Be Better Everyday — KC</figcaption>
        </figure>
      </div>
    </section>
  );
}
