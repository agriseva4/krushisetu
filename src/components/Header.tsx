"use client";

import { useLanguage } from "@/lib/i18n";
import { Sprout } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[var(--paper)]/90 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-full bg-[var(--field-800)] flex items-center justify-center shrink-0">
            <Sprout size={18} className="text-[var(--mustard-400)]" aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-medium text-[var(--field-900)]">
            {t("brand")}
          </span>
        </Link>

        <div className="flex items-center gap-1 rounded-full border border-black/10 bg-[var(--paper-raised)] p-1 text-sm">
          <button
            onClick={() => setLang("mr")}
            aria-pressed={lang === "mr"}
            className={`px-3 py-1.5 rounded-full transition font-medium ${
              lang === "mr" ? "bg-[var(--field-800)] text-white" : "text-[var(--ink-soft)]"
            }`}
          >
            मराठी
          </button>
          <button
            onClick={() => setLang("en")}
            aria-pressed={lang === "en"}
            className={`px-3 py-1.5 rounded-full transition font-medium ${
              lang === "en" ? "bg-[var(--field-800)] text-white" : "text-[var(--ink-soft)]"
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
