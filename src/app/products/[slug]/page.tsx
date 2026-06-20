"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import {
  getProduct,
  getProductContent,
  getLayersWithProducts,
  getProductVariants,
  getVariantImage,
  variantKey,
} from "@/data/products";
import { useI18n } from "@/i18n/context";
import { useProductAvailability } from "@/hooks/usePriceCents";
import ProductGallery from "@/components/product/ProductGallery";
import VariantSelector from "@/components/product/VariantSelector";
import LayersWithRow from "@/components/product/LayersWithRow";
import Accordion from "@/components/ui/Accordion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import WaitlistForm from "@/components/ui/WaitlistForm";

export default function ProductPage() {
  const params = useParams();
  const product = getProduct(params.slug as string);
  const { t, locale } = useI18n();

  if (!product) notFound();
  const productContent = getProductContent(product, locale);
  const layersWith = getLayersWithProducts(product);

  const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0]);
  const [selectedStyle, setSelectedStyle] = useState(product.styles[0]);

  // The gallery is driven by the selected variant: each material × style maps
  // to its own studio image, and picking a thumbnail updates the selectors.
  const selectedKey = variantKey(selectedMaterial, selectedStyle);

  // Live, override-aware price for the selected variant; falls back to catalog.
  const availability = useProductAvailability(product.id);
  const selectedVariant = availability?.variants.find((v) => v.variantKey === selectedKey);
  const liveCents = selectedVariant?.priceCents ?? availability?.priceCents ?? null;
  const displayPrice = liveCents != null ? liveCents / 100 : product.price;
  const galleryVariants = getProductVariants(product).map((v) => ({
    key: v.key,
    label: v.label,
    src: getVariantImage(product, v.material, v.style),
  }));

  const handleSelectVariant = (key: string) => {
    const variant = getProductVariants(product).find((v) => v.key === key);
    if (!variant) return;
    setSelectedMaterial(variant.material);
    setSelectedStyle(variant.style);
  };

  const materialLabels: Record<string, string> = {
    Gold: t.product.gold,
    Silver: t.product.silver,
  };

  const styleLabels: Record<string, string> = {
    Static: t.product.static,
    Dangling: t.product.dangling,
  };

  const accordionItems = [
    { title: t.product.materialsAndDimensions, content: productContent.details.materialsAndDimensions },
    { title: t.product.care, content: productContent.details.care },
    { title: t.product.shippingLabel, content: productContent.details.shipping },
  ];

  return (
    <>
      <section className="py-4 md:py-16 px-4 md:px-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20">
          <ProductGallery
            variants={galleryVariants}
            selectedKey={selectedKey}
            onSelect={handleSelectVariant}
          />

          <div className="flex flex-col gap-6 md:gap-8 md:py-8 md:sticky md:top-24 md:self-start">
            <div>
              <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-2 md:mb-3">
                {productContent.label}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl font-light tracking-wide">
                {productContent.name}
              </h1>
              <div className="mt-3 md:mt-4 flex items-center gap-3">
                <span className="text-lg md:text-xl text-[var(--color-text-primary)]">
                  €{displayPrice}
                </span>
                <span className="inline-flex items-center border border-[var(--color-border-dark)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-primary)]">
                  {t.waitlist.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:gap-5">
              <VariantSelector
                label={t.product.material}
                options={product.materials}
                selected={selectedMaterial}
                onSelect={setSelectedMaterial}
                displayLabels={materialLabels}
              />
              <VariantSelector
                label={t.product.style}
                options={product.styles}
                selected={selectedStyle}
                onSelect={setSelectedStyle}
                displayLabels={styleLabels}
              />
            </div>

            <div className="border-t border-[var(--color-border)] pt-6">
              <p className="text-[11px] tracking-[0.22em] uppercase text-[var(--color-text-tertiary)] mb-3">
                {t.waitlist.title}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                {t.waitlist.text}
              </p>
              <WaitlistForm
                editionName={productContent.name}
                material={selectedMaterial}
                style={selectedStyle}
              />
            </div>

            <Accordion items={accordionItems} />
          </div>
        </div>
      </section>

      <section className="mt-4 md:mt-16">
        <ScrollReveal>
          <div className="img-tactile relative aspect-[4/3] md:aspect-[21/9] overflow-hidden">
            <Image
              src="/images/lifestyle.jpg"
              alt="Hand chain worn in everyday life"
              fill
              quality={90}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </ScrollReveal>
      </section>

      <section className="py-16 md:py-32 px-6">
        <ScrollReveal>
          <div className="max-w-[640px] mx-auto text-center">
            <hr className="hr-accent mx-auto mb-8 md:mb-10" />
            <p className="pull-quote text-lg md:text-2xl leading-[1.5] text-[var(--color-text-primary)] mb-4 md:mb-6 whitespace-pre-line">
              {t.wearStory.quote}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto">
              {t.wearStory.text}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {layersWith.length > 0 && (
        <section className="px-4 md:px-12 pt-8 md:pt-16 pb-20 md:pb-32">
          <ScrollReveal>
            <div className="max-w-[1100px] mx-auto">
              <LayersWithRow products={layersWith} title={t.product.layersWith} />
            </div>
          </ScrollReveal>
        </section>
      )}
    </>
  );
}
