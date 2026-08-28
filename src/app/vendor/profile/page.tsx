"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { supabase, Vendor, Product } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
import { Loader2, MapPin, MessageCircle, Store } from "lucide-react";
import Link from "next/link";

function VendorProfileContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { lang } = useLanguage();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data: v, error } = await supabase.from("vendors").select("*").eq("id", id).single();
      if (cancelled) return;

      if (error || !v) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setVendor(v as Vendor);

      const { data: p } = await supabase
        .from("products")
        .select("*, vendors(*), categories(*)")
        .eq("vendor_id", id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!cancelled) setProducts((p as Product[]) ?? []);
      setLoading(false);
    }

    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const whatsappHref = vendor
    ? `https://wa.me/${vendor.whatsapp_number}?text=${encodeURIComponent(
        lang === "mr"
          ? `नमस्कार ${vendor.company_name}, मला तुमच्या उत्पादनांबद्दल माहिती हवी आहे.`
          : `Hello ${vendor.company_name}, I'd like to know more about your products.`
      )}`
    : "#";

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        {loading && (
          <div className="flex items-center justify-center py-24 text-[var(--ink-soft)] gap-2">
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            <span className="text-sm">{lang === "mr" ? "लोड होत आहे…" : "Loading…"}</span>
          </div>
        )}

        {!loading && notFound && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <p className="text-sm text-[var(--ink-soft)]">
              {lang === "mr" ? "हा विक्रेता सापडला नाही." : "This vendor could not be found."}
            </p>
            <Link href="/products" className="text-sm text-[var(--field-800)] font-medium underline">
              {lang === "mr" ? "सर्व उत्पादने बघा" : "Browse all products"}
            </Link>
          </div>
        )}

        {!loading && vendor && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between rise-in">
              <div className="flex items-center gap-4">
                <span className="w-16 h-16 rounded-2xl bg-[var(--field-100)] flex items-center justify-center shrink-0 overflow-hidden">
                  {vendor.profile_photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={vendor.profile_photo_url}
                      alt={vendor.company_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store size={26} className="text-[var(--field-800)]" aria-hidden="true" />
                  )}
                </span>
                <div>
                  <h1 className="font-display text-xl sm:text-2xl font-medium text-[var(--ink)]">
                    {vendor.company_name}
                  </h1>
                  {vendor.village && (
                    <p className="text-sm text-[var(--ink-soft)] flex items-center gap-1 mt-1">
                      <MapPin size={14} aria-hidden="true" />
                      {vendor.village}
                      {vendor.district ? `, ${vendor.district}` : ""}
                    </p>
                  )}
                </div>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[var(--whatsapp)] text-white font-medium px-5 py-3 rounded-[var(--radius-pill)] hover:brightness-110 transition shrink-0"
              >
                <MessageCircle size={17} aria-hidden="true" />
                {lang === "mr" ? "WhatsApp करा" : "WhatsApp"}
              </a>
            </div>

            {vendor.description && (
              <p className="text-sm text-[var(--ink-soft)] mt-5 max-w-2xl leading-relaxed">
                {vendor.description}
              </p>
            )}

            <h2 className="font-display text-lg font-medium text-[var(--field-900)] mt-10 mb-4">
              {lang === "mr" ? "आमची उत्पादने" : "Our products"}
            </h2>

            {products.length === 0 ? (
              <p className="text-sm text-[var(--ink-soft)]">
                {lang === "mr" ? "अजून उत्पादने जोडलेली नाहीत." : "No products added yet."}
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default function VendorProfilePage() {
  return (
    <Suspense fallback={null}>
      <VendorProfileContent />
    </Suspense>
  );
}
