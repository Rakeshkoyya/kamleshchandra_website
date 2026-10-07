import { Badge } from "@/components/ui/misc";
import type { OrderStatus } from "@/lib/types";

type Tone = "neutral" | "brand" | "recall" | "success" | "danger";

const ORDER_TONE: Record<OrderStatus, Tone> = {
  paid: "success",
  pending: "recall",
  refunded: "neutral",
  failed: "danger",
};

const ORDER_ICON: Record<OrderStatus, string> = { paid: "✓", pending: "…", refunded: "↺", failed: "✕" };

/** Order status — colour is never alone: icon + word ride along. */
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge tone={ORDER_TONE[status]} className="gap-1 capitalize">
      <span aria-hidden="true">{ORDER_ICON[status]}</span>
      {status}
    </Badge>
  );
}

const PUBLISH_TONE: Record<string, Tone> = {
  published: "success",
  draft: "neutral",
  scheduled: "brand",
  "pre-order": "recall",
  upcoming: "brand",
  past: "neutral",
};

/** Content status: published / draft / scheduled / pre-order / upcoming / past. */
export function PublishBadge({ status }: { status: string }) {
  return (
    <Badge tone={PUBLISH_TONE[status] ?? "neutral"} className="capitalize">
      {status.replace("-", " ")}
    </Badge>
  );
}
