"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en/translation.json";
import mn from "@/locales/mn/translation.json";
import ru from "@/locales/ru/translation.json";
import kk from "@/locales/kk/translation.json";

let initialized = false;

export function initI18n() {
  if (initialized) return i18n;

  const storedLang = localStorage.getItem("lang") || "en";

  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      mn: { translation: mn },
      ru: { translation: ru },
      kk: { translation: kk },
    },
    lng: storedLang,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  initialized = true;
  return i18n;
}
