"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { supabase, Vendor, Product, Category } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
import { Loader2, LogOut, Package, Plus, Store, Trash2, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function VendorDashboardPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);

  // profile form state
  const [companyName, setCompanyName] = useState("");
  const [village, setVillage] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [description, setDescription] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const loadVendorData = useCallback(async (userId: string) => {
    setLoading(true);
    const { data: v } = await supabase.from("vendors").select("*").eq("owner_id", userId).maybeSingle();
    setVendor(v as Vendor | null);

    if (v) {
      const { data: p } = await supabase
        .from("products")
        .select("*, categories(*)")
        .eq("vendor_id", v.id)
        .order("created_at", { ascending: false });
      setProducts((p as Product[]) ?? []);
    }

    const { data: cats } = await supabase.from("categories").select("*");
    setCategories(cats ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/vendor/login");
        return;
      }
      setUser(data.user);
      setCheckingAuth(false);
      loadVendorData(data.user.id);
    });
  }, [router, loadVendorData]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);

    if (vendor) {
      await supabase
        .from("vendors")
        .update({
          company_name: companyName,
          village,
          whatsapp_number: whatsapp.replace(/\D/g, ""),
          description,
        })
        .eq("id", vendor.id);
    } else {
      await supabase.from("vendors").insert({
        owner_id: user.id,
        company_name: companyName,
        village,
        whatsapp_number: whatsapp.replace(/\D/g, ""),
        description,
      });
    }
    await loadVendorData(user.id);
    setSavingProfile(false);
  }

  async function deleteProduct(id: string) {
    await supabase.from("products").delete().eq("id", id);
    if (user) loadVendorData(user.id);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/vendor/login");
  }

  if (checkingAuth || loading) {
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

  // no vendor profile yet -> onboarding form
  if (!vendor) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-md mx-auto w-full px-4 sm:px-6 py-12">
          <div className="text-center mb-6">
            <span className="w-12 h-12 rounded-2xl bg-[var(--field-800)] flex items-center justify-center mx-auto mb-3">
              <Store size={20} className="text-[var(--mustard-400)]" aria-hidden="true" />
            </span>
            <h1 className="font-display text-xl font-medium text-[var(--field-900)]">
              {lang === "mr" ? "तुमचं दुकान तयार करा" : "Set up your shop"}
            </h1>
            <p className="text-sm text-[var(--ink-soft)] mt-1.5">
              {lang === "mr"
                ? "ही माहिती तुमच्या public profile वर दिसेल."
                : "This information will appear on your public profile."}
            </p>
          </div>
          <ProfileForm
            lang={lang}
            companyName={companyName}
            setCompanyName={setCompanyName}
            village={village}
            setVillage={setVillage}
            whatsapp={whatsapp}
            setWhatsapp={setWhatsapp}
            description={description}
            setDescription={setDescription}
            onSubmit={saveProfile}
            saving={savingProfile}
            submitLabel={lang === "mr" ? "दुकान तयार करा" : "Create shop"}
          />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-medium text-[var(--field-900)]">
              {vendor.company_name}
            </h1>
            <p className="text-sm text-[var(--ink-soft)]">
              {lang === "mr" ? "विक्रेता डॅशबोर्ड" : "Vendor Dashboard"}
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-soft)] hover:text-[var(--clay-700)] transition"
          >
            <LogOut size={15} aria-hidden="true" />
            {lang === "mr" ? "बाहेर पडा" : "Logout"}
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-medium text-[var(--field-900)]">
            {lang === "mr" ? "माझी उत्पादने" : "My Products"}
          </h2>
          <button
            onClick={() => setShowProductForm(true)}
            className="inline-flex items-center gap-1.5 bg-[var(--field-800)] text-white text-sm font-medium px-4 py-2.5 rounded-[var(--radius-pill)] hover:brightness-110 transition"
          >
            <Plus size={16} aria-hidden="true" />
            {lang === "mr" ? "उत्पादन जोडा" : "Add product"}
          </button>
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-[var(--ink-soft)] py-10 text-center">
            {lang === "mr" ? "अजून उत्पादने नाहीत. वरचं बटण दाबून सुरुवात करा." : "No products yet. Tap the button above to start."}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-[var(--radius-card)] border border-black/5 bg-[var(--paper-raised)] p-3.5 flex gap-3"
              >
                <span className="w-14 h-14 rounded-xl bg-[var(--field-50)] flex items-center justify-center shrink-0 overflow-hidden">
                  {p.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover_image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={20} className="text-[var(--field-700)]/40" aria-hidden="true" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-[var(--ink-soft)]">
                    {p.price_min ? `₹${p.price_min}` : lang === "mr" ? "किंमत नाही" : "No price"}
                  </p>
                </div>
                <button
                  onClick={() => deleteProduct(p.id)}
                  aria-label={lang === "mr" ? "उत्पादन काढा" : "Remove product"}
                  className="text-[var(--ink-soft)] hover:text-[var(--clay-700)] transition shrink-0 self-start"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 border-t border-black/5 pt-6">
          <h2 className="font-display text-lg font-medium text-[var(--field-900)] mb-4">
            {lang === "mr" ? "दुकान प्रोफाइल" : "Shop Profile"}
          </h2>
          <ProfileForm
            lang={lang}
            companyName={companyName || vendor.company_name}
            setCompanyName={setCompanyName}
            village={village || vendor.village || ""}
            setVillage={setVillage}
            whatsapp={whatsapp || vendor.whatsapp_number}
            setWhatsapp={setWhatsapp}
            description={description || vendor.description || ""}
            setDescription={setDescription}
            onSubmit={saveProfile}
            saving={savingProfile}
            submitLabel={lang === "mr" ? "बदल जतन करा" : "Save changes"}
          />
        </div>
      </main>

      {showProductForm && (
        <ProductFormModal
          lang={lang}
          vendorId={vendor.id}
          categories={categories}
          onClose={() => setShowProductForm(false)}
          onSaved={() => {
            setShowProductForm(false);
            if (user) loadVendorData(user.id);
          }}
        />
      )}
    </>
  );
}

