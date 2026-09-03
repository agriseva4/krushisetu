"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/i18n";
import { categories } from "@/lib/categories";
import { supabase, Vendor } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Landmark, MapPin, MessageCircle, Search, Store, PhoneCall } from "lucide-react";

export default function Home() {
  const { lang, t } = useLanguage();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoaded, setVendorsLoaded] = useState(false);
  const [counts, setCounts] = useState<{ vendors: number; products: number } | null>(null);

  useEffect(() => {
    supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setVendors((data as Vendor[]) ?? []);
        setVendorsLoaded(true);
      });

    Promise.all([
      supabase.from("vendors").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    ]).then(([vendorRes, productRes]) => {
      setCounts({ vendors: vendorRes.count ?? 0, products: productRes.count ?? 0 });
    });
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[var(--field-900)] text-white">
          <div className="absolute inset-0 furrow-rows" aria-hidden="true" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
            <p className="rise-in inline-block text-xs sm:text-sm font-medium tracking-wide uppercase text-[var(--mustard-400)] bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-5">
              {t("tagline")}
            </p>
            <h1 className="rise-in font-display text-3xl sm:text-5xl leading-tight font-medium max-w-2xl">
              {t("heroTitle")}
            </h1>
            <p className="rise-in mt-5 text-white/75 max-w-xl text-[15px] sm:text-base leading-relaxed">
              {t("heroSub")}
            </p>
            {counts && (counts.vendors > 0 || counts.products > 0) && (
              <p className="rise-in mt-4 text-sm text-[var(--mustard-400)] font-medium">
                {lang === "mr"
                  ? `${counts.vendors} विक्रेते · ${counts.products} उत्पादने सध्या उपलब्ध`
                  : `${counts.vendors} vendors · ${counts.products} products currently listed`}
              </p>
            )}
            <div className="rise-in mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[var(--mustard-500)] text-[var(--field-950)] font-medium px-5 py-3 rounded-[var(--radius-pill)] hover:bg-[var(--mustard-400)] transition"
              >
                <Search size={17} aria-hidden="true" />
                {t("browseCta")}
              </Link>
              <Link
                href="/schemes"
                className="inline-flex items-center gap-2 border border-white/25 text-white font-medium px-5 py-3 rounded-[var(--radius-pill)] hover:bg-white/10 transition"
              >
                <Landmark size={17} aria-hidden="true" />
                {lang === "mr" ? "सरकारी योजना" : "Govt Schemes"}
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="font-display text-xl sm:text-2xl font-medium text-[var(--field-900)] mb-6">
            {t("categoriesTitle")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="group rounded-[var(--radius-card)] border border-black/5 bg-[var(--paper-raised)] p-4 sm:p-5 flex flex-col items-start gap-3 hover:border-black/10 hover:-translate-y-0.5 transition"
                >
                  <span
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: cat.bg }}
                  >
                    <Icon size={20} style={{ color: cat.color }} aria-hidden="true" />
                  </span>
                  <span className="text-sm sm:text-[15px] font-medium text-[var(--ink)]">
                    {t(cat.labelKey)}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Vendors near you */}
        {vendorsLoaded && vendors.length > 0 && (
          <section className="bg-[var(--field-50)] py-12 sm:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="font-display text-xl sm:text-2xl font-medium text-[var(--field-900)] mb-6">
                {t("vendorsNear")}
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {vendors.map((v) => (
                  <Link
                    href={`/vendor/profile?id=${v.id}`}
                    key={v.id}
                    className="rounded-[var(--radius-card)] bg-[var(--paper-raised)] border border-black/5 p-4 flex flex-col gap-3 hover:-translate-y-0.5 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-xl bg-[var(--field-100)] flex items-center justify-center shrink-0 overflow-hidden">
                        {v.profile_photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={v.profile_photo_url} alt={v.company_name} className="w-full h-full object-cover" />
                        ) : (
                          <Store size={19} className="text-[var(--field-800)]" aria-hidden="true" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate flex items-center gap-1">
                          {v.company_name}
                          {v.is_verified && (
                            <BadgeCheck size={14} className="text-[var(--field-700)] shrink-0" aria-hidden="true" />
                          )}
                        </p>
                        {v.village && (
                          <p className="text-xs text-[var(--ink-soft)] flex items-center gap-1 mt-0.5">
                            <MapPin size={12} aria-hidden="true" />
                            {v.village}
                          </p>
                        )}
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${v.whatsapp_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 inline-flex items-center justify-center gap-2 text-sm font-medium rounded-full bg-[var(--whatsapp-bg)] text-[var(--whatsapp)] py-2 hover:brightness-95 transition"
                    >
                      <MessageCircle size={15} aria-hidden="true" />
                      {t("contact")}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        <section id="how" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="font-display text-xl sm:text-2xl font-medium text-[var(--field-900)] mb-8">
            {t("howTitle")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Search, titleKey: "how1Title", bodyKey: "how1Body" },
              { icon: Store, titleKey: "how2Title", bodyKey: "how2Body" },
              { icon: PhoneCall, titleKey: "how3Title", bodyKey: "how3Body" },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex flex-col gap-3">
                  <span className="w-10 h-10 rounded-full bg-[var(--field-800)] text-[var(--mustard-400)] flex items-center justify-center">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-medium text-[var(--field-900)]">
                    {t(step.titleKey as never)}
                  </h3>
                  <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                    {t(step.bodyKey as never)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Vendor CTA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="rounded-[var(--radius-card)] bg-[var(--clay-100)] px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h3 className="font-display text-xl font-medium text-[var(--clay-700)]">
                {t("vendorCtaTitle")}
              </h3>
              <p className="text-sm text-[var(--ink-soft)] mt-1.5 max-w-md">{t("vendorCtaBody")}</p>
            </div>
            <Link
              href="/vendor/login"
              className="inline-flex items-center justify-center gap-2 bg-[var(--clay-700)] text-white font-medium px-5 py-3 rounded-[var(--radius-pill)] hover:brightness-110 transition shrink-0"
            >
              {t("vendorCtaButton")}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 py-6">
        <p className="text-center text-xs text-[var(--ink-soft)]">{t("footerNote")}</p>
      </footer>
    </>
  );
}
