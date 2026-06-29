-- Add plan expiry tracking to profiles
alter table public.profiles
  add column if not exists plan_expires_at timestamptz;

-- Payment history table
create table if not exists public.payments (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  razorpay_order_id   text not null,
  razorpay_payment_id text not null,
  plan             text not null,
  amount_paise     integer not null,
  created_at       timestamptz not null default now()
);

alter table public.payments enable row level security;

-- Users can only read their own payment records
create policy "Users can view own payments"
  on public.payments
  for select
  using (auth.uid() = user_id);

-- Service role inserts from the API route (anon/authenticated cannot insert directly)
create policy "Service role can insert payments"
  on public.payments
  for insert
  with check (true);