function ProfileForm(props: {
  lang: "mr" | "en";
  companyName: string;
  setCompanyName: (v: string) => void;
  village: string;
  setVillage: (v: string) => void;
  whatsapp: string;
  setWhatsapp: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  submitLabel: string;
}) {
  const { lang } = props;
  return (
    <form onSubmit={props.onSubmit} className="flex flex-col gap-3">
      <Field label={lang === "mr" ? "दुकानाचं नाव" : "Shop name"}>
        <input
          required
          value={props.companyName}
          onChange={(e) => props.setCompanyName(e.target.value)}
          className="input"
          style={inputStyle}
        />
      </Field>
      <Field label={lang === "mr" ? "गाव" : "Village"}>
        <input
          value={props.village}
          onChange={(e) => props.setVillage(e.target.value)}
          style={inputStyle}
        />
      </Field>
      <Field label={lang === "mr" ? "WhatsApp नंबर" : "WhatsApp number"}>
        <div className="flex items-center rounded-[var(--radius-card)] border border-black/10 bg-[var(--paper-raised)] overflow-hidden">
          <span className="px-3.5 text-sm text-[var(--ink-soft)] border-r border-black/10 py-3">+91</span>
          <input
            required
            maxLength={10}
            value={props.whatsapp.replace(/^\+?91/, "")}
            onChange={(e) => props.setWhatsapp(e.target.value.replace(/\D/g, ""))}
            className="flex-1 px-3.5 py-3 text-sm bg-transparent outline-none"
          />
        </div>
      </Field>
      <Field label={lang === "mr" ? "वर्णन (ऐच्छिक)" : "Description (optional)"}>
        <textarea
          rows={3}
          value={props.description}
          onChange={(e) => props.setDescription(e.target.value)}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </Field>
      <button
        type="submit"
        disabled={props.saving}
        className="mt-1 inline-flex items-center justify-center gap-2 bg-[var(--field-800)] text-white font-medium py-3 rounded-[var(--radius-pill)] hover:brightness-110 transition disabled:opacity-60"
      >
        {props.saving && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {props.submitLabel}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.75rem 0.875rem",
  borderRadius: "var(--radius-card)",
  border: "1px solid rgba(0,0,0,0.1)",
  background: "var(--paper-raised)",
  fontSize: "0.875rem",
  outline: "none",
  width: "100%",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[var(--ink-soft)]">{label}</span>
      {children}
    </label>
  );
}

function ProductFormModal({
  lang,
  vendorId,
  categories,
  onClose,
  onSaved,
}: {
  lang: "mr" | "en";
  vendorId: string;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("products").insert({
      vendor_id: vendorId,
      category_id: categoryId,
      name,
      description: description || null,
      price_min: priceMin ? Number(priceMin) : null,
      price_max: priceMax ? Number(priceMax) : null,
      cover_image_url: imageUrl || null,
    });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[var(--paper)] rounded-t-[var(--radius-card)] sm:rounded-[var(--radius-card)] w-full sm:max-w-md max-h-[90vh] overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-medium">
            {lang === "mr" ? "नवं उत्पादन जोडा" : "Add new product"}
          </h3>
          <button onClick={onClose} aria-label={lang === "mr" ? "बंद करा" : "Close"}>
            <X size={20} className="text-[var(--ink-soft)]" aria-hidden="true" />
          </button>
        </div>
        <form onSubmit={save} className="flex flex-col gap-3">
          <Field label={lang === "mr" ? "उत्पादनाचं नाव" : "Product name"}>
            <input required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </Field>
          <Field label={lang === "mr" ? "प्रकार" : "Category"}>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={inputStyle}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {lang === "mr" ? c.name_mr : c.name_en}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === "mr" ? "किमान किंमत ₹" : "Min price ₹"}>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label={lang === "mr" ? "कमाल किंमत ₹" : "Max price ₹"}>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>
          <Field label={lang === "mr" ? "फोटो URL (ऐच्छिक)" : "Photo URL (optional)"}>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={inputStyle} />
          </Field>
          <Field label={lang === "mr" ? "वर्णन (ऐच्छिक)" : "Description (optional)"}>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>
          <button
            type="submit"
            disabled={saving}
            className="mt-1 inline-flex items-center justify-center gap-2 bg-[var(--field-800)] text-white font-medium py-3 rounded-[var(--radius-pill)] hover:brightness-110 transition disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {lang === "mr" ? "जतन करा" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
