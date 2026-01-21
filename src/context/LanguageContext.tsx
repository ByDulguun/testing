// LanguageContext.tsx
"use client";

import { createContext, useEffect, useState } from "react";
import i18n from "i18next";
import { initI18n } from "../../i18n";

type LanguageContextType = {
  language: string;
  changeLanguage: (lang: string) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: "en", // ⬅️ DEFAULT
  changeLanguage: () => {}, // ⬅️ SAFE NO-OP
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initI18n();
    const stored = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(stored).then(() => {
      setLanguage(stored);
      setReady(true);
    });
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      localStorage.setItem("lang", lang);
      setLanguage(lang);
    });
  };

  if (!ready) return null; // ⬅️ IMPORTANT

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
