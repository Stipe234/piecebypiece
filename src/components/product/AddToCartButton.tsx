"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/i18n/context";
import type { Product } from "@/data/products";
import Button from "@/components/ui/Button";

interface AddToCartButtonProps {
  product: Product;
  selectedMaterial: string;
  selectedLength: string;
}

export default function AddToCartButton({ product, selectedMaterial, selectedLength }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { t } = useI18n();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(product, selectedMaterial, selectedLength);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button fullWidth onClick={handleClick}>
      {added ? t.product.added : t.product.addToBag}
    </Button>
  );
}
