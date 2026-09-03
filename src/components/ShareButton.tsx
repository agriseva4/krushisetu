"use client";

import { Share2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function ShareButton({ text, url }: { text: string; url: string }) {
  const { lang } = useLanguage();
  const fullMessage = `${text}\n${url}`;
  const shareHref = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;

  return (
    <a
      href={shareHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 text-sm font-medium text-[var(--field-800)] border border-black/10 rounded-[var(--radius-pill)] px-4 py-2.5 hover:bg-[var(--field-50)] transition"
    >
      <Share2 size={15} aria-hidden="true" />
      {lang === "mr" ? "मित्राला शेअर करा" : "Share with a friend"}
    </a>
  );
}
