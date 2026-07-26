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
  restaurant_id   text        not null,
  restaurant_name text        not null,
  address_id      uuid references public.addresses(id) on delete set null,
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
  food_id    text    not null,
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

-- ── Phase 11B migration ───────────────────────────────────────────────────────
-- The mobile catalog uses stable string IDs (for example r1 and r1_p1), not
-- UUIDs. These statements also make an existing UUID-based installation
-- compatible with the customer app and capture the selected address.
alter table public.orders
  alter column restaurant_id type text using restaurant_id::text;
alter table public.order_items
  alter column food_id type text using food_id::text;
alter table public.orders
  add column if not exists address_id uuid references public.addresses(id) on delete set null;

create index if not exists orders_user_created_at_idx
  on public.orders (user_id, created_at desc);
create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

-- The order and all order items are created atomically. This avoids partial
-- orders when the second client request fails and keeps authorization in the
-- database transaction.
create or replace function public.create_order_with_items(
  p_restaurant_id text,
  p_restaurant_name text,
  p_address_id uuid,
  p_total numeric,
  p_payment_method text,
  p_items jsonb
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
    raise exception 'Delivery address is invalid';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  insert into public.orders (
    user_id, restaurant_id, restaurant_name, address_id, status,
    total, payment_method
  )
  values (
    auth.uid(), p_restaurant_id, p_restaurant_name, p_address_id, 'pending',
    p_total, 'Cash on Delivery'
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

-- The customer app's local catalog uses string IDs, so these user-owned
-- references must use the same type as orders and order_items.
alter table public.favorites
  alter column restaurant_id type text using restaurant_id::text;
alter table public.cart
  alter column food_id type text using food_id::text;
