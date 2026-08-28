import type { LucideIcon } from "lucide-react";
import { Banknote, ShieldCheck, CreditCard, FlaskConical, Droplets } from "lucide-react";

export type Scheme = {
  slug: string;
  icon: LucideIcon;
  titleMr: string;
  titleEn: string;
  summaryMr: string;
  summaryEn: string;
  eligibilityMr: string;
  eligibilityEn: string;
  officialUrl: string;
};

// Central government schemes only. Figures/eligibility sourced from official
// portals — always verify on the official site before applying, as rules can change.
export const schemes: Scheme[] = [
  {
    slug: "pm-kisan",
    icon: Banknote,
    titleMr: "पीएम-किसान सन्मान निधी",
    titleEn: "PM-KISAN Samman Nidhi",
    summaryMr: "पात्र शेतकरी कुटुंबांना दरवर्षी ₹6,000 (3 हप्त्यांत) थेट बँक खात्यात मिळतात.",
    summaryEn: "Eligible farmer families receive ₹6,000/year (in 3 installments) direct to their bank account.",
    eligibilityMr: "जमीनधारक शेतकरी कुटुंब. Aadhaar व जमिनीच्या कागदपत्रांसह नोंदणी आवश्यक.",
    eligibilityEn: "Landholding farmer families. Requires Aadhaar and land record registration.",
    officialUrl: "https://pmkisan.gov.in",
  },
  {
    slug: "pmfby",
    icon: ShieldCheck,
    titleMr: "पंतप्रधान पीक विमा योजना (PMFBY)",
    titleEn: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    summaryMr: "दुष्काळ, पूर, कीड-रोग यामुळे पिकाचे नुकसान झाल्यास विमा संरक्षण मिळते.",
    summaryEn: "Crop insurance covering losses from drought, flood, pests, and disease.",
    eligibilityMr: "अधिसूचित पिके घेणारे सर्व शेतकरी (भाडेकरू/वाटेकरी शेतकरीही पात्र).",
    eligibilityEn: "All farmers growing notified crops (including tenant and sharecropper farmers).",
    officialUrl: "https://pmfby.gov.in",
  },
  {
    slug: "kcc",
    icon: CreditCard,
    titleMr: "किसान क्रेडिट कार्ड (KCC)",
    titleEn: "Kisan Credit Card (KCC)",
    summaryMr: "बियाणे, खते, औजारांसाठी ₹3 लाखांपर्यंत कमी व्याजाने (सुमारे 4%) कर्ज.",
    summaryEn: "Low-interest credit (~4% effective) up to ₹3 lakh for seeds, fertilizer, and equipment.",
    eligibilityMr: "जमीनधारक शेतकरी; PM-KISAN लाभार्थ्यांना जलद मंजुरी मिळते.",
    eligibilityEn: "Landholding farmers; PM-KISAN beneficiaries get faster approval.",
    officialUrl: "https://www.myscheme.gov.in/schemes/kcc",
  },
  {
    slug: "soil-health-card",
    icon: FlaskConical,
    titleMr: "मृदा आरोग्य पत्रिका (Soil Health Card)",
    titleEn: "Soil Health Card Scheme",
    summaryMr: "दर 2 वर्षांनी मोफत माती परीक्षण व पिकानुसार खत शिफारस.",
    summaryEn: "Free soil testing every 2 years with crop-specific fertilizer recommendations.",
    eligibilityMr: "शेतीयोग्य जमीन असलेला कोणताही शेतकरी — जमिनीच्या आकाराची अट नाही.",
    eligibilityEn: "Any farmer with cultivable land — no minimum landholding size required.",
    officialUrl: "https://soilhealth.dac.gov.in",
  },
  {
    slug: "pmksy",
    icon: Droplets,
    titleMr: "पंतप्रधान कृषी सिंचन योजना (PMKSY)",
    titleEn: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    summaryMr: "ठिबक व तुषार सिंचनासाठी अनुदान — पाण्याचा कार्यक्षम वापर करण्यासाठी.",
    summaryEn: "Subsidy for drip and sprinkler irrigation to improve water-use efficiency.",
    eligibilityMr: "सिंचन सुविधा उभारू इच्छिणारे सर्व शेतकरी.",
    eligibilityEn: "All farmers looking to set up micro-irrigation infrastructure.",
    officialUrl: "https://pmksy.gov.in",
  },
];
