-- ─── Cravio Production Stabilization — Migration 001 ─────────────────────────
-- Run this file in the Supabase SQL Editor (Dashboard → SQL Editor → New Query).
-- It is safe to run multiple times (uses IF NOT EXISTS / OR REPLACE).

-- ── 1. Auto-create user profile on signup ────────────────────────────────────
-- This trigger creates a row in public.users the moment a new auth user is
-- created, so profile data is always available even before the client SDK
-- creates it manually. Removes the race condition between signUp and getProfile.

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

-- Drop and recreate to ensure it points to the updated function
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── 2. Fix addresses foreign key ──────────────────────────────────────────────
-- The original schema had addresses.user_id → public.users(id).
-- This means a user cannot add an address until their profile row exists.
-- With the trigger above this is resolved, but we also change the FK to point
-- directly to auth.users so the constraint never blocks authenticated users.

alter table public.addresses
  drop constraint if exists addresses_user_id_fkey;

alter table public.addresses
  add constraint addresses_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- ── 3. Ensure orders.user_id → auth.users (parallel fix) ─────────────────────
alter table public.orders
  drop constraint if exists orders_user_id_fkey;

alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- ── 4. Ensure favorites.user_id → auth.users ─────────────────────────────────
alter table public.favorites
  drop constraint if exists favorites_user_id_fkey;

alter table public.favorites
  add constraint favorites_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- ── 5. Ensure cart.user_id → auth.users ──────────────────────────────────────
alter table public.cart
  drop constraint if exists cart_user_id_fkey;

alter table public.cart
  add constraint cart_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- ── 6. Tighten addresses RLS (belt-and-suspenders) ───────────────────────────
-- Drop and re-create so the policy is always current.
drop policy if exists "Users manage their own addresses" on public.addresses;

create policy "Users manage their own addresses"
  on public.addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 7. Add missing users RLS insert policy (required for upsert fallback) ─────
drop policy if exists "Users can insert their own profile" on public.users;

create policy "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);


-- ── 8. Useful indexes ─────────────────────────────────────────────────────────
create index if not exists addresses_user_id_idx on public.addresses (user_id);
create index if not exists favorites_user_id_idx on public.favorites (user_id);
create index if not exists cart_user_id_idx on public.cart (user_id);


-- ── 9. Backfill profiles for existing auth users (if any) ────────────────────
-- Safe to run even if table is empty.
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
