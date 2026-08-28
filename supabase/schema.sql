-- KrushiSetu MVP schema — run this in Supabase SQL editor
-- Covers: farmer-facing browse, vendor self-service dashboard, admin dashboard
-- No vendor approval gate (per current decision) — vendors go live immediately.

create extension if not exists "uuid-ossp";

-- Roles live on Supabase's auth.users via a profile table, linked 1:1
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique not null,
  role text not null check (role in ('admin', 'vendor')) default 'vendor',
  created_at timestamptz default now()
);

create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,          -- 'fertilizer' | 'equipment' | 'seeds' | 'pesticide'
  name_mr text not null,
  name_en text not null,
  icon text                            -- lucide icon name, e.g. 'droplets'
);

create table public.vendors (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete cascade,
  company_name text not null,
  village text,
  district text default 'Pune',
  whatsapp_number text not null,       -- E.164 without '+', e.g. 919876543210
  profile_photo_url text,
  description text,
  created_at timestamptz default now()
);

create table public.products (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid references public.vendors(id) on delete cascade not null,
  category_id uuid references public.categories(id) not null,
  name text not null,
  description text,
  price_min numeric,
  price_max numeric,
  cover_image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade not null,
  image_url text not null,
  sort_order int default 0
);

-- === Row Level Security ===
alter table public.profiles enable row level security;
alter table public.vendors enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.categories enable row level security;

-- Categories & active products: readable by everyone (public farmer-facing pages)
create policy "public read categories" on public.categories for select using (true);
create policy "public read active products" on public.products for select using (is_active = true);
create policy "public read product images" on public.product_images for select using (true);
create policy "public read vendors" on public.vendors for select using (true);

-- Vendors manage only their own row
create policy "vendor reads own profile" on public.profiles for select using (auth.uid() = id);
create policy "vendor manages own company" on public.vendors for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Vendors manage only their own products
create policy "vendor manages own products" on public.products for all
  using (vendor_id in (select id from public.vendors where owner_id = auth.uid()))
  with check (vendor_id in (select id from public.vendors where owner_id = auth.uid()));

create policy "vendor manages own product images" on public.product_images for all
  using (product_id in (
    select p.id from public.products p
    join public.vendors v on v.id = p.vendor_id
    where v.owner_id = auth.uid()
  ));

-- Admins bypass everything (checked via profiles.role in app logic + a permissive policy)
create policy "admin full access vendors" on public.vendors for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "admin full access products" on public.products for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Seed the 4 starting categories
insert into public.categories (slug, name_mr, name_en, icon) values
  ('fertilizer', 'खते', 'Fertilizer', 'droplets'),
  ('equipment', 'अवजारे', 'Equipment', 'tractor'),
  ('seeds', 'बियाणे', 'Seeds', 'sprout'),
  ('pesticide', 'कीटकनाशक', 'Pesticide', 'bug');
