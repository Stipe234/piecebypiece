"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/context";

export default function AnnouncementBar() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("announcement-dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("announcement-dismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="bg-[var(--color-text-primary)] text-[var(--color-text-inverse)] text-center text-xs tracking-[0.1em] uppercase py-2.5 px-4 relative">
      <span>{t.announcement}</span>
      <button
        onClick={dismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-inverse)] hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}
