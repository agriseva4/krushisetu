"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { supabase, Product, Category } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
import { categories as categoryConfig } from "@/lib/categories";
import { Loader2, PackageSearch } from "lucide-react";

function ProductsContent() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrored(false);

      const { data: cats } = await supabase.from("categories").select("*");
      if (!cancelled && cats) setDbCategories(cats);

      let query = supabase
        .from("products")
        .select("*, vendors(*), categories(*)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (activeCategory) {
        const cat = cats?.find((c) => c.slug === activeCategory);
        if (cat) query = query.eq("category_id", cat.id);
      }

      const { data, error } = await query;
      if (cancelled) return;

      if (error) {
        setErrored(true);
      } else {
        setProducts((data as Product[]) ?? []);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="font-display text-2xl sm:text-3xl font-medium text-[var(--field-900)] mb-5">
          {t("categoriesTitle")}
        </h1>

        {/* category filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <a
            href="/products"
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              !activeCategory
                ? "bg-[var(--field-800)] text-white border-[var(--field-800)]"
                : "border-black/10 text-[var(--ink-soft)] bg-[var(--paper-raised)]"
            }`}
          >
            {lang === "mr" ? "सर्व" : "All"}
          </a>
          {categoryConfig.map((cat) => (
            <a
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeCategory === cat.slug
                  ? "bg-[var(--field-800)] text-white border-[var(--field-800)]"
                  : "border-black/10 text-[var(--ink-soft)] bg-[var(--paper-raised)]"
              }`}
            >
              {t(cat.labelKey)}
            </a>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 text-[var(--ink-soft)] gap-2">
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            <span className="text-sm">{lang === "mr" ? "लोड होत आहे…" : "Loading…"}</span>
          </div>
        )}

        {!loading && errored && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
            <p className="text-sm text-[var(--ink-soft)]">
              {lang === "mr"
                ? "उत्पादने आणताना अडचण आली. थोड्या वेळाने पुन्हा प्रयत्न करा."
                : "Couldn't load products. Please try again shortly."}
            </p>
          </div>
        )}

        {!loading && !errored && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <PackageSearch size={32} className="text-[var(--ink-soft)]/50" aria-hidden="true" />
            <p className="text-sm text-[var(--ink-soft)] max-w-xs">
              {lang === "mr"
                ? "या प्रकारात अजून उत्पादने नाहीत. लवकरच नवीन विक्रेते जोडले जातील."
                : "No products in this category yet. New vendors are being added soon."}
            </p>
          </div>
        )}

        {!loading && !errored && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  );
}
