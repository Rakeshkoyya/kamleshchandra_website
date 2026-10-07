import type { Metadata } from "next";
import { CartView } from "@/components/commerce/cart/CartView";
import { PageHeader } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Cart" title="Your cart" />
      <CartView />
    </>
  );
}
