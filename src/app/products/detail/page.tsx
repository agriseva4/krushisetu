"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { supabase, Product } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
import { Loader2, MapPin, MessageCircle, Package, Store } from "lucide-react";
import Link from "next/link";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { lang, t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*, vendors(*), categories(*)")
        .eq("id", id)
        .single();

      if (cancelled) return;
      if (error || !data) {
        setNotFound(true);
      } else {
        setProduct(data as Product);
      }
      setLoading(false);
    }

    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const priceLabel =
    product?.price_min && product?.price_max
      ? `₹${product.price_min.toLocaleString("en-IN")} – ${product.price_max.toLocaleString("en-IN")}`
      : product?.price_min
        ? `₹${product.price_min.toLocaleString("en-IN")}`
        : lang === "mr"
          ? "किंमत विचारण्यासाठी संपर्क करा"
          : "Contact for price";

  const vendor = product?.vendors;
  const whatsappMessage =
    lang === "mr"
      ? `नमस्कार, मला "${product?.name}" या उत्पादनाबद्दल माहिती हवी आहे.`
      : `Hello, I'd like to know more about "${product?.name}".`;
  const whatsappHref = vendor
    ? `https://wa.me/${vendor.whatsapp_number}?text=${encodeURIComponent(whatsappMessage)}`
    : "#";

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        {loading && (
          <div className="flex items-center justify-center py-24 text-[var(--ink-soft)] gap-2">
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            <span className="text-sm">{lang === "mr" ? "लोड होत आहे…" : "Loading…"}</span>
          </div>
        )}

        {!loading && notFound && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <p className="text-sm text-[var(--ink-soft)]">
              {lang === "mr" ? "हे उत्पादन सापडले नाही." : "This product could not be found."}
            </p>
            <Link href="/products" className="text-sm text-[var(--field-800)] font-medium underline">
              {lang === "mr" ? "सर्व उत्पादने बघा" : "Browse all products"}
            </Link>
          </div>
        )}

        {!loading && product && (
          <div className="rise-in">
            <div className="aspect-[4/3] bg-[var(--field-50)] rounded-[var(--radius-card)] flex items-center justify-center overflow-hidden mb-5">
              {product.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.cover_image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package size={40} className="text-[var(--field-700)]/40" aria-hidden="true" />
              )}
            </div>

            <h1 className="font-display text-2xl font-medium text-[var(--ink)]">{product.name}</h1>
            {product.description && (
              <p className="text-sm text-[var(--ink-soft)] mt-2 leading-relaxed">
                {product.description}
              </p>
            )}
            <p className="text-xl font-medium text-[var(--field-800)] mt-4">{priceLabel}</p>

            {vendor && (
              <div className="mt-6 border-t border-black/5 pt-5">
                <Link
                  href={`/vendor/profile?id=${vendor.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition"
                >
                  <span className="w-11 h-11 rounded-full bg-[var(--field-100)] flex items-center justify-center shrink-0">
                    <Store size={19} className="text-[var(--field-800)]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--ink)]">{vendor.company_name}</p>
                    {vendor.village && (
                      <p className="text-xs text-[var(--ink-soft)] flex items-center gap-1 mt-0.5">
                        <MapPin size={12} aria-hidden="true" />
                        {vendor.village}
                      </p>
                    )}
                  </div>
                </Link>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[var(--whatsapp)] text-white font-medium py-3.5 rounded-[var(--radius-pill)] hover:brightness-110 transition"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  {lang === "mr" ? "विक्रेत्याला WhatsApp करा" : "WhatsApp the vendor"}
                </a>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={null}>
      <ProductDetailContent />
    </Suspense>
  );
}
