"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  changeLanguage: (lng: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("lng") as Language | null;
      return saved === "en" ? "en" : "fr";
    } catch {
      return "fr";
    }
  });

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const changeLanguage = (lng: Language) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}