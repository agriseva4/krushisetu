"use client";

import { useLanguage } from "@/lib/i18n";

// KrishiMitra AI's WhatsApp Business number — replace with the live number before launch.
const KRISHIMITRA_WHATSAPP_NUMBER = "919999999999";

export default function WhatsAppFab() {
  const { lang } = useLanguage();
  const message =
    lang === "mr"
      ? "नमस्कार कृषीमित्र, मला माझ्या पिकाबद्दल मदत हवी आहे."
      : "Hello KrishiMitra, I need help with my crop.";

  const href = `https://wa.me/${KRISHIMITRA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={lang === "mr" ? "कृषीमित्र AI ला WhatsApp वर विचारा" : "Ask KrishiMitra AI on WhatsApp"}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[var(--whatsapp)] text-white shadow-lg shadow-black/15 px-4 py-3.5 hover:brightness-110 active:scale-95 transition"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.83 14.24c-.24.68-1.4 1.3-1.93 1.37-.5.08-1.1.11-1.78-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.15.11.32.02.51-.09.19-.14.31-.27.48-.14.17-.29.37-.41.5-.14.14-.28.29-.12.57.16.28.7 1.16 1.51 1.88 1.04.92 1.91 1.21 2.19 1.35.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.36-.23.61-.14.24.09 1.55.73 1.82.86.26.14.44.2.5.32.07.12.07.68-.17 1.36Z" />
      </svg>
      <span className="text-sm font-medium hidden sm:inline">
        {lang === "mr" ? "कृषीमित्र AI" : "KrishiMitra AI"}
      </span>
    </a>
  );
}
