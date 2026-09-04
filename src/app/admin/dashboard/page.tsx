"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { supabase, Vendor, Product } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
import { BadgeCheck, LogOut, Loader2, Package, ShieldAlert, Store, Trash2 } from "lucide-react";
export default function AdminDashboardPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<"vendors" | "products">("vendors");
  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ data: v }, { data: p }] = await Promise.all([
      supabase.from("vendors").select("*").order("created_at", { ascending: false }),
      supabase
        .from("products")
        .select("*, vendors(*), categories(*)")
        .order("created_at", { ascending: false }),
    ]);
    setVendors((v as Vendor[]) ?? []);
    setProducts((p as Product[]) ?? []);
    setLoading(false);
  }, []);
  useEffect(() => {
    async function checkAdmin() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/admin/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (profile?.role === "admin") {
        setIsAdmin(true);
        loadData();
      }
      setCheckingAuth(false);
    }
    checkAdmin();
  }, [router, loadData]);
  async function toggleVerified(vendor: Vendor) {
    await supabase.from("vendors").update({ is_verified: !vendor.is_verified }).eq("id", vendor.id);
    loadData();
  }
  async function deleteVendor(id: string) {
    await supabase.from("vendors").delete().eq("id", id);
    loadData();
  }
  async function deleteProduct(id: string) {
    await supabase.from("products").delete().eq("id", id);
    loadData();
  }
  async function toggleProductActive(product: Product) {
    await supabase.from("products").update({ is_active: !product.is_active }).eq("id", product.id);
    loadData();
  }
  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }
  if (checkingAuth) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-24 text-[var(--ink-soft)] gap-2">
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          <span className="text-sm">{lang === "mr" ? "लोड होत आहे…" : "Loading…"}</span>
        </main>
      </>
    );
  }
  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24 gap-3 text-center px-4">
          <ShieldAlert size={32} className="text-[var(--clay-700)]" aria-hidden="true" />
          <p className="text-sm text-[var(--ink-soft)] max-w-xs">
            {lang === "mr"
              ? "हे खाते अ‍ॅडमिन नाही. Supabase madhी profiles table मध्ये role='admin' सेट करा."
              : "This account is not an admin. Set role='admin' in the profiles table via Supabase."}
          </p>
        </main>
      </>
    );
  }
  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-xl sm:text-2xl font-medium text-[var(--field-900)]">
            {lang === "mr" ? "अ‍ॅडमिन डॅशबोर्ड" : "Admin Dashboard"}
          </h1>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-soft)] hover:text-[var(--clay-700)] transition"
          >
            <LogOut size={15} aria-hidden="true" />
            {lang === "mr" ? "बाहेर पडा" : "Logout"}
          </button>
        </div>
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("vendors")}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              tab === "vendors"
                ? "bg-[var(--field-800)] text-white border-[var(--field-800)]"
                : "border-black/10 text-[var(--ink-soft)] bg-[var(--paper-raised)]"
            }`}
          >
            {lang === "mr" ? "विक्रेते" : "Vendors"} ({vendors.length})
          </button>
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              tab === "products"
                ? "bg-[var(--field-800)] text-white border-[var(--field-800)]"
                : "border-black/10 text-[var(--ink-soft)] bg-[var(--paper-raised)]"
            }`}
          >
            {lang === "mr" ? "उत्पादने" : "Products"} ({products.length})
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[var(--ink-soft)] gap-2">
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            <span className="text-sm">{lang === "mr" ? "लोड होत आहे…" : "Loading…"}</span>
          </div>
        ) : tab === "vendors" ? (
          <div className="flex flex-col gap-3">
            {vendors.length === 0 && (
              <p className="text-sm text-[var(--ink-soft)] py-10 text-center">
                {lang === "mr" ? "अजून वेंडर्स नाहीत." : "No vendors yet."}
              </p>
            )}
            {vendors.map((v) => (
              <div
                key={v.id}
                className="rounded-[var(--radius-card)] border border-black/5 bg-[var(--paper-raised)] p-4 flex items-center gap-3"
              >
                <span className="w-10 h-10 rounded-xl bg-[var(--field-50)] flex items-center justify-center shrink-0">
                  <Store size={17} className="text-[var(--field-700)]" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    {v.company_name}
                    {v.is_verified && (
                      <BadgeCheck size={14} className="text-[var(--field-700)] shrink-0" aria-hidden="true" />
                    )}
                  </p>
                  <p className="text-xs text-[var(--ink-soft)]">
                    {v.village ?? "—"} · {v.whatsapp_number}
                  </p>
                </div>
                <button
                  onClick={() => toggleVerified(v)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border shrink-0 transition ${
                    v.is_verified
                      ? "border-[var(--field-700)] text-[var(--field-700)]"
                      : "border-black/10 text-[var(--ink-soft)]"
                  }`}
                >
                  {v.is_verified
                    ? lang === "mr"
                      ? "अनव्हेरिफाय करा"
                      : "Unverify"
                    : lang === "mr"
                      ? "पडताळणी करा"
                      : "Verify"}
                </button>
                <button
                  onClick={() => deleteVendor(v.id)}
                  aria-label={lang === "mr" ? "काढा" : "Remove"}
                  className="text-[var(--ink-soft)] hover:text-[var(--clay-700)] transition shrink-0"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {products.length === 0 && (
              <p className="text-sm text-[var(--ink-soft)] py-10 text-center">
                {lang === "mr" ? "अजून उत्पादने नाहीत." : "No products yet."}
              </p>
            )}
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-[var(--radius-card)] border border-black/5 bg-[var(--paper-raised)] p-4 flex items-center gap-3"
              >
                <span className="w-10 h-10 rounded-xl bg-[var(--field-50)] flex items-center justify-center shrink-0">
                  <Package size={17} className="text-[var(--field-700)]" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-[var(--ink-soft)]">
                    {p.vendors?.company_name ?? "—"} · {p.price_min ? `₹${p.price_min}` : "—"}
                  </p>
                </div>
                <button
                  onClick={() => toggleProductActive(p)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border shrink-0 transition ${
                    p.is_active
                      ? "border-[var(--field-700)] text-[var(--field-700)]"
                      : "border-[var(--clay-700)] text-[var(--clay-700)]"
                  }`}
                >
                  {p.is_active
                    ? lang === "mr"
                      ? "लाइव्ह"
                      : "Live"
                    : lang === "mr"
                      ? "लपवलेलं"
                      : "Hidden"}
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  aria-label={lang === "mr" ? "काढा" : "Remove"}
                  className="text-[var(--ink-soft)] hover:text-[var(--clay-700)] transition shrink-0"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
