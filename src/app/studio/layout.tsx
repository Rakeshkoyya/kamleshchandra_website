import type { Metadata } from "next";
import Link from "next/link";
import { StudioNav } from "@/components/studio/StudioNav";
import { ToastProvider } from "@/components/studio/Toast";

export const metadata: Metadata = {
  title: { default: "Studio", template: "%s · KC Studio" },
  robots: { index: false, follow: false },
};

/*
 * Admin studio chrome. The public header/footer return null under /studio.
 * BACKEND: gate this whole segment behind an admin session (proxy.ts / layout check) before launch.
 */
export default function StudioLayout({ children }: LayoutProps<"/studio">) {
  return (
    <ToastProvider>
      <div className="min-h-svh bg-bg lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <StudioNav />
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-dashed border-recall bg-recall-soft px-3 py-1 text-xs font-semibold text-recall-text">
              <span className="h-1.5 w-1.5 rounded-full bg-recall" aria-hidden="true" />
              Demo studio — changes are not saved
            </p>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm font-semibold whitespace-nowrap text-brand hover:underline">
                View site <span aria-hidden="true">↗</span>
              </Link>
              <span
                className="grid h-9 w-9 place-items-center rounded-full bg-brand font-display text-sm font-semibold text-paper"
                role="img"
                aria-label="Signed in as Kamlesh Chandra"
              >
                KC
              </span>
            </div>
          </div>
          <div className="flex-1 px-4 py-8 md:px-8 md:py-10">{children}</div>
        </div>
      </div>
    </ToastProvider>
  );
}
