import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/commerce/checkout/CheckoutFlow";
import { SampleNote } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <header className="page-wrap pt-10 pb-8 md:pt-14">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="mt-3 text-[length:var(--text-3xl)]">Almost there.</h1>
        <SampleNote className="mt-4">Demo checkout — no real payment is taken</SampleNote>
      </header>
      <CheckoutFlow />
    </>
  );
}
