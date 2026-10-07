import type { Metadata } from "next";
import { OrdersManager } from "@/components/studio/OrdersManager";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { SampleNote } from "@/components/ui/misc";
import { getOrders } from "@/lib/data/account";

export const metadata: Metadata = { title: "Orders" };

export default async function StudioOrdersPage() {
  // BACKEND: GET /api/admin/orders?status=&q=&page= (paginate server-side)
  const orders = await getOrders();

  return (
    <>
      <StudioPageHeader
        eyebrow="Sales"
        title="Orders"
        lead="Every purchase across programs, books and event seats. Open an order to see items or issue a refund."
        actions={<SampleNote>Sample orders</SampleNote>}
      />
      <OrdersManager initial={orders} />
    </>
  );
}
