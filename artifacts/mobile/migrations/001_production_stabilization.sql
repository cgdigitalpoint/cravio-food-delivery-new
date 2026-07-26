-- ═══════════════════════════════════════════════════════════════════════════
-- CRAVIO — Production Stabilization Migration
-- Run this ENTIRE file in: Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE / ON CONFLICT DO NOTHING).
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Enable UUID extension (idempotent) ─────────────────────────────────
create extension if not exists "uuid-ossp";


-- ── 2. Create tables if they don't exist yet ──────────────────────────────

create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text        not null,
  email         text        not null unique,
  phone         text,
  profile_image text,
  created_at    timestamptz not null default now()
);

create table if not exists public.addresses (
  id         uuid        primary key default uuid_generate_v4(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
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

create table if not exists public.restaurants (
  id            uuid primary key default uuid_generate_v4(),
  name          text    not null,
  rating        float4  not null default 0,
  delivery_time int     not null default 30,
  delivery_fee  float4  not null default 0,
  image         text,
  is_open       boolean not null default true
);

create table if not exists public.foods (
  id            uuid    primary key default uuid_generate_v4(),
  restaurant_id uuid    not null references public.restaurants(id) on delete cascade,
  name          text    not null,
  price         float4  not null,
  description   text,
  image         text,
  veg           boolean not null default false,
  rating        float4  not null default 0
);

create table if not exists public.orders (
  id              uuid        primary key default uuid_generate_v4(),
  user_id         uuid        not null references auth.users(id) on delete cascade,
  restaurant_id   text        not null,
  restaurant_name text        not null,
  address_id      uuid        references public.addresses(id) on delete set null,
  status          text        not null default 'pending'
                    check (status in ('pending','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  total           float4      not null,
  payment_method  text        not null,
  created_at      timestamptz not null default now()
);

create table if not exists public.order_items (
  id         uuid    primary key default uuid_generate_v4(),
  order_id   uuid    not null references public.orders(id) on delete cascade,
  food_id    text    not null,
  food_name  text    not null,
  food_image text,
  quantity   int     not null,
  price      float4  not null
);

create table if not exists public.favorites (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  restaurant_id text not null,
  unique (user_id, restaurant_id)
);

create table if not exists public.cart (
  user_id  uuid not null references auth.users(id) on delete cascade,
  food_id  text not null,
  quantity int  not null default 1,
  primary key (user_id, food_id)
);


-- ── 3. Fix existing FK constraints to point to auth.users ─────────────────
-- (If tables were created before with public.users FKs, this corrects them)

-- addresses
alter table public.addresses
  drop constraint if exists addresses_user_id_fkey;
alter table public.addresses
  add constraint addresses_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- orders
alter table public.orders
  drop constraint if exists orders_user_id_fkey;
alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- favorites
alter table public.favorites
  drop constraint if exists favorites_user_id_fkey;
alter table public.favorites
  add constraint favorites_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- cart
alter table public.cart
  drop constraint if exists cart_user_id_fkey;
alter table public.cart
  add constraint cart_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- ── 4. Enable RLS and set policies on every table ─────────────────────────

-- users
alter table public.users enable row level security;
drop policy if exists "Users can read their own profile"    on public.users;
drop policy if exists "Users can update their own profile"  on public.users;
drop policy if exists "Users can insert their own profile"  on public.users;
create policy "Users can read their own profile"
  on public.users for select using (auth.uid() = id);
create policy "Users can update their own profile"
  on public.users for update using (auth.uid() = id);
create policy "Users can insert their own profile"
  on public.users for insert with check (auth.uid() = id);

-- addresses
alter table public.addresses enable row level security;
drop policy if exists "Users manage their own addresses" on public.addresses;
create policy "Users manage their own addresses"
  on public.addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- restaurants (public read)
alter table public.restaurants enable row level security;
drop policy if exists "Restaurants are publicly readable" on public.restaurants;
create policy "Restaurants are publicly readable"
  on public.restaurants for select using (true);

-- foods (public read)
alter table public.foods enable row level security;
drop policy if exists "Foods are publicly readable" on public.foods;
create policy "Foods are publicly readable"
  on public.foods for select using (true);

-- orders
alter table public.orders enable row level security;
drop policy if exists "Users can read their own orders"   on public.orders;
drop policy if exists "Users can insert their own orders" on public.orders;
create policy "Users can read their own orders"
  on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert their own orders"
  on public.orders for insert with check (auth.uid() = user_id);

-- order_items
alter table public.order_items enable row level security;
drop policy if exists "Users can read items for their orders"   on public.order_items;
drop policy if exists "Users can insert items for their orders" on public.order_items;
create policy "Users can read items for their orders"
  on public.order_items for select
  using (exists (
    select 1 from public.orders
    where orders.id = order_items.order_id and orders.user_id = auth.uid()
  ));
create policy "Users can insert items for their orders"
  on public.order_items for insert
  with check (exists (
    select 1 from public.orders
    where orders.id = order_items.order_id and orders.user_id = auth.uid()
  ));

-- favorites
alter table public.favorites enable row level security;
drop policy if exists "Users manage their own favorites" on public.favorites;
create policy "Users manage their own favorites"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- cart
alter table public.cart enable row level security;
drop policy if exists "Users manage their own cart" on public.cart;
create policy "Users manage their own cart"
  on public.cart for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 5. Auto-create user profile on every new signup ──────────────────────
-- This trigger fires AFTER a row is inserted into auth.users, so the profile
-- row in public.users is always created — even when email confirmation is
-- enabled and the client has no session yet.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, phone, created_at)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      split_part(new.email, '@', 1)
    ),
    new.email,
    nullif(trim(new.raw_user_meta_data->>'phone'), ''),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── 6. Atomic order creation function ────────────────────────────────────
-- Creates the order + all items in one transaction. RLS keeps it safe.

create or replace function public.create_order_with_items(
  p_restaurant_id   text,
  p_restaurant_name text,
  p_address_id      uuid,
  p_total           numeric,
  p_payment_method  text,
  p_items           jsonb
)
returns public.orders
language plpgsql
security invoker
set search_path = public
as $$
declare
  new_order public.orders;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if p_address_id is null or not exists (
    select 1 from public.addresses
    where id = p_address_id and user_id = auth.uid()
  ) then
    raise exception 'Delivery address is invalid or does not belong to this user';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  insert into public.orders (
    user_id, restaurant_id, restaurant_name, address_id,
    status, total, payment_method
  )
  values (
    auth.uid(), p_restaurant_id, p_restaurant_name, p_address_id,
    'pending', p_total, p_payment_method
  )
  returning * into new_order;

  insert into public.order_items (
    order_id, food_id, food_name, food_image, quantity, price
  )
  select
    new_order.id,
    item->>'foodId',
    item->>'foodName',
    nullif(item->>'foodImage', ''),
    (item->>'quantity')::int,
    (item->>'price')::numeric
  from jsonb_array_elements(p_items) as item;

  return new_order;
end;
$$;

grant execute on function public.create_order_with_items(text, text, uuid, numeric, text, jsonb)
  to authenticated;


-- ── 7. Performance indexes ─────────────────────────────────────────────────
create index if not exists addresses_user_id_idx    on public.addresses (user_id);
create index if not exists orders_user_created_idx  on public.orders (user_id, created_at desc);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists favorites_user_id_idx    on public.favorites (user_id);
create index if not exists cart_user_id_idx         on public.cart (user_id);
create index if not exists foods_restaurant_id_idx  on public.foods (restaurant_id);


-- ── 8. Backfill: create profile rows for any existing auth users ──────────
insert into public.users (id, name, email, created_at)
select
  au.id,
  coalesce(
    nullif(trim(au.raw_user_meta_data->>'full_name'), ''),
    split_part(au.email, '@', 1)
  ),
  au.email,
  au.created_at
from auth.users au
where not exists (select 1 from public.users pu where pu.id = au.id)
on conflict (id) do nothing;


-- ── 9. DONE ───────────────────────────────────────────────────────────────
-- After running this, test:
--   1. Sign up a new user → profile should appear in public.users
--   2. Add an address → should succeed (no RLS / FK error)
--   3. Place an order → create_order_with_items should work
select 'Migration complete ✅' as result;
