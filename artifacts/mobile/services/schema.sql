-- ─── Cravio — Supabase Schema ─────────────────────────────────────────────────
-- Run this entire file in the Supabase SQL Editor for your project.
-- Dashboard → SQL Editor → New Query → paste → Run.

-- ── Enable UUID extension ────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── users ────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  name         text        not null,
  email        text        not null unique,
  phone        text,
  profile_image text,
  created_at   timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- ── addresses ────────────────────────────────────────────────────────────────
create table if not exists public.addresses (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid        not null references public.users(id) on delete cascade,
  title      text        not null,
  house      text        not null,
  street     text        not null,
  city       text        not null,
  state      text        not null,
  pincode    text        not null,
  latitude   float8,
  longitude  float8,
  is_default boolean     not null default false
);

alter table public.addresses enable row level security;

create policy "Users manage their own addresses"
  on public.addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── restaurants ───────────────────────────────────────────────────────────────
create table if not exists public.restaurants (
  id            uuid primary key default uuid_generate_v4(),
  name          text    not null,
  rating        float4  not null default 0,
  delivery_time int     not null default 30,
  delivery_fee  float4  not null default 0,
  image         text,
  is_open       boolean not null default true
);

alter table public.restaurants enable row level security;

create policy "Restaurants are publicly readable"
  on public.restaurants for select
  using (true);

-- ── foods ─────────────────────────────────────────────────────────────────────
create table if not exists public.foods (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid    not null references public.restaurants(id) on delete cascade,
  name          text    not null,
  price         float4  not null,
  description   text,
  image         text,
  veg           boolean not null default false,
  rating        float4  not null default 0
);

alter table public.foods enable row level security;

create policy "Foods are publicly readable"
  on public.foods for select
  using (true);

-- ── orders ────────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid        not null references public.users(id) on delete cascade,
  restaurant_id   uuid        not null,
  restaurant_name text        not null,
  status          text        not null default 'pending'
                    check (status in ('pending','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  total           float4      not null,
  payment_method  text        not null,
  created_at      timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can read their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- ── order_items ───────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id         uuid    primary key default uuid_generate_v4(),
  order_id   uuid    not null references public.orders(id) on delete cascade,
  food_id    uuid    not null,
  food_name  text    not null,
  food_image text,
  quantity   int     not null,
  price      float4  not null
);

alter table public.order_items enable row level security;

create policy "Users can read items for their orders"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Users can insert items for their orders"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ── favorites ─────────────────────────────────────────────────────────────────
create table if not exists public.favorites (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  restaurant_id uuid not null,
  unique (user_id, restaurant_id)
);

alter table public.favorites enable row level security;

create policy "Users manage their own favorites"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── cart ──────────────────────────────────────────────────────────────────────
create table if not exists public.cart (
  user_id  uuid not null references public.users(id) on delete cascade,
  food_id  uuid not null,
  quantity int  not null default 1,
  primary key (user_id, food_id)
);

alter table public.cart enable row level security;

create policy "Users manage their own cart"
  on public.cart for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
