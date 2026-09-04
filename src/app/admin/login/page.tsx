"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
export default function AdminLoginPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@") || !email.includes(".")) {
      setError(lang === "mr" ? "बरोबर email टाका." : "Enter a valid email address.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
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
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError(lang === "mr" ? "चुकीचा कोड. पुन्हा प्रयत्न करा." : "Incorrect code. Please try again.");
      return;
    }
    router.push("/admin/dashboard");
  }
  return (
    <>
      <Header />
      <main className="flex-1 max-w-sm mx-auto w-full px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <span className="w-12 h-12 rounded-2xl bg-[var(--field-800)] flex items-center justify-center mx-auto mb-4">
            {step === "email" ? (
              <Mail size={20} className="text-[var(--mustard-400)]" aria-hidden="true" />
            ) : (
              <ShieldCheck size={20} className="text-[var(--mustard-400)]" aria-hidden="true" />
            )}
          </span>
          <h1 className="font-display text-xl font-medium text-[var(--field-900)]">
            {lang === "mr" ? "अ‍ॅडमिन लॉगिन" : "Admin Login"}
          </h1>
          <p className="text-sm text-[var(--ink-soft)] mt-1.5">
            {step === "email"
              ? lang === "mr"
                ? "तुमचा email टाका, आम्ही OTP पाठवू."
                : "Enter your email, we'll send an OTP."
              : lang === "mr"
                ? `${email} वर पाठवलेला 6 अंकी कोड टाका.`
                : `Enter the 6-digit code sent to ${email}.`}
          </p>
        </div>
        {step === "email" ? (
          <form onSubmit={sendOtp} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={lang === "mr" ? "tumcha@email.com" : "you@email.com"}
              className="px-3.5 py-3.5 text-sm rounded-[var(--radius-card)] border border-black/10 bg-[var(--paper-raised)] outline-none"
              autoFocus
            />
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
              onClick={() => setStep("email")}
              className="text-xs text-[var(--ink-soft)] underline mt-1"
            >
              {lang === "mr" ? "email बदला" : "Change email"}
            </button>
          </form>
        )}
      </main>
    </>
  );
}
