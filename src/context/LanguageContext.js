import React, { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  en: {
    signIn: "Sign In",
    signUp: "Sign Up",
    subscribe: "Subscribe",
    topStories: "Top Stories",
    latestNews: "Latest News",
    category: "Category",
    page: "Page",
    back: "Back",
    videos: "Videos",
    videosDesc: "Market insights, analysis, and weekly highlights",
    companyUpdatesTitle: "Company Updates",
    companyUpdatesDesc: "Official announcements & platform updates.",
    categories: {
      all: "All",
      business: "Business",
      economy: "Economy",
      trade: "Trade",
      market: "Market",
      technology: "Technology",
    },
  },
  am: {
    signIn: "ግባ",
    signUp: "ተመዝገብ",
    subscribe: "ይመዝገቡ",
    topStories: "ዋና ዜናዎች",
    latestNews: "የቅርብ ጊዜ ዜና",
    category: "ምድብ",
    page: "ገጽ",
    back: "ተመለስ",
    videos: "ቪዲዮዎች",
    videosDesc: "የገበያ ትንታኔዎች፣ እይታዎች እና ሳምንታዊ ማጠቃለያዎች",
    companyUpdatesTitle: "የኩባንያ ማሻሻያዎች",
    companyUpdatesDesc: "የመድረኩ ይፋዊ መግለጫዎች እና ዝመናዎች።",
    categories: {
      all: "ሁሉም",
      business: "ንግድ",
      economy: "ኢኮኖሚ",
      trade: "ንግድ ስራ",
      market: "ገበያ",
      technology: "ቴክኖሎጂ",
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const t = useMemo(() => {
    return (key) => {
      const parts = key.split(".");
      let cur = translations[language];
      for (const p of parts) cur = cur?.[p];
      return cur ?? key;
    };
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      changeLanguage: setLanguage,
      t,
    }),
    [language, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
