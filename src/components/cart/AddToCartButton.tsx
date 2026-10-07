"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cartActions, cartDrawer } from "@/lib/cart/store";
import type { CartItem } from "@/lib/types";

type Props = {
  item: Omit<CartItem, "id" | "quantity">;
  quantity?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "recall" | "secondary";
  className?: string;
  disabled?: boolean;
};

export function AddToCartButton({ item, quantity = 1, label = "Add to cart", size = "lg", variant = "primary", className, disabled }: Props) {
  const [isAdded, setIsAdded] = useState(false);

  function handleClick() {
    cartActions.add(item, quantity);
    setIsAdded(true);
    cartDrawer.open();
    window.setTimeout(() => setIsAdded(false), 1600);
  }

  return (
    <Button size={size} variant={variant} className={className} onClick={handleClick} disabled={disabled}>
      {isAdded ? "Added ✓" : label}
    </Button>
  );
}
