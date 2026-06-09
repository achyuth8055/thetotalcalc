"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LANGUAGE, getLanguage, LANGUAGES } from "@/lib/languages";
import { translate, type Lang } from "@/lib/i18n";

const KEY = "preferredLanguage";

interface LanguageContextValue {
  lang: string;
  setLang: (code: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANGUAGE,
  setLang: () => {},
  t: (key: string) => translate(key, DEFAULT_LANGUAGE as Lang),
});

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Convenience hook returning just the translate function. */
export function useT() {
  return useContext(LanguageContext).t;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) setLangState(stored);
  }, []);

  // Reflect language + direction on <html> for RTL support.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const l = getLanguage(lang);
    document.documentElement.lang = l.code;
    document.documentElement.dir = l.rtl ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (code: string) => {
    setLangState(code);
    if (typeof window !== "undefined") window.localStorage.setItem(KEY, code);
  };

  const t = (key: string) => translate(key, lang as Lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}
