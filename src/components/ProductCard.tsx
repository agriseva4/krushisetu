"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { Product } from "@/lib/supabase";
import { Package } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLanguage();
  const vendor = product.vendors;

  const priceLabel =
    product.price_min && product.price_max
      ? `₹${product.price_min.toLocaleString("en-IN")} – ${product.price_max.toLocaleString("en-IN")}`
      : product.price_min
        ? `₹${product.price_min.toLocaleString("en-IN")}`
        : lang === "mr"
          ? "किंमत विचारा"
          : "Ask for price";

  return (
    <Link
      href={`/products/detail?id=${product.id}`}
      className="group rounded-[var(--radius-card)] bg-[var(--paper-raised)] border border-black/5 overflow-hidden hover:-translate-y-0.5 hover:border-black/10 transition flex flex-col"
    >
      <div className="aspect-[4/3] bg-[var(--field-50)] flex items-center justify-center overflow-hidden">
        {product.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.cover_image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition"
          />
        ) : (
          <Package size={28} className="text-[var(--field-700)]/40" aria-hidden="true" />
        )}
      </div>
      <div className="p-3.5 flex flex-col gap-1.5">
        <p className="text-sm font-medium text-[var(--ink)] line-clamp-1">{product.name}</p>
        {vendor && (
          <p className="text-xs text-[var(--ink-soft)] line-clamp-1">
            {vendor.company_name}
            {vendor.village ? ` · ${vendor.village}` : ""}
          </p>
        )}
        <p className="text-sm font-medium text-[var(--field-800)] mt-1">{priceLabel}</p>
      </div>
    </Link>
  );
}
