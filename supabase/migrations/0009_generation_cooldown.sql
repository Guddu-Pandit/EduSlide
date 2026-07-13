-- Per-user generation cooldown. After each deck generation we stamp a
-- timestamp here (2 min after a success, 1 min after a failure) and refuse
-- to start another generation until it passes — a simple rate-limit guard
-- that keeps us under the AI provider's quota.

alter table public.profiles
  add column if not exists generation_cooldown_until timestamptz;
