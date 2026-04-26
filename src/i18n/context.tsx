"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type Locale } from "./translations";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DeepString<T> = T extends readonly any[] ? { [K in keyof T]: DeepString<T[K]> } : T extends object ? { [K in keyof T]: DeepString<T[K]> } : string;

type TranslationShape = DeepString<(typeof translations)["en"]>;

interface I18nContextType {
  locale: Locale;
  t: TranslationShape;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pbp-locale") as Locale;
      if (saved === "en" || saved === "hr") return saved;
    }
    return "en";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("pbp-locale", l);
    }
  }, []);

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
