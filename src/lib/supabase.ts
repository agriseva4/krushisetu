import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  slug: string;
  name_mr: string;
  name_en: string;
  icon: string | null;
};

export type Vendor = {
  id: string;
  owner_id: string | null;
  company_name: string;
  village: string | null;
  district: string | null;
  whatsapp_number: string;
  profile_photo_url: string | null;
  description: string | null;
  is_verified?: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  vendor_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_min: number | null;
  price_max: number | null;
  cover_image_url: string | null;
  is_active: boolean;
  created_at: string;
  vendors?: Vendor;
  categories?: Category;
};
