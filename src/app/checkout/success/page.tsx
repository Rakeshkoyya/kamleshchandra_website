import type { Metadata } from "next";
import { SuccessView } from "@/components/commerce/checkout/SuccessView";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return <SuccessView />;
}
