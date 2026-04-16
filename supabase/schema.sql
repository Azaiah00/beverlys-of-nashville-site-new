-- ============================================================================
-- Beverly's of Nashville — Academy Portal Schema
-- ============================================================================
-- Run this in Supabase → SQL Editor to bootstrap the entire portal backend.
-- Safe to re-run: every CREATE uses IF NOT EXISTS / OR REPLACE.
--
-- Tables:
--   profiles        - one row per authenticated user (mirrors auth.users)
--   subscriptions   - current Stripe subscription + tier
--   entitlements    - granular per-product access (overrides tier)
--   progress        - per-user, per-lesson completion tracking
--   events          - server-side analytics (pageviews, conversions)
-- ============================================================================

-- ── 0. Extensions ──────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ── 1. Enums ───────────────────────────────────────────────────────────────
do $$ begin
  create type tier_t as enum ('free','apprentice','artisan','master');
exception when duplicate_object then null; end $$;

do $$ begin
  create type sub_status_t as enum ('trialing','active','past_due','canceled','incomplete','incomplete_expired','unpaid','paused');
exception when duplicate_object then null; end $$;

-- ── 2. profiles ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  full_name           text,
  avatar_url          text,
  stripe_customer_id  text unique,
  role                text not null default 'member',           -- 'member' | 'admin'
  is_admin            boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (lower(email));

-- Auto-create profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(coalesce(new.email, ''));
  v_is_admin boolean := false;
begin
  -- Hardcoded admin whitelist (Couture + Beverly's owner Gmail — keep in sync with client/src/lib/admins.ts)
  if v_email in (
    'hello@couturehouse.co',
    'teddychisom1963@gmail.com'
  ) then
    v_is_admin := true;
  end if;

  insert into public.profiles (id, email, full_name, avatar_url, is_admin, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    v_is_admin,
    case when v_is_admin then 'admin' else 'member' end
  )
  on conflict (id) do update
    set is_admin = excluded.is_admin,
        role     = excluded.role;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 3. subscriptions ───────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references public.profiles(id) on delete cascade,
  tier                    tier_t not null default 'free',
  status                  sub_status_t not null default 'active',
  stripe_subscription_id  text unique,
  stripe_price_id         text,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  founding_member         boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create unique index if not exists subscriptions_user_unique on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);

-- ── 4. entitlements ─────────────────────────────────────────────────────────
-- Per-product overrides (e.g. lifetime comp for a specific course)
create table if not exists public.entitlements (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  product_slug  text not null,
  granted_by    text,           -- 'stripe' | 'admin' | 'promo' | 'founding'
  granted_at    timestamptz not null default now(),
  expires_at    timestamptz,
  unique (user_id, product_slug)
);

create index if not exists entitlements_user_idx on public.entitlements(user_id);

-- ── 5. progress ─────────────────────────────────────────────────────────────
create table if not exists public.progress (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  product_slug   text not null,
  lesson_id      text not null,
  completed      boolean not null default false,
  completed_at   timestamptz,
  time_spent     integer not null default 0,       -- seconds
  updated_at     timestamptz not null default now(),
  unique (user_id, product_slug, lesson_id)
);

create index if not exists progress_user_idx on public.progress(user_id);
create index if not exists progress_product_idx on public.progress(product_slug);

-- ── 6. events ───────────────────────────────────────────────────────────────
create table if not exists public.events (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete set null,
  event_name  text not null,
  payload     jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists events_user_idx on public.events(user_id);
create index if not exists events_name_idx on public.events(event_name);

-- ── 7. Helper: is_current_admin ─────────────────────────────────────────────
create or replace function public.is_current_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- ── 8. Row-Level Security ───────────────────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.entitlements   enable row level security;
alter table public.progress       enable row level security;
alter table public.events         enable row level security;

-- profiles: user sees their own row; admins see all
drop policy if exists "profiles: self read" on public.profiles;
create policy "profiles: self read" on public.profiles
  for select using (auth.uid() = id or public.is_current_admin());

drop policy if exists "profiles: self update" on public.profiles;
create policy "profiles: self update" on public.profiles
  for update using (auth.uid() = id or public.is_current_admin());

-- subscriptions: user sees their own; admins see all; writes via service role
drop policy if exists "subs: self read" on public.subscriptions;
create policy "subs: self read" on public.subscriptions
  for select using (auth.uid() = user_id or public.is_current_admin());

-- entitlements
drop policy if exists "ent: self read" on public.entitlements;
create policy "ent: self read" on public.entitlements
  for select using (auth.uid() = user_id or public.is_current_admin());

-- progress: user rw on their own rows
drop policy if exists "progress: self read" on public.progress;
create policy "progress: self read" on public.progress
  for select using (auth.uid() = user_id or public.is_current_admin());

drop policy if exists "progress: self write" on public.progress;
create policy "progress: self write" on public.progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "progress: self update" on public.progress;
create policy "progress: self update" on public.progress
  for update using (auth.uid() = user_id);

drop policy if exists "progress: self delete" on public.progress;
create policy "progress: self delete" on public.progress
  for delete using (auth.uid() = user_id);

-- events: users can insert their own events; admins read all
drop policy if exists "events: self insert" on public.events;
create policy "events: self insert" on public.events
  for insert with check (auth.uid() = user_id or user_id is null);

drop policy if exists "events: admin read" on public.events;
create policy "events: admin read" on public.events
  for select using (public.is_current_admin());

-- ── 9. Admin: promote email to admin manually ──────────────────────────────
-- Example (run once per trusted email):
--   update public.profiles set is_admin = true, role = 'admin' where lower(email) = 'hello@couturehouse.co';

-- ── 10. Seed admin rows if they already exist ──────────────────────────────
update public.profiles
   set is_admin = true, role = 'admin'
 where lower(email) in (
   'hello@couturehouse.co',
   'teddychisom1963@gmail.com'
 );

-- ── DONE ────────────────────────────────────────────────────────────────────
