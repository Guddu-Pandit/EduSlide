-- Track payment outcome and failure reason
alter table public.payments
  add column if not exists status text not null default 'success',
  add column if not exists error_description text;

-- Tighten insert policy: only the authenticated user can insert their own rows
drop policy if exists "Service role can insert payments" on public.payments;

create policy "Authenticated users can insert own payments"
  on public.payments
  for insert
  with check (auth.uid() = user_id);
