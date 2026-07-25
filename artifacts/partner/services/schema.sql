-- ─── Cravio Partner — Supabase Schema ────────────────────────────────────────
-- Run this file in the Supabase SQL Editor (Dashboard → SQL Editor → New Query).
-- This extends the base Cravio schema with partner-specific tables.

create extension if not exists "uuid-ossp";

-- ── restaurant_partners ───────────────────────────────────────────────────────
-- Stores restaurant partner accounts. `id` matches auth.users(id).
create table if not exists public.restaurant_partners (
  id               uuid primary key references auth.users(id) on delete cascade,
  name             text        not null,
  email            text        not null unique,
  phone            text,
  approval_status  text        not null default 'pending'
                     check (approval_status in ('pending','under_review','approved','rejected','suspended')),
  rejection_reason text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.restaurant_partners enable row level security;

create policy "Partners can read their own profile"
  on public.restaurant_partners for select
  using (auth.uid() = id);

create policy "Partners can update their own profile"
  on public.restaurant_partners for update
  using (auth.uid() = id);

create policy "Partners can insert their own profile"
  on public.restaurant_partners for insert
  with check (auth.uid() = id);

-- ── partner_restaurants ───────────────────────────────────────────────────────
-- Rich restaurant profile submitted by partner.
-- Admin reviews and promotes to public restaurants table when approved.
create table if not exists public.partner_restaurants (
  id                uuid primary key default uuid_generate_v4(),
  partner_id        uuid        not null references public.restaurant_partners(id) on delete cascade,
  name              text        not null,
  description       text,
  cuisine_type      text        not null default '',
  address           text        not null default '',
  city              text        not null default '',
  state             text        not null default '',
  pincode           text        not null default '',
  phone             text        not null default '',
  email             text        not null default '',
  logo_url          text,
  is_open           boolean     not null default false,
  min_order         float4      not null default 0,
  avg_delivery_time int         not null default 30,
  delivery_fee      float4      not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (partner_id)
);

alter table public.partner_restaurants enable row level security;

create policy "Partners can manage their own restaurant"
  on public.partner_restaurants for all
  using (
    exists (
      select 1 from public.restaurant_partners rp
      where rp.id = partner_id and rp.id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.restaurant_partners rp
      where rp.id = partner_id and rp.id = auth.uid()
    )
  );

-- ── restaurant_documents ──────────────────────────────────────────────────────
create table if not exists public.restaurant_documents (
  id               uuid primary key default uuid_generate_v4(),
  restaurant_id    uuid not null references public.partner_restaurants(id) on delete cascade,
  document_type    text not null
                     check (document_type in ('fssai','gst_certificate','pan_card','shop_act','other')),
  document_url     text not null,
  status           text not null default 'pending'
                     check (status in ('pending','verified','rejected')),
  rejection_reason text,
  created_at       timestamptz not null default now(),
  unique (restaurant_id, document_type)
);

alter table public.restaurant_documents enable row level security;

create policy "Partners can manage their documents"
  on public.restaurant_documents for all
  using (
    exists (
      select 1 from public.partner_restaurants pr
      join public.restaurant_partners rp on rp.id = pr.partner_id
      where pr.id = restaurant_id and rp.id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.partner_restaurants pr
      join public.restaurant_partners rp on rp.id = pr.partner_id
      where pr.id = restaurant_id and rp.id = auth.uid()
    )
  );

-- ── bank_details ──────────────────────────────────────────────────────────────
create table if not exists public.bank_details (
  id                   uuid primary key default uuid_generate_v4(),
  restaurant_id        uuid not null unique references public.partner_restaurants(id) on delete cascade,
  account_holder_name  text not null,
  account_number       text not null,
  ifsc_code            text not null,
  bank_name            text not null,
  branch               text not null,
  account_type         text not null default 'savings'
                         check (account_type in ('savings','current')),
  is_verified          boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.bank_details enable row level security;

create policy "Partners can manage their bank details"
  on public.bank_details for all
  using (
    exists (
      select 1 from public.partner_restaurants pr
      join public.restaurant_partners rp on rp.id = pr.partner_id
      where pr.id = restaurant_id and rp.id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.partner_restaurants pr
      join public.restaurant_partners rp on rp.id = pr.partner_id
      where pr.id = restaurant_id and rp.id = auth.uid()
    )
  );

-- ── gst_details ───────────────────────────────────────────────────────────────
create table if not exists public.gst_details (
  id               uuid primary key default uuid_generate_v4(),
  restaurant_id    uuid not null unique references public.partner_restaurants(id) on delete cascade,
  gst_number       text not null,
  business_name    text not null,
  business_address text not null,
  is_verified      boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.gst_details enable row level security;

create policy "Partners can manage their GST details"
  on public.gst_details for all
  using (
    exists (
      select 1 from public.partner_restaurants pr
      join public.restaurant_partners rp on rp.id = pr.partner_id
      where pr.id = restaurant_id and rp.id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.partner_restaurants pr
      join public.restaurant_partners rp on rp.id = pr.partner_id
      where pr.id = restaurant_id and rp.id = auth.uid()
    )
  );

-- ── business_hours ────────────────────────────────────────────────────────────
create table if not exists public.business_hours (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references public.partner_restaurants(id) on delete cascade,
  day           text not null
                  check (day in ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  is_open       boolean not null default true,
  open_time     text not null default '09:00',
  close_time    text not null default '22:00',
  unique (restaurant_id, day)
);

alter table public.business_hours enable row level security;

create policy "Partners can manage their business hours"
  on public.business_hours for all
  using (
    exists (
      select 1 from public.partner_restaurants pr
      join public.restaurant_partners rp on rp.id = pr.partner_id
      where pr.id = restaurant_id and rp.id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.partner_restaurants pr
      join public.restaurant_partners rp on rp.id = pr.partner_id
      where pr.id = restaurant_id and rp.id = auth.uid()
    )
  );
