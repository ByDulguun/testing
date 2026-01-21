"use client";
import i18n from "../../i18n";
import { createContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
  language: string;
  changeLanguage: (lng: string) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  changeLanguage: () => {},
});

interface Props {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: Props) => {
  const [language, setLanguage] = useState<string>(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
