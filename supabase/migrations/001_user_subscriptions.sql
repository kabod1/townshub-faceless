-- ─── user_subscriptions ────────────────────────────────────────────────────
-- Run this in the Supabase SQL Editor (dashboard.supabase.com → SQL Editor).
-- This table stores each user's Stripe plan/status, linked by user_id.

create table if not exists public.user_subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid references auth.users(id) on delete cascade unique not null,
  plan                   text not null default 'starter'
                           check (plan in ('starter', 'pro', 'elite')),
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  stripe_price_id        text,
  status                 text not null default 'active'
                           check (status in ('active', 'trialing', 'past_due', 'canceled', 'unpaid')),
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Row-Level Security: users can only read their own row.
-- Writes are done server-side via the service role key (bypasses RLS).
alter table public.user_subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.user_subscriptions
  for select
  using (auth.uid() = user_id);

-- Helpful index for webhook lookups by Stripe customer ID
create index if not exists idx_user_subscriptions_stripe_customer
  on public.user_subscriptions (stripe_customer_id);

create index if not exists idx_user_subscriptions_stripe_subscription
  on public.user_subscriptions (stripe_subscription_id);
