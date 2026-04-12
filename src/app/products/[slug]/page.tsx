"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { getProduct } from "@/data/products";
import { useI18n } from "@/i18n/context";
import ProductGallery from "@/components/product/ProductGallery";
import VariantSelector from "@/components/product/VariantSelector";
import AddToCartButton from "@/components/product/AddToCartButton";
import Accordion from "@/components/ui/Accordion";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ProductPage() {
  const params = useParams();
  const product = getProduct(params.slug as string);
  const { t } = useI18n();

  if (!product) notFound();

  const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0]);
  const [selectedLength, setSelectedLength] = useState(product.lengths[0]);

  const materialLabels: Record<string, string> = {
    Gold: t.product.gold,
    Silver: t.product.silver,
  };

  const accordionItems = [
    { title: t.product.materialsAndDimensions, content: t.product.materialsAndDimensionsContent },
    { title: t.product.care, content: t.product.careContent },
    { title: t.product.shippingLabel, content: t.product.shippingContent },
  ];

  return (
    <>
      <section className="py-4 md:py-16 px-4 md:px-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20">
          <ProductGallery images={product.images.gallery} />

          <div className="flex flex-col gap-6 md:gap-8 md:py-8 md:sticky md:top-24 md:self-start">
            <div>
              <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-2 md:mb-3">
                {t.product.label}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl font-light tracking-wide mb-1 md:mb-2">
                {t.product.name}
              </h1>
              <p className="text-base md:text-lg font-medium">€{product.price}</p>
            </div>

            <p className="text-sm text-[var(--color-text-secondary)] leading-[1.8]">
              {t.product.description}
            </p>

            <hr className="hr-accent" />

            <div className="flex flex-col gap-4 md:gap-5">
              <VariantSelector
                label={t.product.material}
                options={product.materials}
                selected={selectedMaterial}
                onSelect={setSelectedMaterial}
                displayLabels={materialLabels}
              />
              <VariantSelector
                label={t.product.length}
                options={product.lengths}
                selected={selectedLength}
                onSelect={setSelectedLength}
              />
            </div>

            <AddToCartButton
              product={product}
              selectedMaterial={selectedMaterial}
              selectedLength={selectedLength}
            />

            <Accordion items={accordionItems} />
          </div>
        </div>
      </section>

      <section className="mt-4 md:mt-16">
        <ScrollReveal>
          <div className="relative aspect-[4/3] md:aspect-[21/9] overflow-hidden">
            <Image
              src="/images/lifestyle.jpg"
              alt="Hand chain worn in everyday life"
              fill
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

      {/* ── Delicacy Note ── */}
      <section className="bg-[var(--color-bg-secondary)] py-16 md:py-28 px-6">
        <ScrollReveal>
          <div className="max-w-[640px] mx-auto text-center">
            <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-[var(--color-text-tertiary)] mb-4 md:mb-6">
              {t.delicacy.label}
            </p>
            <h3 className="font-heading text-xl md:text-3xl font-light tracking-wide mb-4 md:mb-6">
              {t.delicacy.title}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-[1.8] max-w-md mx-auto">
              {t.delicacy.text}
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section className="px-4 md:px-0 pb-16 md:pb-32 pt-8 md:pt-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 gap-1 md:gap-2">
          <ScrollReveal>
            <div className="relative aspect-square overflow-hidden">
              <Image src="/images/detail.jpg" alt="Detail" fill className="object-cover" sizes="50vw" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="relative aspect-square overflow-hidden">
              <Image src="/images/intimate.jpg" alt="Detail" fill className="object-cover" sizes="50vw" />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
