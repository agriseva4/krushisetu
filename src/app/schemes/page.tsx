"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { ExternalLink, Landmark, Loader2 } from "lucide-react";

type SchemeRow = {
  id: string;
  title_mr: string;
  title_en: string;
  summary_mr: string;
  summary_en: string;
  eligibility_mr: string;
  eligibility_en: string;
  official_url: string;
};

export default function SchemesPage() {
  const { lang } = useLanguage();
  const [schemes, setSchemes] = useState<SchemeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("schemes")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setSchemes((data as SchemeRow[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-8">
          <span className="w-11 h-11 rounded-2xl bg-[var(--field-800)] flex items-center justify-center mb-4">
            <Landmark size={19} className="text-[var(--mustard-400)]" aria-hidden="true" />
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-[var(--field-900)]">
            {lang === "mr" ? "सरकारी योजना" : "Government Schemes"}
          </h1>
          <p className="text-sm text-[var(--ink-soft)] mt-2 max-w-xl leading-relaxed">
            {lang === "mr"
              ? "केंद्र सरकारच्या मुख्य शेतकरी योजना. अर्ज करण्यापूर्वी नेहमी अधिकृत वेबसाइटवर सद्यस्थिती तपासा — अटी वेळोवेळी बदलू शकतात."
              : "Key central government schemes for farmers. Always check the official site before applying — rules can change over time."}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 text-[var(--ink-soft)] gap-2">
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            <span className="text-sm">{lang === "mr" ? "लोड होत आहे…" : "Loading…"}</span>
          </div>
        )}

        {!loading && (
          <div className="flex flex-col gap-3">
            {schemes.map((s) => (
              <div
                key={s.id}
                className="rounded-[var(--radius-card)] bg-[var(--paper-raised)] border border-black/5 p-4 sm:p-5 flex gap-4"
              >
                <span className="w-10 h-10 rounded-xl bg-[var(--field-50)] flex items-center justify-center shrink-0">
                  <Landmark size={18} className="text-[var(--field-700)]" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-base sm:text-lg font-medium text-[var(--ink)]">
                    {lang === "mr" ? s.title_mr : s.title_en}
                  </h2>
                  <p className="text-sm text-[var(--ink-soft)] mt-1.5 leading-relaxed">
                    {lang === "mr" ? s.summary_mr : s.summary_en}
                  </p>
                  <p className="text-xs text-[var(--field-700)] mt-2 font-medium">
                    {lang === "mr" ? "पात्रता: " : "Eligibility: "}
                    <span className="text-[var(--ink-soft)] font-normal">
                      {lang === "mr" ? s.eligibility_mr : s.eligibility_en}
                    </span>
                  </p>
                  <a
                    href={s.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--field-800)] mt-3 hover:underline"
                  >
                    {lang === "mr" ? "अधिकृत वेबसाइटवर जा" : "Visit official website"}
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
