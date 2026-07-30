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

-- ── Phase 13 — User profile: gender & date of birth ─────────────────────────
-- Optional fields added to the users table for enhanced profile editing.
alter table public.users
  add column if not exists gender text
    check (gender in ('male', 'female', 'non_binary', 'prefer_not_to_say')),
  add column if not exists dob    date;

-- ── Phase 12 — Cart persistence metadata ─────────────────────────────────────
-- Extend the cart table so CartItems can be fully reconstructed on login
-- without a separate catalog lookup.  All new columns are nullable / defaulted
-- so existing rows and a fresh schema run are both safe.
alter table public.cart
  add column if not exists restaurant_id   text,
  add column if not exists restaurant_name text,
  add column if not exists food_name       text    not null default '',
  add column if not exists food_price      float4  not null default 0,
  add column if not exists food_image      text,
  add column if not exists notes           text;

-- ── Phase 11C-4 — Hunger Relief donation wallet ───────────────────────────────
-- Donations are a separate financial ledger. They must never be mixed with
-- restaurant settlements, delivery partner earnings, or platform commission.
create table if not exists public.donation_wallet_entries (
  id              uuid primary key default uuid_generate_v4(),
  order_id        uuid not null unique references public.orders(id) on delete restrict,
  customer_id     uuid not null references auth.users(id) on delete restrict,
  amount          numeric(12, 2) not null check (amount > 0),
  payment_status  text not null default 'paid'
                  check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  transaction_id  text,
  payment_method  text not null,
  created_at      timestamptz not null default now()
);

create table if not exists public.donation_withdrawals (
  id              uuid primary key default uuid_generate_v4(),
  amount          numeric(12, 2) not null check (amount > 0),
  status          text not null default 'requested'
                  check (status in ('requested', 'approved', 'completed', 'rejected')),
  requested_at    timestamptz not null default now(),
  completed_at    timestamptz
);

create table if not exists public.donation_utilization (
  id                uuid primary key default uuid_generate_v4(),
  amount            numeric(12, 2) not null check (amount > 0),
  purpose           text not null,
  beneficiary_count int check (beneficiary_count is null or beneficiary_count >= 0),
  status            text not null default 'planned'
                    check (status in ('planned', 'approved', 'completed', 'cancelled')),
  utilized_at       timestamptz,
  created_at        timestamptz not null default now()
);

alter table public.donation_wallet_entries enable row level security;
alter table public.donation_withdrawals enable row level security;
alter table public.donation_utilization enable row level security;

drop policy if exists "Customers can read their own donations" on public.donation_wallet_entries;
create policy "Customers can read their own donations"
  on public.donation_wallet_entries for select
  using (auth.uid() = customer_id);

-- Wallet entries are never directly writable by a customer. The only
-- authenticated write path is the validated order-plus-donation RPC below.
drop policy if exists "Customers can create their own donations" on public.donation_wallet_entries;
revoke insert, update, delete on public.donation_wallet_entries from anon, authenticated;

drop policy if exists "Donation admins can read wallet entries" on public.donation_wallet_entries;
create policy "Donation admins can read wallet entries"
  on public.donation_wallet_entries for select
  using (
    coalesce(auth.jwt()->'app_metadata'->>'role', '') in ('admin', 'super_admin')
    or auth.role() = 'service_role'
  );

drop policy if exists "Donation admins can manage withdrawals" on public.donation_withdrawals;
create policy "Donation admins can manage withdrawals"
  on public.donation_withdrawals for all
  using (
    coalesce(auth.jwt()->'app_metadata'->>'role', '') in ('admin', 'super_admin')
    or auth.role() = 'service_role'
  )
  with check (
    coalesce(auth.jwt()->'app_metadata'->>'role', '') in ('admin', 'super_admin')
    or auth.role() = 'service_role'
  );

drop policy if exists "Donation admins can manage utilization" on public.donation_utilization;
create policy "Donation admins can manage utilization"
  on public.donation_utilization for all
  using (
    coalesce(auth.jwt()->'app_metadata'->>'role', '') in ('admin', 'super_admin')
    or auth.role() = 'service_role'
  )
  with check (
    coalesce(auth.jwt()->'app_metadata'->>'role', '') in ('admin', 'super_admin')
    or auth.role() = 'service_role'
  );

create index if not exists donation_wallet_customer_created_idx
  on public.donation_wallet_entries (customer_id, created_at desc);
create index if not exists donation_wallet_status_created_idx
  on public.donation_wallet_entries (payment_status, created_at desc);
create index if not exists donation_withdrawals_status_idx
  on public.donation_withdrawals (status, requested_at desc);
create index if not exists donation_utilization_status_idx
  on public.donation_utilization (status, created_at desc);

