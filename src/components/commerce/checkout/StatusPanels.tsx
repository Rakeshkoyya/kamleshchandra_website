import { Button } from "@/components/ui/Button";
import { RhythmMark } from "@/components/ui/RhythmMark";
import { formatInr } from "@/lib/format";

export function ProcessingPanel({ totalInr, method }: { totalInr: number; method: string }) {
  return (
    <div className="py-10 text-center" role="status">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-soft">
        <RhythmMark className="w-12 animate-pulse text-brand motion-reduce:animate-none" />
      </div>
      <h3 className="mt-6 font-display text-2xl">Confirming your payment…</h3>
      <p className="mt-2 text-muted">
        {method === "UPI" ? "Approve the request in your UPI app. " : ""}
        Paying {formatInr(totalInr)} — please don&rsquo;t close or refresh this page.
      </p>
    </div>
  );
}

type FailedProps = {
  reason: string;
  onRetry: () => void;
  onChangeMethod: () => void;
};

export function FailedPanel({ reason, onRetry, onChangeMethod }: FailedProps) {
  return (
    <div className="rounded-lg bg-danger-soft p-6 md:p-8" role="alert">
      <p className="text-xs font-bold tracking-[0.14em] text-danger uppercase">Payment failed</p>
      <h3 className="mt-2 font-display text-2xl">Your payment didn&rsquo;t go through.</h3>
      <p className="mt-2">{reason}</p>
      <p className="mt-1 text-sm text-muted">No money has been taken. If your bank shows a debit, it will be reversed automatically within 5–7 days.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={onRetry}>Try again</Button>
        <Button variant="secondary" onClick={onChangeMethod}>
          Use another method
        </Button>
      </div>
    </div>
  );
}
