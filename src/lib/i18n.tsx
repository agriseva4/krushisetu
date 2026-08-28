"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "mr" | "en";

const dict = {
  brand: { mr: "कृषीसेतू", en: "KrushiSetu" },
  tagline: {
    mr: "शेतकरी आणि स्थानिक विक्रेते यांना जोडणारा सेतू",
    en: "The bridge between farmers and local vendors",
  },
  heroTitle: {
    mr: "तुमच्या गावाजवळचे खते, बियाणे आणि अवजारे — एका क्लिकवर",
    en: "Fertilizer, seeds and equipment from vendors near your village",
  },
  heroSub: {
    mr: "उत्पादन बघा, विक्रेत्याचा नंबर मिळवा आणि थेट WhatsApp वर बोला — कुठलीही ऑनलाइन पेमेंटची गरज नाही.",
    en: "Browse products, get the vendor's number, and talk directly on WhatsApp — no online payment needed.",
  },
  browseCta: { mr: "उत्पादने बघा", en: "Browse products" },
  askAiCta: { mr: "कृषीमित्र AI ला विचारा", en: "Ask KrishiMitra AI" },
  categoriesTitle: { mr: "प्रकार निवडा", en: "Choose a category" },
  catFertilizer: { mr: "खते", en: "Fertilizer" },
  catEquipment: { mr: "अवजारे", en: "Equipment" },
  catSeeds: { mr: "बियाणे", en: "Seeds" },
  catPesticide: { mr: "कीटकनाशक", en: "Pesticide" },
  vendorsNear: { mr: "तुमच्या जवळचे विक्रेते", en: "Vendors near you" },
  products: { mr: "उत्पादने", en: "products" },
  contact: { mr: "संपर्क करा", en: "Contact" },
  howTitle: { mr: "हे कसं चालतं", en: "How it works" },
  how1Title: { mr: "उत्पादन शोधा", en: "Find a product" },
  how1Body: {
    mr: "प्रकारानुसार उत्पादने बघा — किंमत, फोटो आणि वर्णन सगळं एका ठिकाणी.",
    en: "Browse by category — price, photos and description all in one place.",
  },
  how2Title: { mr: "विक्रेता बघा", en: "See the vendor" },
  how2Body: {
    mr: "प्रत्येक उत्पादनामागे खरा स्थानिक विक्रेता — नाव, गाव आणि नंबरसह.",
    en: "Every product is listed by a real local vendor — name, village and number included.",
  },
  how3Title: { mr: "WhatsApp वर बोला", en: "Talk on WhatsApp" },
  how3Body: {
    mr: "एका टॅपवर थेट विक्रेत्याशी WhatsApp वर बोलणी करा आणि सौदा ठरवा.",
    en: "One tap opens WhatsApp with the vendor so you can settle the deal directly.",
  },
  vendorCtaTitle: { mr: "तुमचं दुकान आहे का?", en: "Have a shop of your own?" },
  vendorCtaBody: {
    mr: "तुमची उत्पादनं हजारो शेतकऱ्यांपर्यंत पोहोचवा — मोफत नोंदणी करा.",
    en: "Get your products in front of thousands of farmers — register for free.",
  },
  vendorCtaButton: { mr: "विक्रेता म्हणून नोंदणी करा", en: "Register as a vendor" },
  footerNote: {
    mr: "कृषीसेतू — पुणे जिल्ह्यातील शेतकऱ्यांसाठी",
    en: "KrushiSetu — built for farmers in Pune district",
  },
} as const;

export type DictKey = keyof typeof dict;

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
}>({
  lang: "mr",
  setLang: () => {},
  t: (key) => dict[key].mr,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("mr");
  const t = (key: DictKey) => dict[key][lang];
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
