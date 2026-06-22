"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/i18n/context";
import type { Product } from "@/data/products";
import Button from "@/components/ui/Button";

interface AddToCartButtonProps {
  product: Product;
  selectedMaterial: string;
  selectedStyle: string;
  selectedLength: string;
  disabled?: boolean;
  label?: string;
}

export default function AddToCartButton({
  product,
  selectedMaterial,
  selectedStyle,
  selectedLength,
  disabled = false,
  label,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { t } = useI18n();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (disabled) {
      return;
    }

    addItem(product, selectedMaterial, selectedStyle, selectedLength);
    track("add_to_cart", {
      product: product.slug,
      material: selectedMaterial,
      style: selectedStyle,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button fullWidth onClick={handleClick} disabled={disabled}>
      {label ?? (added ? t.product.added : t.product.addToBag)}
    </Button>
  );
}
