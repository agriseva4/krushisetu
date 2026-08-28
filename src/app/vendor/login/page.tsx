"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
import { Loader2, Phone, ShieldCheck } from "lucide-react";

export default function VendorLoginPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullPhone = `+91${phone.replace(/\D/g, "")}`;

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (phone.replace(/\D/g, "").length !== 10) {
      setError(lang === "mr" ? "10 अंकी मोबाईल नंबर टाका." : "Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) {
      setError(
        lang === "mr"
          ? "OTP पाठवता आला नाही. थोड्या वेळाने पुन्हा प्रयत्न करा."
          : "Couldn't send the OTP. Please try again shortly."
      );
      return;
    }
    setStep("otp");
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError(lang === "mr" ? "6 अंकी कोड टाका." : "Enter the 6-digit code.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) {
      setError(lang === "mr" ? "चुकीचा कोड. पुन्हा प्रयत्न करा." : "Incorrect code. Please try again.");
      return;
    }
    router.push("/vendor/dashboard");
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-sm mx-auto w-full px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <span className="w-12 h-12 rounded-2xl bg-[var(--field-800)] flex items-center justify-center mx-auto mb-4">
            {step === "phone" ? (
              <Phone size={20} className="text-[var(--mustard-400)]" aria-hidden="true" />
            ) : (
              <ShieldCheck size={20} className="text-[var(--mustard-400)]" aria-hidden="true" />
            )}
          </span>
          <h1 className="font-display text-xl font-medium text-[var(--field-900)]">
            {lang === "mr" ? "विक्रेता लॉगिन" : "Vendor Login"}
          </h1>
          <p className="text-sm text-[var(--ink-soft)] mt-1.5">
            {step === "phone"
              ? lang === "mr"
                ? "तुमचा मोबाईल नंबर टाका, आम्ही OTP पाठवू."
                : "Enter your mobile number, we'll send an OTP."
              : lang === "mr"
                ? `${fullPhone} वर पाठवलेला 6 अंकी कोड टाका.`
                : `Enter the 6-digit code sent to ${fullPhone}.`}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={sendOtp} className="flex flex-col gap-3">
            <div className="flex items-center rounded-[var(--radius-card)] border border-black/10 bg-[var(--paper-raised)] overflow-hidden">
              <span className="px-3.5 text-sm text-[var(--ink-soft)] border-r border-black/10 py-3.5">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="98765 43210"
                className="flex-1 px-3.5 py-3.5 text-sm bg-transparent outline-none"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-[var(--clay-700)]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-[var(--field-800)] text-white font-medium py-3.5 rounded-[var(--radius-pill)] hover:brightness-110 transition disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
              {lang === "mr" ? "OTP पाठवा" : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="flex flex-col gap-3">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              className="text-center tracking-[0.5em] text-lg px-3.5 py-3.5 rounded-[var(--radius-card)] border border-black/10 bg-[var(--paper-raised)] outline-none"
              autoFocus
            />
            {error && <p className="text-xs text-[var(--clay-700)] text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-[var(--field-800)] text-white font-medium py-3.5 rounded-[var(--radius-pill)] hover:brightness-110 transition disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
              {lang === "mr" ? "व्हेरिफाय करा" : "Verify"}
            </button>
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="text-xs text-[var(--ink-soft)] underline mt-1"
            >
              {lang === "mr" ? "नंबर बदला" : "Change number"}
            </button>
          </form>
        )}
      </main>
    </>
  );
}