-- Atomic order + donation creation. The donation entry shares the order
-- transaction, so a successful checkout cannot leave an unlinked donation.
create or replace function public.create_order_with_donation(
  p_restaurant_id   text,
  p_restaurant_name text,
  p_address_id      uuid,
  p_total           numeric,
  p_payment_method  text,
  p_items           jsonb,
  p_donation_amount numeric
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_order public.orders;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if p_address_id is null or not exists (
    select 1 from public.addresses where id = p_address_id and user_id = auth.uid()
  ) then raise exception 'Delivery address is invalid or does not belong to this user'; end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then raise exception 'Cart is empty'; end if;
  if p_donation_amount is null or p_donation_amount <= 0 then raise exception 'Donation amount must be positive'; end if;

  insert into public.orders (
    user_id, restaurant_id, restaurant_name, address_id, status, total, payment_method
  )
  values (
    auth.uid(), p_restaurant_id, p_restaurant_name, p_address_id, 'pending', p_total, p_payment_method
  )
  returning * into new_order;

  insert into public.order_items (order_id, food_id, food_name, food_image, quantity, price)
  select
    new_order.id, item->>'foodId', item->>'foodName', nullif(item->>'foodImage', ''),
    (item->>'quantity')::int, (item->>'price')::numeric
  from jsonb_array_elements(p_items) as item;

  insert into public.donation_wallet_entries (
    order_id, customer_id, amount, payment_status, payment_method
  )
  values (
    new_order.id,
    auth.uid(),
    p_donation_amount,
    case when lower(p_payment_method) = 'cash on delivery' then 'pending' else 'paid' end,
    p_payment_method
  );

  return new_order;
end;
$$;

revoke all on function public.create_order_with_donation(text, text, uuid, numeric, text, jsonb, numeric)
  from public;
grant execute on function public.create_order_with_donation(text, text, uuid, numeric, text, jsonb, numeric)
  to authenticated;

-- Read-only contract for the future Admin Panel's donation module.
create or replace function public.get_donation_management_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not (
    coalesce(auth.jwt()->'app_metadata'->>'role', '') in ('admin', 'super_admin')
    or auth.role() = 'service_role'
  ) then
    raise exception 'Donation management access denied';
  end if;

  select jsonb_build_object(
    'totalDonations', (select count(*) from public.donation_wallet_entries where payment_status = 'paid'),
    'todaysDonations', coalesce((select sum(amount) from public.donation_wallet_entries where payment_status = 'paid' and created_at >= date_trunc('day', now())), 0),
    'monthlyDonations', coalesce((select sum(amount) from public.donation_wallet_entries where payment_status = 'paid' and created_at >= date_trunc('month', now())), 0),
    'yearlyDonations', coalesce((select sum(amount) from public.donation_wallet_entries where payment_status = 'paid' and created_at >= date_trunc('year', now())), 0),
    'walletBalance', coalesce((select sum(amount) from public.donation_wallet_entries where payment_status = 'paid'), 0),
    'donationCollection', coalesce((select sum(amount) from public.donation_wallet_entries where payment_status = 'paid'), 0),
    'donationBalance', coalesce((select sum(amount) from public.donation_wallet_entries where payment_status = 'paid'), 0),
    'donationUtilized', coalesce((select sum(amount) from public.donation_utilization where status = 'completed'), 0),
    'remainingBalance',
      greatest(
        coalesce((select sum(amount) from public.donation_wallet_entries where payment_status = 'paid'), 0)
        - coalesce((select sum(amount) from public.donation_utilization where status = 'completed'), 0),
        0
      ),
    'recentDonations', coalesce((
      select jsonb_agg(to_jsonb(recent) order by recent.created_at desc)
      from (
        select
          donation.*,
          coalesce(customer.name, customer.email) as customer_name,
          customer.email as customer_email
        from public.donation_wallet_entries donation
        left join public.users customer on customer.id = donation.customer_id
        order by donation.created_at desc
        limit 50
      ) recent
    ), '[]'::jsonb),
    'withdrawalHistory', coalesce((
      select jsonb_agg(to_jsonb(withdrawal) order by withdrawal.requested_at desc)
      from (
        select * from public.donation_withdrawals
        order by requested_at desc
        limit 50
      ) withdrawal
    ), '[]'::jsonb),
    'utilizationRecords', coalesce((
      select jsonb_agg(to_jsonb(utilization) order by utilization.created_at desc)
      from (
        select * from public.donation_utilization
        order by created_at desc
        limit 50
      ) utilization
    ), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;

revoke all on function public.get_donation_management_snapshot() from public;
grant execute on function public.get_donation_management_snapshot() to authenticated;
