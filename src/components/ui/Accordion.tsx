"use client";

import { useState } from "react";

interface AccordionItem {
  title: string;
  content: string;
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-t border-[var(--color-border)]">
      {items.map((item, index) => (
        <div key={index} className="border-b border-[var(--color-border)]">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between py-4 text-left"
          >
            <span className="text-sm font-medium tracking-wide">{item.title}</span>
            <span className="text-lg text-[var(--color-text-tertiary)]">
              {openIndex === index ? "\u2212" : "+"}
            </span>
          </button>
          <div
            className="overflow-hidden transition-all duration-[var(--duration-base)]"
            style={{ maxHeight: openIndex === index ? "200px" : "0", opacity: openIndex === index ? 1 : 0 }}
          >
            <p className="pb-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
