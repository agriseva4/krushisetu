import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import WhatsAppFab from "@/components/WhatsAppFab";

export const metadata: Metadata = {
  title: "कृषीसेतू | KrushiSetu — शेतकरी आणि स्थानिक विक्रेते यांना जोडणारा सेतू",
  description:
    "पुणे जिल्ह्यातील शेतकऱ्यांसाठी खते, बियाणे, अवजारे स्थानिक विक्रेत्यांकडून थेट WhatsApp वर मिळवा. सरकारी योजनांची माहितीही एका ठिकाणी.",
  keywords: ["शेती", "खते", "कृषी", "farmer marketplace Maharashtra", "krishi", "agriculture Pune"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mr" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=Noto+Serif+Devanagari:wght@500;600&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {children}
          <WhatsAppFab />
        </LanguageProvider>
      </body>
    </html>
  );
}
