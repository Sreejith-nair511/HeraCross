"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "hi" | "kn"

interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    dashboard: "Dashboard",
    aiModels: "AI Models",
    wasteClassifier: "Waste Classifier",
    industrialExchange: "Industrial Exchange",
    cctvAudit: "CCTV Audit",
    municipalInsights: "Municipal Insights",
    aiChat: "AI Chat",
    settings: "Settings",
    documentation: "Documentation",
    language: "Language",
    theme: "Theme",
    accessibility: "Accessibility",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    fontSize: "Font Size",
    contrast: "Contrast",
    accentColor: "Accent Color",
    userProfile: "User Profile",
    notifications: "Notifications",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    aiModels: "एआई मॉडल",
    wasteClassifier: "कचरा वर्गीकरण",
    industrialExchange: "औद्योगिक विनिमय",
    cctvAudit: "सीसीटीवी ऑडिट",
    municipalInsights: "नगरपालिका अंतर्दृष्टि",
    aiChat: "एआई चैट",
    settings: "सेटिंग्स",
    documentation: "दस्तावेज़",
    language: "भाषा",
    theme: "थीम",
    accessibility: "पहुंच",
    darkMode: "डार्क मोड",
    lightMode: "लाइट मोड",
    fontSize: "फ़ॉन्ट आकार",
    contrast: "कंट्रास्ट",
    accentColor: "एक्सेंट रंग",
    userProfile: "उपयोगकर्ता प्रोफ़ाइल",
    notifications: "सूचनाएं",
    save: "सहेजें",
    cancel: "रद्द करें",
    search: "खोज",
  },
  kn: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    aiModels: "ಎಐ ಮಾದರಿಗಳು",
    wasteClassifier: "ತ್ಯಾಜ್ಯ ವರ್ಗೀಕರಣ",
    industrialExchange: "ಕೈಗಾರಿಕ ವಿನಿಮಯ",
    cctvAudit: "ಸಿಸಿಟಿವಿ ಆಡಿಟ್",
    municipalInsights: "ಪುರಸಭೆ ಒಳನೋಟಗಳು",
    aiChat: "ಎಐ ಚ್ಯಾಟ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    documentation: "ದಸ್ತಾವೇಜೀಕರಣ",
    language: "ಭಾಷೆ",
    theme: "ಥೀಮ್",
    accessibility: "ಪ್ರವೇಶಾಧಿಕಾರ",
    darkMode: "ಡಾರ್ಕ್ ಮೋಡ್",
    lightMode: "ಲೈಟ್ ಮೋಡ್",
    fontSize: "ಫಾಂಟ್ ಗಾತ್ರ",
    contrast: "ವೈಪರೀತ್ಯ",
    accentColor: "ಆಕ್ಸೆಂಟ್ ಬಣ್ಣ",
    userProfile: "ಬಳಕೆದಾರ ಪ್ರೊಫೈಲ್",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    save: "ಉಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    search: "ಹುಡುಕು",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("language") as Language | null
    if (saved && ["en", "hi", "kn"].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
