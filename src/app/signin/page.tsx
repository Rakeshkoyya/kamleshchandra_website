import type { Metadata } from "next";
import { SignInFlow } from "@/components/account/SignInFlow";
import { RhythmMark } from "@/components/ui/RhythmMark";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with your mobile number to continue your courses, books and revisits.",
  robots: { index: false },
};

export default function SignInPage() {
  return (
    <div className="page-wrap grid items-center gap-12 py-14 md:grid-cols-[1fr_minmax(0,28rem)] md:py-24">
      <div className="max-w-[34rem]">
        <RhythmMark className="rise-in w-16 text-brand" />
        <p className="eyebrow rise-in mt-6" style={{ ["--i" as string]: 1 }}>
          Welcome back
        </p>
        <h1 className="rise-in mt-3 text-[length:var(--text-3xl)]" style={{ ["--i" as string]: 2 }}>
          Pick up where your memory left off.
        </h1>
        <p className="rise-in mt-5 text-lg text-muted" style={{ ["--i" as string]: 3 }}>
          Your lessons, your books and today&rsquo;s revisit are waiting. Sign in with the mobile number you used to enrol — no
          password to remember.
        </p>
      </div>
      <div className="rise-in" style={{ ["--i" as string]: 2 }}>
        <h2 className="sr-only">Sign in</h2>
        <SignInFlow />
      </div>
    </div>
  );
}
