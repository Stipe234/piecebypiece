"use client";

interface VariantSelectorProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  displayLabels?: Record<string, string>;
}

export default function VariantSelector({ label, options, selected, onSelect, displayLabels }: VariantSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-[var(--color-text-tertiary)] tracking-wide">{label}</span>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`px-4 py-2 text-sm border transition-colors duration-[var(--duration-fast)] rounded-sm ${
              selected === option
                ? "bg-[var(--color-accent-dark)] text-[var(--color-text-inverse)] border-[var(--color-accent-dark)]"
                : "bg-transparent text-[var(--color-text-primary)] border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]"
            }`}
          >
            {displayLabels?.[option] ?? option}
          </button>
        ))}
      </div>
    </div>
  );
}
