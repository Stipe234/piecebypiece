import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export default function Button({ variant = "primary", fullWidth, className = "", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center text-sm font-medium tracking-[0.1em] uppercase py-3.5 px-8 transition-colors duration-[var(--duration-base)] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[var(--color-accent-dark)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]",
    secondary: "bg-transparent border border-[var(--color-border-dark)] text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-text-inverse)]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
